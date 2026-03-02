const express = require("express");
const router = express.Router();
const db = require("../config/db");
const verifyToken = require("../middleware/verifyToken");
const PDFDocument = require("pdfkit");

router.get("/:dueId", verifyToken, async (req, res) => {

  try {

    const dueId = req.params.dueId;

    const [rows] = await db.query(
      `SELECT d.*, s.name, s.reg_no, s.department AS student_department
       FROM dues d
       JOIN students s ON d.student_id = s.id
       WHERE d.id = ?`,
      [dueId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    const due = rows[0];

    if (due.status !== "cleared") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt_${dueId}.pdf`
    );

    doc.pipe(res);

    // College Header
    doc.fontSize(20).text("COLLEGE MANAGEMENT SYSTEM", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text("Fee Payment Receipt");
    doc.moveDown();

    doc.text(`Student Name: ${due.name}`);
    doc.text(`Register No: ${due.reg_no}`);
    doc.text(`Department: ${due.student_department}`);
    doc.text(`Semester: ${due.semester}`);
    doc.text(`Academic Year: ${due.academic_year}`);
    doc.moveDown();

    doc.text(`Fee Department: ${due.department}`);
    doc.text(`Amount Paid: ₹${due.amount}`);
    doc.text(`Payment Mode: ${due.payment_mode}`);
    doc.text(`Payment Status: ${due.status}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);

    doc.moveDown();
    doc.text("Authorized Signature", { align: "right" });

    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Receipt generation failed" });
  }
});

module.exports = router;