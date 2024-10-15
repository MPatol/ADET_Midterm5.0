const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT user_id, fullname, username, created_at, updated_at FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT user_id, fullname, username, created_at, updated_at FROM users WHERE user_id = ?', [id]);
        console.log('Query result:', rows);
        console.log('Fetching user with ID:', id);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(rows[0]);
    } catch (err) {
    console.error('Error fetching user:', err); // Log the error details
    res.status(500).json({ error: 'Failed to fetch user.' });
    }
};

const createUser = async (req, res) => {
    const { fullname, username, password } = req.body;

    if (!fullname || !username || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query('INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)', [fullname, username, hashedPassword]);
        res.status(201).json({ id: result.insertId, fullname, username }); 
    } catch (err) {
        res.status(500).json({ error: 'Failed to create user.' });
    }
};

const updateUser = async (req, res) => {
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

const deleteUser = async (req, res) => {
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

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };