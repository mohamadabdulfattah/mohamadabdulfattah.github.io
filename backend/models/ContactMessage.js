const { db, dbUtils } = require('../config/database');

// ContactMessage model
class ContactMessage {
    static async create(name, email, message) {
        const sql = `INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)`;
        return await dbUtils.run(sql, [name, email, message]);
    }

    static async getAll() {
        const sql = `SELECT * FROM contact_messages ORDER BY created_at DESC`;
        return await dbUtils.all(sql);
    }

    static async getById(id) {
        const sql = `SELECT * FROM contact_messages WHERE id = ?`;
        return await dbUtils.get(sql, [id]);
    }

    static async markAsRead(id) {
        const sql = `UPDATE contact_messages SET is_read = 1 WHERE id = ?`;
        return await dbUtils.run(sql, [id]);
    }

    static async delete(id) {
        const sql = `DELETE FROM contact_messages WHERE id = ?`;
        return await dbUtils.run(sql, [id]);
    }

    static async getUnreadCount() {
        const sql = `SELECT COUNT(*) as count FROM contact_messages WHERE is_read = 0`;
        const result = await dbUtils.get(sql);
        return result ? result.count : 0;
    }
}

module.exports = ContactMessage;
