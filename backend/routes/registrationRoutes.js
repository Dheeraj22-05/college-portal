const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");

const adminDepartments = [
  "CS Lab","DS Lab","AI Lab","EEE Lab","EC Lab","ME Lab",
  "PTA","Bus","Sports","Placement","Canteen",
  "Hostel","Library","Office","Tutor","HOD"
];

// ================= APPLY =================
router.put("/apply", verifyToken, async (req, res) => {

  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Access denied" });
  }

  const [studentRows] = await db.query(
    "SELECT * FROM students WHERE user_id = ?",
    [req.user.id]
  );

  const student = studentRows[0];

  const [pending] = await db.query(
    `SELECT * FROM dues
     WHERE student_id = ?
     AND semester = ?
     AND status = 'pending'`,
    [student.id, student.current_semester]
  );

  if (pending.length > 0) {
    return res.status(400).json({
      message: "Pending dues exist."
    });
  }

  await db.query(
    "UPDATE students SET registration_status = 'pending_approval' WHERE id = ?",
    [student.id]
  );

  res.json({ message: "Applied successfully." });
});

// ================= APPROVE =================
router.put("/approve/:id", verifyToken, async (req, res) => {

  if (req.user.role !== "principal") {
    return res.status(403).json({ message: "Access denied" });
  }

  const studentId = req.params.id;

  const [studentRows] = await db.query(
    "SELECT * FROM students WHERE id = ?",
    [studentId]
  );

  const student = studentRows[0];

  const nextSemester = student.current_semester + 1;

  await db.query(
    `UPDATE students
     SET current_semester = ?,
         registration_status = 'not_registered'
     WHERE id = ?`,
    [nextSemester, studentId]
  );

  // Create new semester dues
  for (let dep of adminDepartments) {

    let amount;
    let status = "offline";

    if (Math.random() < 0.3) {
      amount = 0;
      status = "cleared";
    } else if (Math.random() < 0.5) {
      amount = Math.floor(Math.random() * 3000) + 1000;
      status = "cleared";
    } else {
      amount = Math.floor(Math.random() * 3000) + 1000;
      status = "pending";
    }

    await db.query(
      `INSERT INTO dues
       (student_id, department, amount, status, payment_mode, semester)
       VALUES (?, ?, ?, ?, 'offline', ?)`,
      [studentId, dep, amount, status, nextSemester]
    );
  }

  res.json({ message: "Approved and new dues created." });
});

module.exports = router;