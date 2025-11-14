// assets/js/profile.js
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
    console.log(data.user);

    if (data.success && data.user) {
      document.getElementById("profileContainer").innerHTML = `
        <div class="profile-info"><strong>Name:</strong> ${data.user.firstName} ${data.user.lastName}</div>
        <div class="profile-info"><strong>Email:</strong> ${data.user.email}</div>
        <div class="profile-info"><strong>Joined:</strong> ${new Date(data.user.createdAt).toLocaleDateString()}</div>
      `;
    } else {
      alert("Unable to load profile!");
    }
  } catch (err) {
    console.error("Profile fetch error:", err);
    alert("Error loading profile");
    localStorage.removeItem("token");
    window.location.href = "signin.html";
  }
});

/* Logout Button */
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "signin.html";
});
