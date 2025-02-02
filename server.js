const express = require('express');
const app = express();
const path = require('path');
const attendanceRoutes = require('./routes/attendance');
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', attendanceRoutes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
