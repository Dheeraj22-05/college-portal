const pool = require('../config/db');

// ADD STUDENT (Principal Only)
exports.addStudent = async (req, res) => {
    try {
        const { name, reg_no, department, current_semester, username, password } = req.body;

        if (!name || !reg_no || !department || !current_semester || !username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create login for student
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(password, 10);

        const [userResult] = await pool.query(
            "INSERT INTO users (username, password, role, department) VALUES (?, ?, 'student', ?)",
            [username, hashedPassword, department]
        );

        const userId = userResult.insertId;

        // Insert into students table
        await pool.query(
            "INSERT INTO students (user_id, name, reg_no, department, current_semester) VALUES (?, ?, ?, ?, ?)",
            [userId, name, reg_no, department, current_semester]
        );

        res.json({ message: "Student added successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error adding student", error: error.message });
    }
};

// VIEW STUDENTS
exports.getStudents = async (req, res) => {
    try {
        const [students] = await pool.query(
            "SELECT s.id, s.name, s.reg_no, s.department, s.current_semester, s.status FROM students s WHERE s.status='active'"
        );

        res.json(students);

    } catch (error) {
        res.status(500).json({ message: "Error fetching students", error: error.message });
    }
};