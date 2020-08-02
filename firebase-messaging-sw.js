// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/7.17.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.17.1/firebase-messaging.js');

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAZWq9LTokegz3rjp2h8_J7GrNIYx6VcYk",
    authDomain: "chat-app-2-75a4d.firebaseapp.com",
    databaseURL: "https://chat-app-2-75a4d.firebaseio.com",
    projectId: "chat-app-2-75a4d",
    storageBucket: "chat-app-2-75a4d.appspot.com",
    messagingSenderId: "505433674415",
    appId: "1:505433674415:web:2e8ec203334e659338ba5a",
    measurementId: "G-N165JBZGW2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    return self.registration.showNotification(notificationTitle,
        notificationOptions);
});