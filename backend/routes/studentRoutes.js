const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

// ================= GET STUDENT PROFILE =================
router.get("/profile", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const [rows] = await db.query(
      `SELECT s.id, s.name, s.reg_no, s.department,
              s.current_semester, s.registration_status
       FROM students s
       WHERE s.user_id = ?`,
      [req.user.id]
    );

    res.json(rows[0]);

  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
});

// ================= PRINCIPAL: GET ALL STUDENTS =================
router.get("/", verifyToken, async (req, res) => {
  try {

    if (req.user.role !== "principal") {
      return res.status(403).json({ message: "Access denied" });
    }

    const [rows] = await db.query(
      `SELECT id, name, reg_no, department,
              current_semester, registration_status
       FROM students`
    );

    res.json(rows);
// ================= ADD STUDENT =================
router.post("/add", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "principal") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, reg_no, department, semester } = req.body;

    const [userResult] = await db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [reg_no, "$2b$10$temporaryhash", "student"]
    );

    await db.query(
      `INSERT INTO students (user_id, name, reg_no, department, current_semester, registration_status)
       VALUES (?, ?, ?, ?, ?, 'not_registered')`,
      [userResult.insertId, name, reg_no, department, semester]
    );

    res.json({ message: "Student added successfully" });

  } catch (error) {
    res.status(500).json({ message: "Error adding student" });
  }
});

// ================= DELETE STUDENT =================
router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "principal") {
      return res.status(403).json({ message: "Access denied" });
    }

    await db.query("DELETE FROM students WHERE id = ?", [req.params.id]);
    res.json({ message: "Student deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});
// ================= ARCHIVE STUDENT =================
router.put("/archive/:id", verifyToken, async (req, res) => {
  try {

    if (req.user.role !== "principal") {
      return res.status(403).json({ message: "Access denied" });
    }

    const studentId = req.params.id;

    const [studentRows] = await db.query(
      "SELECT * FROM students WHERE id = ?",
      [studentId]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = studentRows[0];

    if (student.current_semester < 8) {
      return res.status(400).json({
        message: "Only final year students can be archived"
      });
    }

    await db.query(
      `INSERT INTO archived_students (name, reg_no, department, final_semester)
       VALUES (?, ?, ?, ?)`,
      [student.name, student.reg_no, student.department, student.current_semester]
    );

    await db.query("DELETE FROM students WHERE id = ?", [studentId]);

    res.json({ message: "Student archived successfully" });

  } catch (error) {
    res.status(500).json({ message: "Archive failed" });
  }
});
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
});

module.exports = router;