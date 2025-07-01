const admin = require("firebase-admin");

exports.handler = async function(event, context) {
  try {
    const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

    if (!serviceAccountString) {
      throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_JSON environment variable.");
    }

    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountString);
    } catch (err) {
      throw new Error("Failed to parse service account JSON: " + err.message);
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://dailyquiz-d5279-default-rtdb.firebaseio.com"
      });
    }

    const db = admin.database();
    const ref = db.ref("dailyQuizzes");

    // Replace this with your actual quiz data logic
    const quizData = {
      date: new Date().toISOString(),
      questions: [
        {
          question: "What is the first step in EMS patient assessment?",
          options: ["Scene safety", "Airway check", "Call for help", "Take vitals"],
          answer: "Scene safety"
        }
      ]
    };

    await ref.push(quizData);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Quiz uploaded successfully!" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
