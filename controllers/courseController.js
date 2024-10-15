const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAllcourse = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT course_id, course_code, course_name,user_id,dept_id, created_at, updated_at FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
};

const getcourseById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT course_id, course_code, course_name,user_id,dept_id, created_at, updated_at FROM users', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user.' });
    }
};

const createcourse = async (req, res) => {
    const { course_code, course_name, dept_id, user_id} = req.body;

    if (!course_code || !course_name || !user_id || !dept_id) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const [result] = await pool.query('INSERT INTO course (course_code, course_name, user_id) VALUES ( ?, ?, ?)', [course_code, course_name, dept_id, user_id ]);
        res.status(201).json({ id: result.insertId, course_code, course_name, dept_id, user_id }); // Removed password from response
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user.' });
    }
};

const updatecourse = async (req, res) => {
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

const deletecourse = async (req, res) => {
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

module.exports = { getAllcourse, getcourseById, createcourse, updatecourse, deletecourse };