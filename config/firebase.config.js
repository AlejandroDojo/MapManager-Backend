const admin = require('firebase-admin');
const serviceAccount = require('../firebaseConfig/eventsimagedb-firebase-adminsdk-2hfoa-06c912268b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'eventsimagedb.appspot.com'
});

const bucket = admin.storage().bucket();

module.exports = {bucket};
