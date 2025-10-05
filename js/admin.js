// Admin Dashboard JavaScript

// Check if user is logged in
const token = localStorage.getItem('adminToken');
if (!token) {
    alert('Please login first');
    window.location.href = 'admin-login.html';
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('adminToken');
    window.location.href = 'admin-login.html';
});

// Fetch dashboard statistics
async function fetchDashboardStats() {
    try {
        const response = await fetch('/admin/dashboard/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const stats = await response.json();
            document.getElementById('totalProjects').textContent = stats.totalProjects;
            document.getElementById('totalMessages').textContent = stats.totalMessages;
            document.getElementById('unreadMessages').textContent = stats.unreadMessages;
        } else {
            console.error('Failed to fetch stats');
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

// Fetch and display projects
async function fetchProjects() {
    try {
        const response = await fetch('/admin/projects', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
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
    const projectsList = document.getElementById('projectsList');
    projectsList.innerHTML = '';
    
    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project';
        projectElement.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <p><strong>Technologies:</strong> ${project.technologies}</p>
            <button onclick="editProject(${project.id})">Edit</button>
            <button onclick="deleteProject(${project.id})">Delete</button>
        `;
        projectsList.appendChild(projectElement);
    });
}

// Fetch and display messages
async function fetchMessages() {
    try {
        const response = await fetch('/admin/messages', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const messages = await response.json();
            displayMessages(messages);
        } else {
            console.error('Failed to fetch messages');
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

function displayMessages(messages) {
    const messagesList = document.getElementById('messagesList');
    messagesList.innerHTML = '';
    
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.is_read ? 'read' : 'unread'}`;
        messageElement.innerHTML = `
            <h4>From: ${message.name} (${message.email})</h4>
            <p>${message.message}</p>
            <small>Received: ${new Date(message.created_at).toLocaleString()}</small>
            ${!message.is_read ? `<button onclick="markAsRead(${message.id})">Mark as Read</button>` : ''}
            <button onclick="deleteMessage(${message.id})">Delete</button>
        `;
        messagesList.appendChild(messageElement);
    });
}

// Add new project functionality
document.getElementById('addProjectBtn').addEventListener('click', function() {
    // Simple prompt-based form for adding a new project
    const title = prompt('Enter project title:');
    if (!title) return;

    const description = prompt('Enter project description:');
    if (!description) return;

    const imageUrl = prompt('Enter image URL:');
    const projectUrl = prompt('Enter project URL:');
    const technologies = prompt('Enter technologies (comma-separated):');

    addProject(title, description, imageUrl, projectUrl, technologies);
});

// Function to add a new project
async function addProject(title, description, imageUrl, projectUrl, technologies) {
    try {
        const response = await fetch('/admin/projects', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, imageUrl, projectUrl, technologies })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Project added successfully!');
            fetchProjects(); // Refresh the projects list
            fetchDashboardStats(); // Refresh stats
        } else {
            alert(data.error || 'Failed to add project');
        }
    } catch (error) {
        console.error('Add project error:', error);
        alert('Failed to add project. Please try again.');
    }
}

// Function to edit a project
async function editProject(id) {
    // Get current project data first
    try {
        const response = await fetch('/admin/projects', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const projects = await response.json();
            const project = projects.find(p => p.id == id);

            if (project) {
                const title = prompt('Edit project title:', project.title);
                if (!title) return;

                const description = prompt('Edit project description:', project.description);
                if (!description) return;

                const imageUrl = prompt('Edit image URL:', project.image_url);
                const projectUrl = prompt('Edit project URL:', project.project_url);
                const technologies = prompt('Edit technologies:', project.technologies);

                updateProject(id, title, description, imageUrl, projectUrl, technologies);
            }
        }
    } catch (error) {
        console.error('Edit project error:', error);
        alert('Failed to load project data');
    }
}

// Function to update a project
async function updateProject(id, title, description, imageUrl, projectUrl, technologies) {
    try {
        const response = await fetch(`/admin/projects/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, imageUrl, projectUrl, technologies })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Project updated successfully!');
            fetchProjects(); // Refresh the projects list
        } else {
            alert(data.error || 'Failed to update project');
        }
    } catch (error) {
        console.error('Update project error:', error);
        alert('Failed to update project. Please try again.');
    }
}

// Function to delete a project
async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
        const response = await fetch(`/admin/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            alert('Project deleted successfully!');
            fetchProjects(); // Refresh the projects list
            fetchDashboardStats(); // Refresh stats
        } else {
            alert(data.error || 'Failed to delete project');
        }
    } catch (error) {
        console.error('Delete project error:', error);
        alert('Failed to delete project. Please try again.');
    }
}

// Function to mark a message as read
async function markAsRead(id) {
    try {
        const response = await fetch(`/admin/messages/${id}/read`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            alert('Message marked as read!');
            fetchMessages(); // Refresh the messages list
            fetchDashboardStats(); // Refresh stats
        } else {
            alert(data.error || 'Failed to mark message as read');
        }
    } catch (error) {
        console.error('Mark as read error:', error);
        alert('Failed to mark message as read. Please try again.');
    }
}

// Function to delete a message
async function deleteMessage(id) {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
        const response = await fetch(`/admin/messages/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            alert('Message deleted successfully!');
            fetchMessages(); // Refresh the messages list
            fetchDashboardStats(); // Refresh stats
        } else {
            alert(data.error || 'Failed to delete message');
        }
    } catch (error) {
        console.error('Delete message error:', error);
        alert('Failed to delete message. Please try again.');
    }
}

// Initialize dashboard
fetchDashboardStats();
fetchProjects();
fetchMessages();
