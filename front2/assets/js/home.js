

const baseURL = "http://localhost:5000/api/houses";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "signin.html";
}

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "signin.html";
});

document.getElementById("planForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const plan_name = document.getElementById("plan_name").value.trim();
  const total_area = document.getElementById("total_area").value.trim();
  const floors = document.getElementById("floors").value.trim();
  const rooms_count = document.getElementById("rooms_count").value.trim();

  if (!plan_name || !total_area || !floors || !rooms_count) {
    alert("Please fill all fields");
    return;
  }

  try {
    document.getElementById("planResult").innerHTML = "<p>Generating plan...</p>";

    const res = await fetch(`${baseURL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ plan_name, total_area, floors, rooms_count }),
    });

    const data = await res.json();

    if (data.success) {
      document.getElementById("planResult").innerHTML = `
        <h3>✅ Plan Generated Successfully</h3>
        <p><strong>Plan:</strong> ${plan_name}</p>
        <p><strong>Floors:</strong> ${floors}</p>
        <p><strong>Total Area:</strong> ${total_area} sqft</p>
        <img src="${data.imageUrl}" alt="Generated Plan" class="plan-image" />
        <button onclick="window.location.href='history.html'">View History</button>
      `;
    } else {
      document.getElementById("planResult").innerHTML = `<p>❌ ${data.message}</p>`;
    }
  } catch (error) {
    console.error(error);
    document.getElementById("planResult").innerHTML = `<p>❌ Error generating plan</p>`;
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
