

const baseURL = "http://localhost:3000/api/houses";
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
  }, 900);

  try {
    const response = await fetch("http://localhost:3000/api/houses/generate", {
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
