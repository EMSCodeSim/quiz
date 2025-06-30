const admin = require("firebase-admin");
const questionBank = require("../../questionBank.json");

// Parse service account key from Netlify environment variable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dailyquiz-d5279-default-rtdb.firebaseio.com"
  });
}

const db = admin.database();

exports.handler = async function (event, context) {
  const today = new Date().toISOString().split("T")[0];
  const selected = shuffleArray(questionBank).slice(0, 5);
  const payload = {};
  selected.forEach((q, i) => payload[i] = q);

  await db.ref(`quizzes
