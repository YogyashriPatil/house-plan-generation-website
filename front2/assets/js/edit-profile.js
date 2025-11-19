const API_URL = "http://localhost:3000/api/user";
const token = localStorage.getItem("token");

// Auto-fill user data
window.onload = async () => {
  try {
    const res = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token
      }
    });

    const data = await res.json();
    console.log("Profile:", data);

    if (data.success) {
      document.getElementById("name").value = data.user.name;
      document.getElementById("email").value = data.user.email;
      document.getElementById("phone").value = data.user.phone;
    }
  } catch (err) {
    console.log(err);
  }
};

// Save profile
async function updateProfile() {
  const payload = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value
  };

  try {
    const res = await fetch(`${API_URL}/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    alert(data.message);
  } catch (err) {
    console.log(err);
  }
}

// Change password
async function changePassword() {
  const oldPass = prompt("Enter old password:");
  const newPass = prompt("Enter new password:");

  if (!oldPass || !newPass) return alert("Fill both fields!");

  try {
    const res = await fetch(`${API_URL}/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token
      },
      body: JSON.stringify({ oldPass, newPass })
    });

    const data = await res.json();
    alert(data.message);

  } catch (err) {
    console.log(err);
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
