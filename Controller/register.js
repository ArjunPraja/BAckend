const { User, validateUser } = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const RegisterUser = async (req, res) => {
    try {
        // Extract user input
        const { username, email, password, contact } = req.body;
        console.log(username,email,password,contact)
        // Validate input using Joi
        const { error } = validateUser({ username, email, password, contact });
        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }

        // Check if the user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User with this email already exists." });
        }

        // Hash the password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user
        const newUser = new User({
            username,
            email,
            contact,
            password: hashedPassword, // Store the hashed password
        });

        // Save the user to the database
        await newUser.save();

        // Generate a JWT token for authentication
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Send response with token
        res.status(201).json({
            msg: "User registered successfully",
            token,
            user: {
                id: newUser.uuid,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
        });

    } catch (error) {
        console.error("Error in registration:", error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};





module.exports = RegisterUser;
