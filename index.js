// server.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// GET route: /bfhl
app.get("/bfhl", (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

// POST route: /bfhl
app.post("/bfhl", (req, res) => {
    try {
        console.log("Received Data:", req.body);

        const { name, dob, email, roll_number, data } = req.body;

        if (!name || !dob || !email || !roll_number || !Array.isArray(data)) {
            return res.status(400).json({ is_success: false, message: "Invalid input format!" });
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
            return res.status(400).json({ is_success: false, message: "Invalid DOB format! Use YYYY-MM-DD." });
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ is_success: false, message: "Invalid email format!" });
        }

        let numbers = data.filter(item => !isNaN(item)).map(Number);
        let alphabets = data.filter(item => /^[a-zA-Z]+$/.test(item));
        let user_id = `${name.replace(/\s+/g, "_")}_${dob.replace(/-/g, "")}`;

        console.log("Processed Data:", { numbers, alphabets, user_id });

        res.status(200).json({
            is_success: true,
            user_id,
            email,
            roll_number,
            numbers,
            alphabets
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ is_success: false, message: "Server error!" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});