const admin = require("firebase-admin");

exports.handler = async function(event, context) {
  try {
    // Load Firebase credentials from environment variable
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

    // Initialize Firebase only once
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://dailyquiz-d5279-default-rtdb.firebaseio.com"
      });
    }

    const db = admin.database();
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const quizDate = `${yyyy}-${mm}-${dd}`;

    // Example question set
    const questions = [
      {
        question: "What does OPQRST stand for?",
        choices: ["Onset, Provocation, Quality, Radiation, Severity, Time", "Open, Push, Qualify, React, Speak, Test", "Observe, Pulse, Question, React, Systolic, Temperature"],
        answer: "Onset, Provocation, Quality, Radiation, Severity, Time"
      },
      {
        question: "What is the normal respiratory rate for an adult?",
        choices: ["8–14", "12–20", "20–30"],
        answer: "12–20"
      },
      {
        question: "Which of the following is a contraindication for nitroglycerin?",
        choices: ["Chest pain", "Systolic BP < 100", "Headache"],
        answer: "Systolic BP < 100"
      },
      {
        question: "Which of these is a sign of compensated shock?",
        choices: ["Low BP", "Unconsciousness", "Increased heart rate"],
        answer: "Increased heart rate"
      },
      {
        question: "How often should you reassess a stable patient?",
        choices: ["Every 15 minutes", "Every 5 minutes", "Once per call"],
        answer: "Every 15 minutes"
      }
    ];

    // Upload to Firebase
    await db.ref(`dailyQuizzes/${quizDate}`).set({
      date: quizDate,
      questions
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Quiz uploaded successfully", quizDate })
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Upload failed" })
    };
  }
};
