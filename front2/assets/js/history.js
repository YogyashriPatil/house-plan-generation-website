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
    const res = await fetch(`http://localhost:5000/api/houses/user/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (data.success && data.data.length > 0) {
      const container = document.getElementById("plansContainer");
      container.innerHTML = data.data
        .map(
          (plan) => `
          <div class="plan-card">
            <h3>${plan.plan_name}</h3>
            <img src="${plan.layout_image_url}" alt="Plan Image">
            <p><strong>Floors:</strong> ${plan.floors}</p>
            <p><strong>Area:</strong> ${plan.total_area} sqft</p>
            <button onclick="editPlan('${plan.id}')">Edit</button>
          </div>`
        )
        .join("");
    } else {
      document.getElementById("plansContainer").innerHTML =
        "<p>No plans found yet. Try generating one!</p>";
    }
  } catch (error) {
    console.error(error);
    document.getElementById("plansContainer").innerHTML = "<p>⚠️ Error fetching plans</p>";
  }
}

function editPlan(id) {
  alert(`Edit feature for Plan ID: ${id} (Coming soon)`);
}

fetchHistory();
