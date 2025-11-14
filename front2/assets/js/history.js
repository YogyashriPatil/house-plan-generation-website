const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token) window.location.href = "signin.html";

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "signin.html";
});

async function fetchHistory() {
  try {
    const res = await fetch(`http://localhost:3000/api/houses/history`, {
      headers: { 
        "Content-Type": "application/json",
        token : token 
      }
    });
    const data = await res.json();
    console.log("History API Response:", data);
    
    const container = document.getElementById("historyContainer");
    if (!container) {
      console.error("historyContainer not found in HTML");
      return;
    }

    if (data.success && Array.isArray(data.plans) && data.plans.length > 0) {
        container.innerHTML = data.plans
        .map(
          (plan) => `
          <div class="plan-card">
            <div class="card-header">${plan.planName}</div>
            <div class="card-sub">${plan.totalArea ? plan.totalArea : ""}</div>
            <div class="card-image-container">
              <img src="${plan.imageUrl}" class="card-image" alt="House Plan">
            </div>
            <div class="card-footer">${plan.createdAt}</div>
            <button onclick="editPlan('${plan.id}')">Edit</button>
          </div>`
        )
        .join("");
    } else {
      document.getElementById("historyContainer").innerHTML =
        "<p>No plans found yet. Try generating one!</p>";
    }
  } catch (error) {
     console.error("Fetch error:", error);
    console.error(error);
    document.getElementById("plansContainer").innerHTML = "<p>⚠️ Error fetching plans</p>";
  }
}

function editPlan(id) {
  alert(`Edit feature for Plan ID: ${id} (Coming soon)`);
}

fetchHistory();
