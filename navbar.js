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

            // Fetch navbar HTML if needed
            fetch('navbar.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('navbar').innerHTML = data;
            });

            // Navigation functionality
            const nav = document.querySelector(".nav"),
                searchIcon = document.querySelector("#searchIcon"),
                navOpenBtn = document.querySelector(".navOpenBtn"),
                navCloseBtn = document.querySelector(".navCloseBtn");

            searchIcon.addEventListener("click", () => {
                nav.classList.toggle("openSearch");
                nav.classList.remove("openNav");
                if (nav.classList.contains("openSearch")) {
                    searchIcon.classList.replace("uil-search", "uil-times");
                } else {
                    searchIcon.classList.replace("uil-times", "uil-search");
                }
            });

            navOpenBtn.addEventListener("click", () => {
                nav.classList.add("openNav");
                nav.classList.remove("openSearch");
                searchIcon.classList.replace("uil-times", "uil-search");
            });

            navCloseBtn.addEventListener("click", () => {
                nav.classList.remove("openNav");
            });
        });
