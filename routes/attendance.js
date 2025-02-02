const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Route to search attendance for a given date
router.get('/attendance/search', (req, res) => {
    const { date } = req.query;

    // Query to check if attendance is already marked for the given date
    const query = `
        SELECT students.id, students.name, attendance.status
        FROM students
        LEFT JOIN attendance ON students.id = attendance.student_id AND attendance.date = ?
    `;
    
    db.query(query, [date], (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error fetching attendance');
        }
        res.json({ students: results });
    });
});

// Route to submit attendance
router.post('/attendance/submit', (req, res) => {
    const { date, attendanceData } = req.body;

    attendanceData.forEach(({ studentId, status }) => {
        const query = 'INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)';
        db.query(query, [studentId, date, status], (err) => {
            if (err) {
                console.log(err);
            }
        });
    });

    res.json({ message: 'Attendance submitted successfully' });
});

// Route to fetch all students
router.get('/students', (req, res) => {
    const query = 'SELECT * FROM students';

    db.query(query, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error fetching students');
        }
        res.json({ students: results });
    });
});


router.get('/attendance/report', (req, res) => {
    const query = `
        SELECT s.id AS student_id, s.name, 
               COUNT(DISTINCT a.date) AS total_classes,
               SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS present_count,
               SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) AS absent_count,
               (SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) * 100 / COUNT(DISTINCT a.date)) AS attendance_percentage
        FROM students s
        LEFT JOIN attendance a ON s.id = a.student_id
        GROUP BY s.id, s.name;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching attendance report:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    
        res.json({ attendance_report: results })
       
    });
});

module.exports = router;
