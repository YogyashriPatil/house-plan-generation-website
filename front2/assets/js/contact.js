document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Get DOM elements
    const form = document.getElementById('contactForm');
    const statusMessage = document.getElementById('statusMessage');
    const logoutBtn = document.getElementById("logoutBtn");

    // 2. Retrieve authentication token
    const token = localStorage.getItem('token');
    
    // Check if the token and a basic user object exist
    let isUserLoggedIn = false;
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (token && user) {
            isUserLoggedIn = true;
        }
    } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
        // Treat as logged out if data is corrupted
    }

    // --- Contact Form Submission Logic ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        // 4. Get the contact data (DO NOT send user_id)
        const formData = {
            name: form.elements.name.value,
            email: form.elements.email.value,
            message: form.elements.message.value,
        };

        statusMessage.style.color = '#cba0ff'; // Set "Sending" color
        statusMessage.textContent = 'Sending message...';

        try {
            // 5. Define endpoint and send Fetch request
            // Use the full URL as frontend and backend are on different ports
            const endpoint = "http://localhost:3000/contact/contactus"; 
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Pass the token for backend authentication and user identification
                     token: token,
                },
                body: JSON.stringify(formData),
            });

            // 6. Handle the response
            if (response.ok) {
                // Success (2xx status code)
                const result = await response.json();
                statusMessage.style.color = 'lightgreen';
                statusMessage.textContent = 'Success! Message saved. Thank you for reaching out.';
                form.reset(); // Clear the form
                console.log('Server response:', result);
            } else {
                // Handle 4xx or 5xx errors from the server
                const errorData = await response.json();
                statusMessage.style.color = 'red';
                statusMessage.textContent = `Error: ${response.status} - ${errorData.message || 'Could not save message.'}`;
                console.error('Server error details:', errorData);
            }
        } catch (error) {
            // 7. Handle network errors (e.g., server down, connection failure)
            console.error('Network Error:', error);
            statusMessage.style.color = 'red';
            statusMessage.textContent = 'Network error: Could not connect to the backend server. Please try again later.';
        }
    });

    // --- Logout Functionality ---
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault(); // Stop the link from navigating immediately
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "signin.html";
        });
    }
});