const pool = require('../config/db');

// ADD DUE (Principal only or automatic setup later)
exports.addDue = async (req, res) => {
    try {
        const { student_id, department, amount } = req.body;

        if (!student_id || !department || !amount) {
            return res.status(400).json({ message: "All fields required" });
        }

        await pool.query(
            "INSERT INTO dues (student_id, department, amount, status) VALUES (?, ?, ?, 'pending')",
            [student_id, department, amount]
        );

        res.json({ message: "Due added successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error adding due", error: error.message });
    }
};

// VIEW DUES (Student sees own, Admin sees department)
exports.getDues = async (req, res) => {
    try {
        const user = req.user;

        if (user.role === 'student') {
            const [dues] = await pool.query(
                `SELECT d.department, d.amount, d.status, d.payment_mode
                 FROM dues d
                 JOIN students s ON d.student_id = s.id
                 WHERE s.user_id = ?`,
                [user.id]
            );
            return res.json(dues);
        }

        if (user.role === 'admin') {
            const [dues] = await pool.query(
                `SELECT d.id, s.name, s.reg_no, d.amount, d.status
                 FROM dues d
                 JOIN students s ON d.student_id = s.id
                 WHERE d.department = ?`,
                [req.user.department]
            );
            return res.json(dues);
        }

        if (user.role === 'principal') {
            const [dues] = await pool.query(
                `SELECT d.id, s.name, s.reg_no, d.department, d.amount, d.status
                 FROM dues d
                 JOIN students s ON d.student_id = s.id`
            );
            return res.json(dues);
        }

    } catch (error) {
        res.status(500).json({ message: "Error fetching dues", error: error.message });
    }
};

// CLEAR DUE (Admin only for their department)
exports.clearDue = async (req, res) => {
    try {
        const { due_id } = req.body;

        const [due] = await pool.query(
            "SELECT * FROM dues WHERE id = ?",
            [due_id]
        );

        if (due.length === 0) {
            return res.status(404).json({ message: "Due not found" });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Only admin can clear due" });
        }

        if (due[0].department !== req.user.department) {
            return res.status(403).json({ message: "You can only clear your department dues" });
        }

        await pool.query(
            "UPDATE dues SET status='cleared' WHERE id=?",
            [due_id]
        );

        res.json({ message: "Due cleared successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error clearing due", error: error.message });
    }
};