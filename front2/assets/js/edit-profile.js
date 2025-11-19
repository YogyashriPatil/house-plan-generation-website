function showPopup(message, type = "success") {
  const popup = document.getElementById("popup");

  popup.textContent = message;
  popup.className = `popup show ${type}`;

  setTimeout(() => {
    popup.classList.remove("show");
  }, 2500);
}


document.getElementById("editForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstname = document.getElementById("firstname").value.trim();
    const lastname = document.getElementById("lastname").value.trim();
    const email = document.getElementById("email").value.trim();

    const token = localStorage.getItem("token");  // ⭐ Your token stored here

    if (!token) {
        document.getElementById("msg").innerText = "No token found. Please login.";
        return;
    }
// http://localhost:3000/users/update-profile
    try {
        const res = await fetch("http://localhost:3000/users/update-profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "token": token  // ⭐ Sending token in headers
            },
            body: JSON.stringify({ firstname, lastname, email })
        });
        const data = await res.json();
        if (data.success) {
            document.getElementById("msg").innerHTML = `<span style='color:#00ff9d'>Profile Updated!</span>`;
            showPopup("Profile updated successfully!", "success");

            setTimeout(() => {
              window.location.href = "home.html"; // redirect to home
            }, 2000);
        } else {
            document.getElementById("msg").innerHTML = `<span style='color:#ff4d6d'>${data.message}</span>`;
            showPopup(data.message || "Failed to update profile", "error");
        }

    } catch (err) {
        document.getElementById("msg").innerHTML = `<span style='color:#ff4d6d'>Server error! ${err}</span>`;
        showPopup("Server error while updating profile", "error");
    }
});
