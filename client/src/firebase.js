import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

/**
 * Creates and initializes a Firebase app.
 */
const app = firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

export default app;
