require("dotenv").config();
const bcrypt = require("bcrypt");
const db = require("./config/db");

const departments = ["CS", "DS", "AI", "EEE", "EC", "ME"];
const semesters = [1, 3, 5, 7];

const adminDepartments = [
  "CS Lab","DS Lab","AI Lab","EEE Lab","EC Lab","ME Lab",
  "PTA","Bus","Sports","Placement","Canteen",
  "Hostel","Library","Office","Tutor","HOD"
];

const seed = async () => {
  try {
    console.log("Rebuilding demo system...");

    await db.query("SET FOREIGN_KEY_CHECKS = 0");
    await db.query("TRUNCATE TABLE dues");
    await db.query("TRUNCATE TABLE students");
    await db.query("TRUNCATE TABLE users");
    await db.query("SET FOREIGN_KEY_CHECKS = 1");

    // ======================
    // PRINCIPAL
    // ======================
    const principalPass = await bcrypt.hash("principal123", 10);
    await db.query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      ["principal", principalPass, "principal"]
    );

    // ======================
    // ADMINS
    // ======================
    const adminUsernames = [
      "cs_lab_admin","ds_lab_admin","ai_lab_admin","eee_lab_admin","ec_lab_admin","me_lab_admin",
      "pta_admin","bus_admin","sports_admin","placement_admin","canteen_admin",
      "hostel_admin","library_admin","office_admin","tutor_admin","hod_admin"
    ];

    for (let username of adminUsernames) {
      const hashed = await bcrypt.hash("admin123", 10);
      await db.query(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [username, hashed, "admin"]
      );
    }

    let counter = 1;

    for (let sem of semesters) {
      for (let dept of departments) {

        const username = `student${counter}`;
        const hashedPassword = await bcrypt.hash("student123", 10);
        const regNo = `CET${sem}${counter.toString().padStart(3, "0")}`;

        const [userResult] = await db.query(
          "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
          [username, hashedPassword, "student"]
        );

        const userId = userResult.insertId;

        const [studentResult] = await db.query(
          `INSERT INTO students 
           (user_id, name, reg_no, department, current_semester, registration_status)
           VALUES (?, ?, ?, ?, ?, 'not_registered')`,
          [userId, `Student ${counter}`, regNo, dept, sem]
        );

        const studentId = studentResult.insertId;

        const fullNoDues = counter === 1 || counter === 2;

        for (let i = 0; i < adminDepartments.length; i++) {

          let amount;
          let status;

          // 🔹 ALWAYS start payment_mode as NULL
          let paymentMode = null;

          if (fullNoDues) {
            amount = 0;
            status = "no_dues";
          }
          else if (i < 5) {
            amount = 0;
            status = "no_dues";
          }
          else {
            amount = Math.floor(Math.random() * 3000) + 1000;
            status = "pending";
          }

          await db.query(
            `INSERT INTO dues 
             (student_id, department, amount, status, payment_mode, semester)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [studentId, adminDepartments[i], amount, status, paymentMode, sem]
          );
        }

        counter++;
      }
    }

    console.log("Demo system ready!");
    process.exit(0);

  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seed();