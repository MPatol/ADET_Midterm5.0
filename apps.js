const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const deptRoutes = require('./routes/deptRoutes'); // Import deptRoutes
const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
    res.send("Matt Patol, SIT");
});

// Define routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dept', deptRoutes); // Use deptRoutes
app.use('/api/course', courseRoutes);
app.use('/api/course', studentRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


