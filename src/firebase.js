import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyBjbkWQtSz3EqVnVzSlyfFQSC3FFeYhk1U",
    authDomain: "he-said-she-said-f275d.firebaseapp.com",
    databaseURL: "https://he-said-she-said-f275d.firebaseio.com",
    projectId: "he-said-she-said-f275d",
    storageBucket: "he-said-she-said-f275d.appspot.com",
    messagingSenderId: "593239054615"
  }

firebase.initializeApp(config)
export default firebase