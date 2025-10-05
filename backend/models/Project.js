const { db, dbUtils } = require('../config/database');

// Project model
class Project {
    static async create(title, description, imageUrl, projectUrl, technologies) {
        const sql = `INSERT INTO projects (title, description, image_url, project_url, technologies) VALUES (?, ?, ?, ?, ?)`;
        return await dbUtils.run(sql, [title, description, imageUrl, projectUrl, technologies]);
    }

    static async getAll() {
        const sql = `SELECT * FROM projects ORDER BY created_at DESC`;
        return await dbUtils.all(sql);
    }

    static async getById(id) {
        const sql = `SELECT * FROM projects WHERE id = ?`;
        return await dbUtils.get(sql, [id]);
    }

    static async update(id, title, description, imageUrl, projectUrl, technologies) {
        const sql = `UPDATE projects SET title = ?, description = ?, image_url = ?, project_url = ?, technologies = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        return await dbUtils.run(sql, [title, description, imageUrl, projectUrl, technologies, id]);
    }

    static async delete(id) {
        const sql = `DELETE FROM projects WHERE id = ?`;
        return await dbUtils.run(sql, [id]);
    }
}

module.exports = Project;
