// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDUPBlSukoFtvX-fHCMo0csv0LD3AlL66Q',
  authDomain: 'challenge-project-ae3f2.firebaseapp.com',
  projectId: 'challenge-project-ae3f2',
  storageBucket: 'challenge-project-ae3f2.appspot.com',
  messagingSenderId: '40729842447',
  appId: '1:40729842447:web:0d7132416a65eec988247a',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
export { db };
