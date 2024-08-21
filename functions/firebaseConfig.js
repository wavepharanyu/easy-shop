const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { getDatabase } = require('firebase-admin/database')
const { getAuth } = require('firebase-admin/auth')

initializeApp({
  projectId: 'easy-commerce-shop',
  //databaseURL: '<realtime database>' 
})

const db = getFirestore()
const auth = getAuth()
//const realtimeDB = getDatabase()

module.exports = {
  db,
  auth,
  //realtimeDB
}