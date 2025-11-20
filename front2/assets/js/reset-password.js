document.addEventListener("DOMContentLoaded", () => {
  const updateBtn = document.getElementById("updatePasswordBtn");
  const popupMsg = document.getElementById("popupMsg");

  // Show popup function
  function showPopup(message, success = true) {
    popupMsg.style.display = "block";
    popupMsg.style.background = success ? "#1b8f3c" : "#b61b1b";
    popupMsg.textContent = message;

    setTimeout(() => {
      popupMsg.style.display = "none";
    }, 2500);
  }

  updateBtn.addEventListener("click", async () => {
    const oldPassword = document.getElementById("oldPassword").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (!oldPassword || !newPassword || !confirmPassword) {
      showPopup("All fields are required", false);
      return;
    }

    if (newPassword !== confirmPassword) {
      showPopup("New passwords do not match", false);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showPopup("Unauthorized. Please login again.", false);
      setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/users/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({
          oldPass: oldPassword,
          newPass: newPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showPopup("Password updated successfully!", true);

        setTimeout(() => {
          window.location.href = "home.html";
        }, 2000);
      } else {
        showPopup(data.message || "Error updating password", false);
      }
    } catch (err) {
      showPopup("Server error. Try again later.", false);
      console.log("Frontend Error:", err);
    }
  });

  // Logout Button
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
  });
});
