const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAllstudent = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT lname, fname, mname, user_id, course_id, created_at, updated_at FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
};

const getstudentById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT lname, fname, mname, user_id, course_id, created_at, updated_at FROM users', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user.' });
    }
};

const createstudent = async (req, res) => {
    const {lname, fname, mname, course_id, user_id } = req.body;

    try {
        const [result] = await pool.query('INSERT INTO course (lname, fname, mname, course_id, user_id) VALUES (?, ?, ?, ?)', [lname, fname, mname, course_id, user_id]);
        res.status(201).json({ id: result.insertId, lname, fname, mname, course_id, user_id});

    }catch (err) {
        res.status(500).json({ error: err.message });

    }
};

const updatestudent = async (req, res) => {
    const { id } = req.params;
    const { fullname, username, password } = req.body;

    try {
        const updates = [];
        const values = [];

        if (fullname) {
            updates.push('fullname = ?');
            values.push(fullname);
        }

        if (username) {
            updates.push('username = ?');
            values.push(username);
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.push('password = ?');
            values.push(hashedPassword);
        }

        values.push(id);
        const [result] = await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE user_id = ?`, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user.' });
    }
};

const deletestudent = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user.' });
    }
};

module.exports = { getAllstudent, getstudentById, createstudent, updatestudent, deletestudent };
