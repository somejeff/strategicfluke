const functions = require("firebase-functions");
const admin = require('firebase-admin')

admin.initializeApp()

exports.pruneAnonymousUsers = functions.https.onRequest(async (request, response) => {
   const result = await admin.auth().deleteUsers((await admin.auth().listUsers()).users.filter(u=>!u.emailVerified).map(u=>u.uid));
   response.send(JSON.stringify(result));
});
