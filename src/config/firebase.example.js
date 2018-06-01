import firebase from 'firebase'

var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
    }

firebase.initializeApp(config);

export const ref = firebase.database().ref();
export const auth = firebase.auth();
export const storage = firebase.storage().ref();