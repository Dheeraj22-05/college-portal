const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");


// ================= REVENUE OVERVIEW =================
router.get("/revenue", verifyToken, async (req, res) => {
  try {

    if (req.user.role !== "principal") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Total collected
    const [total] = await db.query(
      `SELECT SUM(amount) AS total
       FROM dues
       WHERE status = 'cleared'`
    );

    // Online vs Offline
    const [mode] = await db.query(
      `SELECT payment_mode, SUM(amount) AS total
       FROM dues
       WHERE status = 'cleared'
       GROUP BY payment_mode`
    );

    // Semester wise
    const [semester] = await db.query(
      `SELECT semester, SUM(amount) AS total
       FROM dues
       WHERE status = 'cleared'
       GROUP BY semester
       ORDER BY semester ASC`
    );

    // Department wise
    const [department] = await db.query(
      `SELECT department, SUM(amount) AS total
       FROM dues
       WHERE status = 'cleared'
       GROUP BY department`
    );

    res.json({
      total: total[0].total || 0,
      mode,
      semester,
      department
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Revenue fetch failed" });
  }
});
const ExcelJS = require("exceljs");


// ================= EXPORT REVENUE REPORT =================
router.get("/export-revenue", verifyToken, async (req, res) => {
  try {

    if (req.user.role !== "principal") {
      return res.status(403).json({ message: "Access denied" });
    }

    const [semesterData] = await db.query(
      `SELECT semester, SUM(amount) AS total
       FROM dues
       WHERE status = 'cleared'
       GROUP BY semester
       ORDER BY semester ASC`
    );

    const [departmentData] = await db.query(
      `SELECT department, SUM(amount) AS total
       FROM dues
       WHERE status = 'cleared'
       GROUP BY department`
    );

    const [totalData] = await db.query(
      `SELECT SUM(amount) AS total
       FROM dues
       WHERE status = 'cleared'`
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Revenue Report");

    sheet.columns = [
      { header: "Category", key: "category", width: 25 },
      { header: "Value", key: "value", width: 25 },
      { header: "Amount (₹)", key: "amount", width: 20 }
    ];

    sheet.addRow(["TOTAL COLLECTION", "", totalData[0].total || 0]);

    sheet.addRow([]);

    sheet.addRow(["SEMESTER WISE COLLECTION"]);
    semesterData.forEach(s => {
      sheet.addRow(["Semester", s.semester, s.total]);
    });

    sheet.addRow([]);

    sheet.addRow(["DEPARTMENT WISE COLLECTION"]);
    departmentData.forEach(d => {
      sheet.addRow(["Department", d.department, d.total]);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Revenue_Report.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Export failed" });
  }
});
module.exports = router;