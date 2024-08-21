const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const express = require("express");

const app = express();

const { db, auth } = require("./firebaseConfig");

const omise = require('omise')({
  secretKey: process.env.OMISE_SECRET_KEY,
  omiseVersion: '2019-05-29'
})

const createCharge = (source, amount, orderId) => {
  return new Promise((resolve, reject) => {
    omise.charges.create({
      amount: (amount * 100),
      currency: 'THB',
      return_uri: `http://localhost:5173/success?order_id=${orderId}`,
      metadata: {
        orderId
      },
      source,
    }, (err, resp) => {
      if (err) {
        return reject(err)
      }
      resolve(resp)
    })
  })
}

app.post("/placeorder", async (req, res) => {
  try {
    const checkoutData = req.body.checkout;
    const sourceOmise = req.body.source
    let checkoutProducts = [];
    let totalPrice = 0;
    let orderData = {}
    let omiseResponse = {}
    let successOrderId = ''

    const products = checkoutData.products

    await db.runTransaction(async(t) => {
        for (const product of products) {
            const productRef = db.collection("products").doc(product.productId);
            const productSnapshot = await productRef.get();
            const productData = productSnapshot.data();
        
            let checkoutProduct = product;
            checkoutProduct.name = productData.name 
            checkoutProduct.imageUrl = productData.imageUrl 
            checkoutProduct.price = productData.price;
            checkoutProduct.totalPrice = productData.price * product.quantity;
            totalPrice += productData.price * product.quantity;
            checkoutProducts.push(checkoutProduct);

            if(productData.remainQuantity - product.quantity < 0){
                throw new Error (`Product ${productData.name} out of stock`)
            }

            t.update(productRef, {
                remainQuantity: productData.remainQuantity - product.quantity
            })

            const orderRef = db.collection('orders')

            const orderId = orderRef.doc().id

            omiseResponse = await createCharge(sourceOmise, totalPrice, orderId)

            orderData = { 
                ...checkoutData,
                chargeId: omiseResponse.id,
                products: checkoutProducts,
                totalPrice,
                paymentMethod: 'rabbit_linepay',
                createdAt: new Date(),
                status: 'pending'
            }

            t.set(orderRef.doc(orderId), orderData)

            successOrderId = orderId
        }
    })
    res.json({
        message: "Hello world!",
        redirectUrl: omiseResponse.authorize_uri 
    });
    
  } catch (error) {
    console.log('error', error)
  }
});

app.post('/webhook', async (req, res) => {
  try {
    if (req.body.key === 'charge.complete') {
      const paymentData = req.body.data

      const paymentStatus = paymentData.status
      const chargeId = paymentData.id
      const orderId = paymentData.metadata.orderId

      const orderRef = db.collection('orders').doc(orderId)
      const orderSnapshot = await orderRef.get()
      const orderData = orderSnapshot.data()

      // check correct order
      if (
        orderData.chargeId === chargeId &&
        orderData.status === 'pending'
      ) {
        await orderRef.update({
          status: paymentStatus
        })

        if (paymentStatus !== 'successful') {
          // คืน stock
          await db.runTransaction(async (transaction) => {
            for (const product of orderData.products) {
              const productRef = db.collection('products').doc(product.productId)
              const snapshot = await transaction.get(productRef)
              let productData = snapshot.data()
              productData.remainQuantity += product.quantity
              transaction.update(productRef, {
                remainQuantity: productData.remainQuantity
              })
            }
          })

          console.log('restore stock success')
        }
      }

      console.log('success data', {
        chargeId,
        orderId
      })
    }
  } catch (error) {
    console.log('error', error)
  }
})

exports.api = onRequest(app);
