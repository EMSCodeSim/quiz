const fs = require("fs");
const path = require("path");

exports.handler = async function (event, context) {
  try {
    // Your full question bank (simulate a large pool)
    const fullQuestionBank = require("./questionBank.json"); // Make sure this file exists
    const shuffled = fullQuestionBank.sort(() => 0.5 - Math.random());
    const dailyQuestions = shuffled.slice(0, 5);

    // Simulate a write (to local file within build folder)
    const outputPath = path.join(__dirname, "dailyQuiz.json");
    fs.writeFileSync(outputPath, JSON.stringify({
      date: new Date().toISOString().split("T")[0],
      questions: dailyQuestions,
    }, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Daily quiz created successfully", questions: dailyQuestions }),
    };
  } catch (error) {
    console.error("Error generating quiz:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create quiz" }),
    };
  }
};
