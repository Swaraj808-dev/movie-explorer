const loginBtn = document.getElementById("login-btn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginPage = document.getElementById("login-page");
const homePage = document.getElementById("home-page");
const welcomeText = document.getElementById("welcome-text");
const toggleLink = document.getElementById("toggle-link");

let isSignup = false;

toggleLink.addEventListener("click", () => {
    isSignup = !isSignup;

    if (isSignup) {
        document.querySelector("h1").innerText = "Create Account";
        loginBtn.innerText = "Sign Up";
        toggleLink.innerText = "Sign In";
    } else {
        document.querySelector("h1").innerText = "Login";
        loginBtn.innerText = "Login";
        toggleLink.innerText = "Create Account";
    }
});

loginBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        alert("Fill all fields");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (isSignup) {
        const exists = users.find(user => user.username === username);

        if (exists) {
            alert("User already exists!");
            return;
        }

        users.push({ username, password });
        localStorage.setItem("users", JSON.stringify(users));

        alert("Account created! Please login.");

        isSignup = false;
        document.querySelector("h1").innerText = "Login";
        loginBtn.innerText = "Login";
        toggleLink.innerText = "Create Account";

    } else {
        const user = users.find(
            user => user.username === username && user.password === password
        );

        if (user) {
            showHome(username);
        } else {
            alert("Invalid credentials");
        }
    }
});

// Show home page with welcome message
function showHome(username) {
    loginPage.style.display = "none";
    homePage.style.display = "block";

    const moodQuestion = document.getElementById("mood-question");
    const moodContainer = document.getElementById("mood-container");

    const text = `Welcome back, <span>${username}</span> 🍿`;

    welcomeText.style.animation = "none";
    welcomeText.offsetHeight;

    welcomeText.innerHTML = text;

    welcomeText.style.animation = "typing 2s steps(25, end) forwards";

    moodQuestion.style.display = "none";
    moodContainer.style.display = "none";


    setTimeout(() => {
        moodQuestion.style.display = "block";
        moodContainer.style.display = "flex";
    }, 1000);
}

const API_KEY = 'f9e849811c48b9e949fdaad9f86ecfbf';
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";


const moodMap = {
    happy: 35,
    romantic: 10749,
    action: 28,
    horror: 27,
    sad: 18,
    thriller: 53,
    chill: 16,
    adventure: 12,
    "sci-fi": 878,
    family: 10751
};

document.getElementById("mood-container").addEventListener("click", (e) => {
    const mood = e.target.dataset.mood;
    if (!mood) return;

    fetchMovies(moodMap[mood]);

    document.querySelectorAll("#mood-container button").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
});


function fetchMovies(genreId) {
    fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`)
        .then(res => res.json())
        .then(data => showMovies(data.results))
        .catch(err => console.log("Error:", err));
}

function showMovies(movies) {
    const container = document.getElementById("movie-container");
    container.innerHTML = "";

    movies = movies.filter(movie => movie.poster_path);

    movies = movies.sort((a, b) => b.vote_average - a.vote_average);

    movies.forEach(movie => {
        const div = document.createElement("div");
        div.classList.add("movie");

        div.innerHTML = `
            <img src="${IMG_URL + movie.poster_path}">
        `;

        div.addEventListener("click", () => openPopup(movie));

        container.appendChild(div);
    });
}

const searchBar = document.getElementById("search-bar");

searchBar.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        const query = searchBar.value.trim();

        console.log("Searching:", query);

        if (query !== "") {
            searchMovies(query);
        }
    }
});

function searchMovies(query) {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`;

    console.log("URL:", url);

    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log("Results:", data);
            showMovies(data.results);
        })
        .catch(err => console.log("Error:", err));
}


const popup = document.getElementById("movie-popup");
const popupImg = document.getElementById("popup-img");
const popupTitle = document.getElementById("popup-title");
const popupRating = document.getElementById("popup-rating");
const popupDate = document.getElementById("popup-date");
const popupOverview = document.getElementById("popup-overview");
const closePopup = document.getElementById("close-popup");

function openPopup(movie) {
    popup.classList.remove("hidden");

    popupImg.src = IMG_URL + movie.poster_path;
    popupTitle.innerText = movie.title;
    popupRating.innerText = "⭐ " + movie.vote_average;
    popupDate.innerText = "📅 " + movie.release_date;
    popupOverview.innerText = movie.overview;
}

closePopup.addEventListener("click", () => {
    popup.classList.add("hidden");

popup.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.classList.add("hidden");
    }
});
});