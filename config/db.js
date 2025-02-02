const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',         // replace with your MySQL username
    password: 'Munna@1106',         // replace with your MySQL password
    database: 'attendance_system'
});

db.connect(err => {
    if (err) {
        console.error('Database connection error: ' + err.stack);
        return;
    }
    console.log('Connected to the MySQL database');
});

module.exports = db;
