const loginBtn = document.getElementById("login-btn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const loginPage = document.getElementById("login-page");
const homePage = document.getElementById("home-page");
const welcomeText = document.getElementById("welcome-text");

const toggleLink = document.querySelector("span");

let isSignup = false;

//SignIN/SignUP Toggle
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

//handle Login/Signup
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
    loginPage.classList.add("hidden");
    homePage.classList.remove("hidden");

    const text = `Welcome back, <span>${username}</span> 🍿`;

    // Reset animation
    welcomeText.style.animation = "none";
    welcomeText.offsetHeight;

    welcomeText.innerHTML = text;

    // Reapply animation
    welcomeText.style.animation = "typing 2s steps(25, end) forwards";
}