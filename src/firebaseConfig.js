import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
const { initializeAppCheck, ReCaptchaV3Provider } = require("firebase/app-check");
const firebaseApp = initializeApp({
    "apiKey": process.env.VUE_APP_FIREBASE_API_KEY,
    "authDomain": "strategicfluke.firebaseapp.com",
    "projectId": "strategicfluke",
    "storageBucket": "strategicfluke.appspot.com",
    "messagingSenderId": "742807218245",
    "appId": "1:742807218245:web:adbed60ad857cc1e3c1b2c",
    "measurementId": "G-LVY276N72Y"
});
initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaV3Provider(process.env.VUE_APP_FIREBASE_RECAPTCHA_KEY),
    isTokenAutoRefreshEnabled: true
});
const auth = getAuth(firebaseApp);
const db = getDatabase();
const fb = { auth, db }
export default fb;