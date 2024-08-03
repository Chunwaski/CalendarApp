import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyARVI4voC-ucxjj0XZRKtj9B_cRZokpwLg",
  authDomain: "calendarapp-d5f9c.firebaseapp.com",
  databaseURL: "https://calendarapp-d5f9c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "calendarapp-d5f9c",
  storageBucket: "calendarapp-d5f9c",
  messagingSenderId: "208301182287",
  appId: "1:208301182287:web:4eac8808801ad82bd8893a",
  measurementId: "G-5BPVYWCBMW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
  const signOutBtn = document.getElementById('signOutBtn');
  const navOpenBtn = document.querySelector('.navOpenBtn');
  const overlay = document.querySelector('.overlay');

  signOutBtn.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent the default link behavior

    try {
      await signOut(auth);
      console.log('User signed out successfully.');
      // Optionally redirect to login page or show a message
      window.location.href = 'index.html'; // Replace with your login page URL
    } catch (error) {
      console.error('Error signing out:', error);
    }
  });

  navOpenBtn.addEventListener('click', toggleNav);
  overlay.addEventListener('click', toggleNav);

  function toggleNav() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('openNav');
  }
});

