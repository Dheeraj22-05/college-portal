require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const duesRoutes = require('./routes/duesRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const principalRoutes = require("./routes/principalRoutes");
const receiptRoutes = require("./routes/receiptRoutes");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   DATABASE CONNECTION TEST
========================= */
(async () => {
    try {
        await pool.query("SELECT 1");
        console.log("Connected to MySQL database");
    } catch (err) {
        console.error("Database connection failed:", err);
    }
})();

/* =========================
   ROUTES
========================= */
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/dues', duesRoutes);
app.use('/api/registration', registrationRoutes);
app.use("/api/principal", principalRoutes);
app.use("/api/receipt", receiptRoutes);
app.get("/", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        res.json({ message: "Backend + Database Connected Successfully" });
    } catch (error) {
        res.status(500).json({ error: "Database Connection Failed" });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});