const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const ContactMessage = require('../models/ContactMessage');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Admin login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await User.verifyPassword(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get dashboard stats (protected)
router.get('/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        const totalProjects = (await Project.getAll()).length;
        const totalMessages = (await ContactMessage.getAll()).length;
        const unreadMessages = await ContactMessage.getUnreadCount();

        res.json({
            totalProjects,
            totalMessages,
            unreadMessages
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get dashboard stats' });
    }
});

// Project management routes (protected)
router.get('/projects', authenticateToken, async (req, res) => {
    try {
        const projects = await Project.getAll();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve projects' });
    }
});

router.post('/projects', authenticateToken, async (req, res) => {
    const { title, description, imageUrl, projectUrl, technologies } = req.body;
    try {
        const result = await Project.create(title, description, imageUrl, projectUrl, technologies);
        res.status(201).json({ id: result.id, message: 'Project created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create project' });
    }
});

router.put('/projects/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, description, imageUrl, projectUrl, technologies } = req.body;
    try {
        await Project.update(id, title, description, imageUrl, projectUrl, technologies);
        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update project' });
    }
});

router.delete('/projects/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await Project.delete(id);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// Contact messages management (protected)
router.get('/messages', authenticateToken, async (req, res) => {
    try {
        const messages = await ContactMessage.getAll();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
});

router.put('/messages/:id/read', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await ContactMessage.markAsRead(id);
        res.json({ message: 'Message marked as read' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to mark message as read' });
    }
});

router.delete('/messages/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        await ContactMessage.delete(id);
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

module.exports = router;
