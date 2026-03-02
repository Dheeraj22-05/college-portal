const pool = require('../config/db');

exports.getNotifications = async (req, res) => {
    const [rows] = await pool.query("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 1");
    res.json(rows[0] || {});
};

exports.addNotification = async (req, res) => {
    const { message } = req.body;

    await pool.query(
        "INSERT INTO notifications (message) VALUES (?)",
        [message]
    );

    res.json({ message: "Notification added" });
};