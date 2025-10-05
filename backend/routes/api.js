const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const ContactMessage = require('../models/ContactMessage'); // Assuming you will create this model

// Get all projects
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.getAll();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve projects' });
    }
});

// Create a new project
router.post('/projects', async (req, res) => {
    const { title, description, imageUrl, projectUrl, technologies } = req.body;
    try {
        const result = await Project.create(title, description, imageUrl, projectUrl, technologies);
        res.status(201).json({ id: result.id, message: 'Project created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Contact form submission
router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        // Save contact message to the database
        const result = await ContactMessage.create(name, email, message); // Assuming you will create this model
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

module.exports = router;
