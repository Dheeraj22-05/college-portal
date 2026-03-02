const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");


// ================= GET USER NOTIFICATIONS =================
router.get("/", verifyToken, async (req, res) => {
  try {

    const [rows] = await db.query(
      `SELECT id, message, type, is_read, created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});


// ================= MARK AS READ =================
router.put("/read/:id", verifyToken, async (req, res) => {
  try {

    await db.query(
      `UPDATE notifications
       SET is_read = 1
       WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );

    res.json({ message: "Notification marked as read" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update notification" });
  }
});

module.exports = router;