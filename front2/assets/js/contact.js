document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const statusMessage = document.getElementById('statusMessage');

    form.addEventListener('submit', async (e) => {
        // 1. Prevent the default form submission (which reloads the page)
        e.preventDefault();

        // 2. Get the data from the form fields
        const formData = {
            user_id: 2, // Assuming you temporarily hardcode this or fetch it from context
            name: form.elements.name.value,
            email: form.elements.email.value,
            message: form.elements.message.value,
        };

        statusMessage.textContent = 'Sending...';

        try {
            // 3. Define the backend endpoint URL
            const endpoint = '/contact/contactus'; 
            // NOTE: If your backend runs on a different port/address (e.g., http://localhost:3000), 
            // you must use the full URL here: 'http://localhost:3000/contact/contactus'

            // 4. Send the POST request using Fetch
            const response = await fetch(endpoint, {
                method: 'POST', // Must match your server route definition
                headers: {
                    // Tell the server the body is JSON
                    'Content-Type': 'application/json',
                },
                // Convert the JavaScript object to a JSON string
                body: JSON.stringify(formData),
            });

            // 5. Handle the response
            if (response.ok) {
                const result = await response.json();
                statusMessage.textContent = 'Success! Message saved.';
                form.reset(); // Clear the form on success
                console.log('Server response:', result);
            } else {
                // Handle 4xx or 5xx errors (e.g., 404, 500)
                statusMessage.textContent = `Error: ${response.status} - Could not save message.`;
            }
        } catch (error) {
            // Handle network errors (e.g., server is down)
            console.error('Network Error:', error);
            statusMessage.textContent = 'Network error: Could not connect to the server.';
        }
    });
});