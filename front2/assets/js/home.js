

const baseURL = "http://localhost:5000/api/houses";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "signin.html";
}

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "signin.html";
});

document.getElementById("aplanForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const plan_name = document.getElementById("plan_name").value.trim();
  const total_area = document.getElementById("total_area").value.trim();
  const floors = document.getElementById("floors").value.trim();
  const rooms_count = document.getElementById("rooms_count").value.trim();
  const preferences = document.getElementById("preference").value.trim();


    const planResult = document.getElementById("planResult");
    const generateBtn = document.getElementById("generateBtn");
    const progressContainer = document.getElementById("progressContainer");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    const planImageContainer = document.getElementById("planImageContainer");
    const planImage = document.getElementById("planImage");
  if (!plan_name || !total_area || !floors || !rooms_count) {
    planResult.style.display = "block";
    planResult.textContent = "⚠️ Please fill all fields";
    planResult.style.color = "#ef4444";
    return;
  }

   // Reset UI
  planResult.style.display = "none";
  planImageContainer.style.display = "none";
  progressContainer.style.display = "block";
  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";

   // Simulate progress bar (0–100%)
  let progress = 0;
  const interval = setInterval(() => {
    if (progress >= 100) {
      clearInterval(interval);
    } else {
      progress += 5;
      progressBar.value = progress;
      progressText.textContent = `Generating... ${progress}%`;
    }
  }, 200);

  try {
    const response = await fetch("http://localhost:3000/houses/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": token
      },
      body: JSON.stringify({ plan_name, total_area, floors, rooms_count , preferences}),
    });

    const data = await response.json();
    clearInterval(interval);
    progressBar.value = 100;
    progressText.textContent = "✅ Task Completed";

    progressContainer.style.display = "none";
    generateBtn.textContent = "✅ Task Completed";
    generateBtn.style.backgroundColor = "#22c55e";

    planResult.style.display = "block";
    planResult.textContent = data.message;
    planResult.style.color = data.success ? "#22c55e" : "#ef4444";

    if (data.success && data.imageUrl) {
      planImageContainer.style.display = "block";
      planImage.src = data.imageUrl;
    } else {
      planResult.style.color = "#ef4444";
    }
  } catch (error) {
    clearInterval(interval);
    progressContainer.style.display = "none";
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate Plan";
    planResult.style.display = "block";
    planResult.style.color = "#ef4444";
    planResult.textContent = "❌ Server error. Please try again.";
    console.error(error);
  }
});

// assets/js/home.js
// import { api, getToken, clearToken } from "./utils.js";

// function qs(s){ return document.querySelector(s); }

// document.addEventListener("DOMContentLoaded", () => {
//   // show auth state
//   const token = getToken();
//   if (!token) {
//     qs("#authArea").innerHTML = `<a class="btn" href="/signin.html">Sign in</a> <a class="btn hollow" href="/signup.html">Sign up</a>`;
//   } else {
//     qs("#authArea").innerHTML = `<a class="btn" href="/profile.html">Profile</a> <button id="logout" class="btn hollow">Logout</button>`;
//     qs("#logout").addEventListener("click", () => { clearToken(); location.reload(); });
//   }

//   const form = qs("#generate-form");
//   form.addEventListener("submit", onGenerate);
// });

// async function onGenerate(e) {
//   e.preventDefault();
//   const user_id = document.querySelector("#user_id").value || 1;
//   const plan_name = document.querySelector("#plan_name").value || "My Plan";
//   const total_area = Number(document.querySelector("#total_area").value) || 1200;
//   const floors = Number(document.querySelector("#floors").value) || 1;
//   const rooms_count = Number(document.querySelector("#rooms_count").value) || 3;
//   const preferences = document.querySelector("#preferences").value || "";

//   // basic validation
//   if (total_area <= 0 || floors <= 0 || rooms_count <= 0) return showMsg("Please provide valid numbers", "error");
//   try {
//     showMsg("Generating plan — this can take a few seconds...", "info");
//     const res = await api.post("/users/generate", { user_id, plan_name, total_area, floors, rooms_count, preferences });
//     // backend returns plan and image_url / dxf_file etc
//     showMsg("Plan generated!", "success");

//     // show preview
//     const out = document.querySelector("#result");
//     out.innerHTML = "";
//     if (res.image_url) {
//       const img = document.createElement("img");
//       img.src = res.image_url;
//       img.alt = "Plan preview";
//       img.className = "preview";
//       out.appendChild(img);
//     }
//     if (res.dxf_file || res.dxf_url) {
//       const a = document.createElement("a");
//       a.href = res.dxf_url || res.dxf_file;
//       a.textContent = "Download DXF";
//       a.className = "link";
//       a.target = "_blank";
//       out.appendChild(a);
//     }

//     const pre = document.createElement("pre");
//     pre.textContent = JSON.stringify(res.plan || res, null, 2);
//     out.appendChild(pre);

//   } catch (err) {
//     console.error(err);
//     showMsg(err.body?.message || err.message || "Generation failed", "error");
//   }
// }

// function showMsg(msg, type="info") {
//   const el = document.getElementById("home-msg");
//   el.textContent = msg;
//   el.className = "msg " + type;
//   el.style.display = "block";
//   setTimeout(()=> el.style.display = "none", 6000);
// }
