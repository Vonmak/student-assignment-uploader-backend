const express = require("express");
const multer = require("multer");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Serve the uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-email-password",
  },
});

// Handle file upload and send email
app.post("/upload", upload.single("file"), (req, res) => {
  const { studentName, registrationNumber } = req.body;

  // Send email
  const mailOptions = {
    from: "your-email@gmail.com",
    to: "recipient-email@example.com", // Replace with the recipient's email address
    subject: "New Assignment Uploaded",
    text: `Student Name: ${studentName}\nRegistration Number: ${registrationNumber}`,
    attachments: [
      {
        path: `uploads/${req.file.filename}`,
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: "Error sending email" });
    }
    console.log("Email sent: " + info.response);
    res.json({ message: "File uploaded and email sent successfully" });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
