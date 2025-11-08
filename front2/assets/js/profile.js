// assets/js/profile.js
import { api, getToken, clearToken } from "./utils.js";

const tokenP = localStorage.getItem("token");
const userData = JSON.parse(localStorage.getItem("user"));

if (!tokenP) window.location.href = "signin.html";

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "signin.html";
});

function showProfile() {
  const container = document.getElementById("profileContainer");

  if (!userData) {
    container.innerHTML = "<p>No user data found.</p>";
    return;
  }

  container.innerHTML = `
    <div class="profile-card">
      <h2>${userData.name}</h2>
      <p><strong>Email:</strong> ${userData.email}</p>
      <p><strong>User ID:</strong> ${userData.id}</p>
      <button onclick="editProfile()">Edit Profile</button>
    </div>
  `;
}

function editProfile() {
  alert("Profile editing coming soon!");
}

showProfile();

document.addEventListener("DOMContentLoaded", async () => {
  const token = getToken();
  if (!token) {
    location.href = "/signin.html";
    return;
  }

  try {
    const res = await api.get("/users/profile");
    const container = document.getElementById("profile");
    container.innerHTML = `
      <h3>${res.user.firstName} ${res.user.lastName}</h3>
      <p><strong>Email:</strong> ${res.user.email}</p>
      <p><strong>Joined:</strong> ${new Date(res.user.createdAt).toLocaleString()}</p>
      <a class="btn" href="/index.html">Create Plan</a>
      <button id="logout" class="btn hollow">Logout</button>
    `;
    document.getElementById("logout").addEventListener("click", () => { clearToken(); location.href = "/signin.html"; });
  } catch (err) {
    console.error(err);
    if (err.status === 401) {
      clearToken();
      location.href = "/signin.html";
    } else {
      document.getElementById("profile").textContent = "Failed to load profile";
    }
  }
});
