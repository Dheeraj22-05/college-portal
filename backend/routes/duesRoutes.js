const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

// ================= VIEW DUES =================
router.get("/view", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "student") {

      const [studentRows] = await db.query(
        "SELECT id, current_semester FROM students WHERE user_id = ?",
        [req.user.id]
      );

      if (studentRows.length === 0) {
        return res.status(404).json({ message: "Student not found" });
      }

      const student = studentRows[0];

      const [rows] = await db.query(
        `SELECT id, department, amount, status, payment_mode
         FROM dues
         WHERE student_id = ?
         AND semester = ?`,
        [student.id, student.current_semester]
      );

      return res.json(rows);
    }

    if (req.user.role === "admin") {

      const departmentMap = {
        cs_lab_admin: "CS Lab",
        ds_lab_admin: "DS Lab",
        ai_lab_admin: "AI Lab",
        eee_lab_admin: "EEE Lab",
        ec_lab_admin: "EC Lab",
        me_lab_admin: "ME Lab",
        pta_admin: "PTA",
        bus_admin: "Bus",
        sports_admin: "Sports",
        placement_admin: "Placement",
        canteen_admin: "Canteen",
        hostel_admin: "Hostel",
        library_admin: "Library",
        office_admin: "Office",
        tutor_admin: "Tutor",
        hod_admin: "HOD"
      };

      const department = departmentMap[req.user.username];

      const [rows] = await db.query(
        `SELECT d.id, d.department, d.amount, d.status, d.payment_mode,
                s.name, s.reg_no, s.current_semester
         FROM dues d
         JOIN students s ON d.student_id = s.id
         WHERE d.department = ?
         AND d.semester = s.current_semester`,
        [department]
      );

      return res.json(rows);
    }

    if (req.user.role === "principal") {
      const [rows] = await db.query("SELECT * FROM students");
      return res.json(rows);
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching dues" });
  }
});

// ================= ADMIN CLEAR =================
router.put("/clear", verifyToken, async (req, res) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can clear manually." });
  }

  const { due_id } = req.body;

  await db.query(
    `UPDATE dues
     SET status = 'cleared',
         payment_mode = 'offline'
     WHERE id = ?`,
    [due_id]
  );

  res.json({ message: "Manual clearance successful" });
});

// ================= HISTORY =================
router.get("/history", verifyToken, async (req, res) => {

  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied" });
  }

  const [studentRows] = await db.query(
    "SELECT id FROM students WHERE user_id = ?",
    [req.user.id]
  );

  const studentId = studentRows[0].id;

  const [rows] = await db.query(
    `SELECT semester, department, amount, status, payment_mode
     FROM dues
     WHERE student_id = ?
     ORDER BY semester`,
    [studentId]
  );

  res.json(rows);
});

module.exports = router;