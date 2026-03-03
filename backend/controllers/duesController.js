const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const duesController = require("../controllers/duesController");

router.put("/pay-online", verifyToken, duesController.payOnline);
router.put("/clear", verifyToken, duesController.clearDue);
router.get("/view", verifyToken, duesController.getDues);

module.exports = router;
const pool = require('../config/db');


// ==========================================
// STUDENT ONLINE PAYMENT (AUTO CLEAR)
// ==========================================
exports.payOnline = async (req, res) => {
    try {
        const { due_id } = req.body;

        const [due] = await pool.query(
            "SELECT * FROM dues WHERE id = ?",
            [due_id]
        );

        if (!due.length) {
            return res.status(404).json({ message: "Due not found" });
        }

        if (due[0].status !== "pending") {
            return res.status(400).json({ message: "Already processed" });
        }

        await pool.query(
            "UPDATE dues SET status='cleared', payment_mode='online' WHERE id=?",
            [due_id]
        );

        res.json({ message: "Online payment successful" });

    } catch (error) {
        res.status(500).json({ message: "Payment failed", error: error.message });
    }
};


// ==========================================
// VIEW DUES
// ==========================================
exports.getDues = async (req, res) => {
    try {
        const user = req.user;

        if (user.role === 'student') {
            const [dues] = await pool.query(
                `SELECT d.id, d.department, d.amount, d.status, d.payment_mode
                 FROM dues d
                 JOIN students s ON d.student_id = s.id
                 WHERE s.user_id = ?`,
                [user.id]
            );
            return res.json(dues);
        }

        if (user.role === 'admin') {
            const [dues] = await pool.query(
                `SELECT d.id, s.name, s.reg_no,
                        s.department as student_department,
                        s.current_semester,
                        d.amount, d.status, d.payment_mode
                 FROM dues d
                 JOIN students s ON d.student_id = s.id
                 WHERE d.department = ?`,
                [req.user.department]
            );
            return res.json(dues);
        }

        if (user.role === 'principal') {
            const [dues] = await pool.query(
                `SELECT d.id, s.name, s.reg_no,
                        d.department, d.amount, d.status, d.payment_mode
                 FROM dues d
                 JOIN students s ON d.student_id = s.id`
            );
            return res.json(dues);
        }

    } catch (error) {
        res.status(500).json({ message: "Error fetching dues", error: error.message });
    }
};


// ==========================================
// ADMIN CLEAR (OFFLINE CLEAR)
// ==========================================
exports.clearDue = async (req, res) => {
    try {
        const { due_id } = req.body;

        const [due] = await pool.query(
            "SELECT * FROM dues WHERE id = ?",
            [due_id]
        );

        if (!due.length) {
            return res.status(404).json({ message: "Due not found" });
        }

        if (due[0].status !== "pending") {
            return res.status(400).json({ message: "Already processed" });
        }

        // Admin clears → mark as offline payment
        await pool.query(
            "UPDATE dues SET status='cleared', payment_mode='offline' WHERE id=?",
            [due_id]
        );

        res.json({ message: "Offline due cleared successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error clearing due", error: error.message });
    }
};