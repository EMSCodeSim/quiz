const admin = require('firebase-admin');
const { onRequest } = require('firebase-functions/v2/https');

// Decode and parse the service account JSON from environment variable
const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountRaw) {
  throw new Error('Missing FIREBASE_SERVICE_ACCOUNT env variable.');
}

let serviceAccount;
try {
  const fixedServiceAccountJSON = serviceAccountRaw.replace(/\\n/g, '\n');
  serviceAccount = JSON.parse(fixedServiceAccountJSON);
} catch (error) {
  throw new Error(`Failed to parse service account JSON: ${error.message}`);
}

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://dailyquiz-d5279-default-rtdb.firebaseio.com',
  });
}

const db = admin.database();

exports.handler = async function (event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const data = JSON.parse(event.body);

    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, '0');
    const day = `${now.getDate()}`.padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    await db.ref(`dailyQuizzes/${dateKey}`).set(data);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, dateKey }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
