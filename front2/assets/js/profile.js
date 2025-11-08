// assets/js/profile.js
import { api, getToken, clearToken } from "./utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("You are not logged in!");
    window.location.href = "signin.html";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/users/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
         token: token,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to load profile");
    }

    // update the DOM
    document.getElementById("profileContainer").innerHTML = `
      <div class="profile-info"><strong>Name:</strong> ${data.name}</div>
      <div class="profile-info"><strong>Email:</strong> ${data.email}</div>
      <div class="profile-info"><strong>Joined:</strong> ${new Date(data.joined).toLocaleDateString()}</div>
    `;
  } catch (err) {
    console.error("Profile fetch error:", err);
    alert(err.message);
    localStorage.removeItem("token");
    window.location.href = "signin.html";
  }
});

// Logout button
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "signin.html";
});
