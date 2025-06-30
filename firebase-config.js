// ONLY use this if you're using <script src="https://www.gstatic.com/firebasejs/..."> in HTML

const firebaseConfig = {
  apiKey: "AIzaSyDM6DpRSeZueVKRpbyJyDmhf8WY66KyCDk",
  authDomain: "dailyquiz-d5279.firebaseapp.com",
  databaseURL: "https://dailyquiz-d5279-default-rtdb.firebaseio.com",
  projectId: "dailyquiz-d5279",
  storageBucket: "dailyquiz-d5279.appspot.com",
  messagingSenderId: "94577748034",
  appId: "1:94577748034:web:c032d3a1d72db1313de5db",
  measurementId: "G-19DVN7NNH7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Optional: test connection
firebase.database().ref(".info/connected").on("value", (snap) => {
  if (snap.val() === true) {
    console.log("✅ Connected to Firebase");
  } else {
    console.error("❌ Not connected to Firebase");
  }
});
