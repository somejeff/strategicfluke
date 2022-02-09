import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
const config = require('@/firebaseConfig.json');
const firebaseApp = initializeApp(config);
const auth = getAuth(firebaseApp);
const db = getDatabase();
const fb = { auth , db }
export default fb;