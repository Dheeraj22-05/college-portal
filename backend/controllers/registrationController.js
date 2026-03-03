const pool = require('../config/db');

// ===============================
// STUDENT APPLY FOR REGISTRATION
// ===============================
exports.applyRegistration = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get student
        const [student] = await pool.query(
            "SELECT * FROM students WHERE user_id = ?",
            [userId]
        );

        if (!student.length) {
            return res.status(404).json({ message: "Student not found" });
        }

        const studentData = student[0];

        if (studentData.status === 'archived') {
            return res.status(400).json({ message: "Archived students cannot register" });
        }

        // ===============================
        // NEW UNIVERSAL CLEARANCE CHECK
        // ===============================
        const [allDues] = await pool.query(
            "SELECT status FROM dues WHERE student_id = ?",
            [studentData.id]
        );

        const notCleared = allDues.some(
            d => d.status !== "cleared" && d.status !== "no_dues"
        );

        if (notCleared) {
            return res.status(400).json({ message: "All dues must be cleared before registration" });
        }

        // ===============================
        // Check if already applied
        // ===============================
        const [existing] = await pool.query(
            "SELECT * FROM registrations WHERE student_id = ? AND semester = ?",
            [studentData.id, studentData.current_semester + 1]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: "Already applied for next semester" });
        }

        // ===============================
        // Insert registration
        // ===============================
        await pool.query(
            "INSERT INTO registrations (student_id, semester, status) VALUES (?, ?, 'pending')",
            [studentData.id, studentData.current_semester + 1]
        );

        // Update student registration_status
        await pool.query(
            "UPDATE students SET registration_status='pending_approval' WHERE id=?",
            [studentData.id]
        );

        res.json({ message: "Registration applied successfully" });

    } catch (error) {
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};


// ===============================
// PRINCIPAL APPROVES REGISTRATION
// ===============================
exports.approveRegistration = async (req, res) => {
    try {
        const { registration_id } = req.body;

        const [registration] = await pool.query(
            "SELECT * FROM registrations WHERE id = ?",
            [registration_id]
        );

        if (!registration.length) {
            return res.status(404).json({ message: "Registration not found" });
        }

        const reg = registration[0];

        // Approve registration
        await pool.query(
            "UPDATE registrations SET status='approved' WHERE id=?",
            [registration_id]
        );

        // Update student semester
        await pool.query(
            "UPDATE students SET current_semester=?, registration_status='not_registered' WHERE id=?",
            [reg.semester, reg.student_id]
        );

        // Archive if final semester
        if (reg.semester >= 8) {
            await pool.query(
                "UPDATE students SET status='archived' WHERE id=?",
                [reg.student_id]
            );
        }

        res.json({ message: "Registration approved & semester updated" });

    } catch (error) {
        res.status(500).json({ message: "Approval failed", error: error.message });
    }
};


// ===============================
// VIEW REGISTRATIONS
// ===============================
exports.viewRegistrations = async (req, res) => {
    try {
        const [regs] = await pool.query(
            `SELECT r.id, s.name, s.reg_no, r.semester, r.status
             FROM registrations r
             JOIN students s ON r.student_id = s.id`
        );

        res.json(regs);

    } catch (error) {
        res.status(500).json({ message: "Error fetching registrations" });
    }
};