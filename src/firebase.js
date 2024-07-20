
// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';

import 'firebase/compat/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyD8bVTARssCnLeb_rCIbRzOiAuZ85lw_g8",
  authDomain: "feedbackapp-5fd15.firebaseapp.com",
  projectId: "feedbackapp-5fd15",
  storageBucket: "feedbackapp-5fd15.appspot.com",
  messagingSenderId: "251204134378",
  appId: "1:251204134378:web:29a913f0aab799dc693e93",
  measurementId: "G-XWYJMJTYG3"
};




// Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();
const storage = firebase.storage();
export { firebase, firestore, storage};