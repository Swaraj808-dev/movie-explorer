const API_KEY = "f9e849811c48b9e949fdaad9f86ecfbf";

const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

const loginBtn = document.getElementById("login-btn");
const usernameInput = document.getElementById("username");
const loginScreen = document.getElementById("login-screen");
const app = document.getElementById("app");
const popup = document.getElementById("popup");
const greeting = document.getElementById("greeting");
const container = document.getElementById("movie-container");
const searchInput = document.getElementById("search");

const moods = {
    happy: 35,
    romantic: 10749,
    dark: 53,
    scary: 27,
    action: 28,
    chill: 10751,
    sad: 18,
    sciFi: 878
};

loginBtn.addEventListener("click", () => {
    const name = usernameInput.value.trim();
    if (!name) return;

    localStorage.setItem("username", name);
    showApp(name);
});

function showApp(name) {
    loginScreen.classList.add("hidden");
    app.classList.remove("hidden");

    greeting.innerText = `Hi ${name}, what's your mood today?`;
    popup.classList.remove("hidden");

    setTimeout(() => {
        popup.classList.add("hidden");
    }, 3000);

    fetchTrending();
}

window.onload = () => {
    const savedName = localStorage.getItem("username");
    if (savedName) {
        showApp(savedName);
    }
};

function fetchTrending() {
    fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(data => showMovies(data.results))
        .catch(err => console.log(err));
}

function showMovies(movies) {
    container.innerHTML = "";

    movies.forEach(movie => {
        if (!movie.poster_path) return;

        const div = document.createElement("div");
        div.classList.add("movie");

        div.innerHTML = `
            <img src="${IMG_URL + movie.poster_path}">
            <h3>${movie.title}</h3>
        `;

        container.appendChild(div);
    });
}

document.getElementById("moods").addEventListener("click", (e) => {
    const mood = e.target.dataset.mood;
    if (!mood) return;

    const genreId = moods[mood];

    fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`)
        .then(res => res.json())
        .then(data => showMovies(data.results))
        .catch(err => console.log(err));
});

searchInput.addEventListener("keyup", () => {
    const query = searchInput.value.trim();

    if (!query) {
        fetchTrending();
        return;
    }

    fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`)
        .then(res => res.json())
        .then(data => showMovies(data.results))
        .catch(err => console.log(err));
});