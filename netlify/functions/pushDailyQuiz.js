const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://dailyquiz-d5279-default-rtdb.firebaseio.com"
  });
}

const db = admin.database();

exports.handler = async function (event, context) {
  try {
    const filePath = path.join(__dirname, "questionBank.json"); // <--- FIXED
    const rawData = fs.readFileSync(filePath);
    const allQuestions = JSON.parse(rawData);

    const today = new Date();
    const dayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const dailySet = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);

    await db.ref("dailyQuizzes/" + dayKey).set(dailySet);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Daily quiz uploaded successfully", count: dailySet.length })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
