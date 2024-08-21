const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const express = require("express");

const app = express();

const { db, auth } = require("./firebaseConfig");

app.post("/placeorder", async (req, res) => {
  try {
    const checkoutData = req.body.checkout;
    let checkoutProducts = [];
    let totalPrice = 0;
    let orderData = {}
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

            orderData = { 
                ...checkoutData,
                chargeId: `charge ${orderId}`,
                products: checkoutProducts,
                totalPrice,
                paymentMethod: 'rabbit_linepay',
                createdAt: new Date(),
                status: 'successful'
            }

            t.set(orderRef.doc(orderId), orderData)

            successOrderId = orderId
        }
    })
    res.json({
        message: "Hello world!",
        redirectUrl: `http://localhost:5173/success?order_id=${successOrderId}`
    });
    
  } catch (error) {
    console.log('error', error)
  }
});

exports.api = onRequest(app);
