console.log('main.js loaded'); // Confirm script is running

document.addEventListener('DOMContentLoaded', function() {
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default form submission

            // Gather form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Validate form data
            if (name && email && message) {
                try {
                    // Send contact message to backend
                    const response = await fetch('/api/contact', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ name, email, message })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        alert('Your message has been sent successfully!');
                        // Reset the form
                        contactForm.reset();
                    } else {
                        alert(data.error || 'Failed to send message');
                    }
                } catch (error) {
                    console.error('Contact form error:', error);
                    alert('Failed to send message. Please try again.');
                }
            } else {
                alert('Please fill in all fields.');
            }
        });
    }

    // Login Form Submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default form submission

            // Gather form data
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Validate form data
            if (username && password) {
                try {
                    // Send login request to backend
                    const response = await fetch('/admin/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username, password })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        // Store JWT token
                        localStorage.setItem('adminToken', data.token);
                        // Redirect to admin dashboard
                        window.location.href = 'admin-dashboard.html';
                    } else {
                        alert(data.error || 'Login failed');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    alert('Login failed. Please try again.');
                }
            } else {
                alert('Please fill in all fields.');
            }
        });
    }

    // Fetch and display projects on projects.html
    if (window.location.pathname.endsWith('projects.html')) {
        fetchProjects();
    }
});

// Fetch projects from API and display them
async function fetchProjects() {
    try {
        const response = await fetch('/api/projects');
        if (response.ok) {
            const projects = await response.json();
            displayProjects(projects);
        } else {
            console.error('Failed to fetch projects');
        }
    } catch (error) {
        console.error('Error fetching projects:', error);
    }
}

function displayProjects(projects) {
    const container = document.getElementById('projectsContainer');
    container.innerHTML = '';

    projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project';

        projectDiv.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <img src="${project.image_url}" alt="loading..." width="200" height="200">
            <p><strong>Technologies:</strong> ${project.technologies}</p>
            <a href="${project.project_url}" target="_blank" rel="noopener noreferrer">View Project</a>
        `;

        container.appendChild(projectDiv);
    });
}
