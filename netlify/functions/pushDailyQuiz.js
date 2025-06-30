// pushDailyQuiz.js - Netlify function to upload 5 quiz questions to Firebase using env var

const admin = require("firebase-admin");
const questionBank = require("./questionBank.json");

// Parse Firebase Admin SDK credentials from environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dailyquiz-d5279-default-rtdb.firebaseio.com"
  });
}

exports.handler = async function (event, context) {
  const today = new Date().toISOString().split("T")[0]; // e.g., "2025-06-30"
  const ref = admin.database().ref(`/quizzes/${today}`);

  // Select 5 unique random questions
  const selected = [];
  const usedIndexes = new Set();

  while (selected.length < 5 && usedIndexes.size < questionBank.length) {
    const index = Math.floor(Math.random() * questionBank.length);
    if (!usedIndexes.has(index)) {
      usedIndexes.add(index);
      selected.push(questionBank[index]);
    }
  }

  try {
    await ref.set(selected);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `✅ Successfully uploaded ${selected.length} questions for ${today}`
      })
    };
  } catch (error) {
    console.error("Firebase upload error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

