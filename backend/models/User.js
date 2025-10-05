const { db, dbUtils } = require('../config/database');
const bcrypt = require('bcryptjs');

// User model
class User {
    static async create(username, password, email) {
        const passwordHash = bcrypt.hashSync(password, 10);
        const sql = `INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)`;
        return await dbUtils.run(sql, [username, passwordHash, email]);
    }

    static async findByUsername(username) {
        const sql = `SELECT * FROM users WHERE username = ?`;
        return await dbUtils.get(sql, [username]);
    }

    static async findByUsernameUpdated(username) {
        const sql = `SELECT * FROM users WHERE username = ?`;
        return await dbUtils.get(sql, [username]);
    }

    static async findById(id) {
        const sql = `SELECT * FROM users WHERE id = ?`;
        return await dbUtils.get(sql, [id]);
    }

    static async getAll() {
        const sql = `SELECT id, username, email, created_at FROM users ORDER BY created_at DESC`;
        return await dbUtils.all(sql);
    }

    static async update(id, username, email) {
        const sql = `UPDATE users SET username = ?, email = ? WHERE id = ?`;
        return await dbUtils.run(sql, [username, email, id]);
    }

    static async updatePassword(id, newPassword) {
        const passwordHash = bcrypt.hashSync(newPassword, 10);
        const sql = `UPDATE users SET password_hash = ? WHERE id = ?`;
        return await dbUtils.run(sql, [passwordHash, id]);
    }

    static async delete(id) {
        const sql = `DELETE FROM users WHERE id = ?`;
        return await dbUtils.run(sql, [id]);
    }

    static async verifyPassword(plainPassword, hashedPassword) {
        return bcrypt.compareSync(plainPassword, hashedPassword);
    }
}

module.exports = User;
