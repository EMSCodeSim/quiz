const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

exports.handler = async function (event, context) {
  try {
    // Load service account JSON from environment variable
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

    // Fix \n to real newlines in private_key
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

    // Initialize Firebase only once
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://dailyquiz-d5279-default-rtdb.firebaseio.com"
      });
    }

    const db = admin.database();

    // Load question bank JSON (2000 questions)
    const questionsPath = path.join(__dirname, "questions.json");
    const allQuestions = JSON.parse(fs.readFileSync(questionsPath, "utf8"));

    // Pick 5 random questions
    const todayQuestions = [];
    const usedIndexes = new Set();
    while (todayQuestions.length < 5 && usedIndexes.size < allQuestions.length) {
      const i = Math.floor(Math.random() * allQuestions.length);
      if (!usedIndexes.has(i)) {
        todayQuestions.push(allQuestions[i]);
        usedIndexes.add(i);
      }
    }

    // Get today's date
    const today = new Date().toISOString().split("T")[0];

    // Push to Firebase under /dailyQuiz/yyyy-mm-dd
    await db.ref(`dailyQuiz/${today}`).set(todayQuestions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Quiz for ${today} uploaded successfully.`, count: todayQuestions.length })
    };

  } catch (error) {
    console.error("Upload error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Upload failed." })
    };
  }
};
