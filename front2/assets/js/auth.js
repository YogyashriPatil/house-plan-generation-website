const baseURL = "http://localhost:5000/api/users"; // your backend base URL

document.getElementById("signinForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // success
    console.log('Login success:', data);
    if (data.success) {
      localStorage.setItem("token", data.token);
      // Show success popup
        const popup = document.getElementById("successPopup");
        popup.classList.add("active");

        // Redirect after 2 sec
        setTimeout(() => {
          window.location.href = "home.html"; // your page
        }, 2000);
      
    } else {
      alert(data.message || "Sign-in failed");
    }
  } catch (err) {
    console.error(err);
    alert("Invalid credential");
  }
});

document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstname = document.getElementById("firstname").value.trim();
  const lastname = document.getElementById("lastname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  // console.log(firstname,lastname,email,password)
  console.log(firstname, lastname, email, password );
  if (!firstname ) {
    alert("firstname");
    return;
  }
  if  (!lastname ) {
    alert("lastname");
    return;
  }
    if  (!email ) {
    alert("email");
    return;
  }
  if  (!password) {
    alert("password");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName:firstname, lastName: lastname, email, password }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Signup successful! Please sign in.");
      window.location.href = "signin.html";
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});
