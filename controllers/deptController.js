const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAlldept = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT dept_id, dept_code, dept_name,user_id, created_at, updated_at FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
};

const getdeptById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT dept_id, dept_code, dept_name,user_id, created_at, updated_at FROM users', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user.' });
    }
};

const createdept = async (req, res) => {
    const {dept_code, dept_name, user_id } = req.body;

    try {
        const [result] = await pool.query('INSERT INTO departments (dept_code, dept_name, user_id) VALUES (?, ?, ?)', [dept_code,dept_name, user_id]);
        res.status(201).json({ id: result.insertId, dept_code, dept_name, user_id});

    }catch (err) {
        res.status(500).json({ error: err.message });

    }
};


const updatedept = async (req, res) => {
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

const deletedept = async (req, res) => {
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

module.exports = { getAlldept, getdeptById, createdept, updatedept, deletedept };
