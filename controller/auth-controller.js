const user = require('../models/user-model');
const product = require('../models/product-model');
const sendEmail = require("../utils/emailServices");

const home = async (req, res) => {
    try {
        res
            .status(200)
            .send("Welcome to mr.om sonani website, live life.")
    } catch (error) {
        console.error(error);
    }
}

// const register = async (req, res, next) => {
//     try {
//         const { name, email, phone, password } = req.body

//         const userExist = await user.findOne({ email });

//         if (userExist) {
//             return res.status(400).json({ message: "email already exists." })
//         }

//         const userCreate = await user.create({
//             name,
//             email,
//             phone,
//             password,
//         })

//         res.status(201).json({
//             msg: "Registration successful.",
//             token: await userCreate.generateToken(),
//             userId: userCreate._id.toString(),
//         })

//     } catch (error) {
//         console.error(req.body);
//         next(error)
//     }
// }

const register = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;

        const userExist = await user.findOne({ email });

        if (userExist) {
            return res.status(400).json({ message: "Email already exists." });
        }

        const userCreate = await user.create({
            name,
            email,
            phone,
            password,
        });

        const emailSent = await sendEmail(
            email,
            "Welcome to Humayoo - Your Shopping Journey Begins!",
            `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333;">Hello ${name},</h2>
        
                <p style="font-size: 16px; color: #555;">
                    Welcome to <strong style="color: #ff6f61;">Humayoo</strong>! 🎉 Your shopping adventure starts now.  
                    We bring you the best deals, latest trends, and a seamless shopping experience right at your fingertips.
                </p>
        
                <p style="font-size: 16px; color: #555;">
                    Explore thousands of products, enjoy exclusive discounts, and shop with confidence on Humayoo.
                </p>
        
                <div style="text-align: center; margin: 20px 0;">
                    <a href="https://frontend-p6xn.onrender.com"
                       style="background-color: #ff6f61; color: white; padding: 12px 24px; text-decoration: none; 
                       font-size: 16px; border-radius: 5px; display: inline-block; font-weight: bold;">
                        Start Shopping Now
                    </a>
                </div>
        
                <p style="font-size: 14px; color: #777;">
                    If you have any questions, feel free to reach out to our support team.  
                    We’re here to help you every step of the way.
                </p>
        
                <p style="font-size: 16px; color: #333;"><strong>Happy Shopping! 🛍️</strong></p>
                <p style="font-size: 16px; color: #333;"><strong>The Humayoo Team</strong></p>
            </div>
            `
        );

        if (!emailSent) {
            console.error("❌ Email failed to send.");
        }

        res.status(201).json({
            msg: "Registration successful.",
            token: await userCreate.generateToken(),
            userId: userCreate._id.toString(),
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
};

// const login = async (req, res) => {
//     try {
//         const { email, password } = req.body

//         const userExist = await user.findOne({ email })

//         if (!userExist) {
//             return res.status(400).json({ message: "Invalid Credentials" })
//         }

//         const User = await userExist.comparePassword(password)

//         if (User) {
//             res.status(200).json({
//                 msg: "Login successful.",
//                 token: await userExist.generateToken(),
//                 userId: userExist._id.toString(),
//             });
//         } else {
//             res.status(401).json({ message: "Invalid email or password." })
//         }

//     } catch (error) {
//         res.status(500).json("internal server error.")
//     }
// }
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExist = await user.findOne({ email });

        if (!userExist) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isPasswordCorrect = await userExist.comparePassword(password);

        if (isPasswordCorrect) {
            // ✅ Send Login Success Email
            const emailSent = await sendEmail(
                email,
                "Logged in Successfully - Welcome Back to Humayoo!",
                `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #333;">Hello ${userExist.name},</h2>

                    <p style="font-size: 16px; color: #555;">
                        Welcome back to <strong style="color: #ff6f61;">Humayoo</strong>! 🎉  
                        We're excited to have you back. Explore the latest deals, browse your favorite products, and continue your shopping journey with us.
                    </p>

                    <div style="text-align: center; margin: 20px 0;">
                        <a href="https://frontend-p6xn.onrender.com"
                           style="background-color: #ff6f61; color: white; padding: 12px 24px; text-decoration: none; 
                           font-size: 16px; border-radius: 5px; display: inline-block; font-weight: bold;">
                            Continue Shopping
                        </a>
                    </div>

                    <p style="font-size: 14px; color: #777;">
                        If this wasn't you, please secure your account by resetting your password.
                    </p>

                    <p style="font-size: 16px; color: #333;"><strong>Happy Shopping! 🛍️</strong></p>
                    <p style="font-size: 16px; color: #333;"><strong>The Humayoo Team</strong></p>
                </div>
                `
            );

            if (!emailSent) {
                console.error("⚠️ Failed to send login email.");
            }

            res.status(200).json({
                msg: "Login successful.",
                token: await userExist.generateToken(),
                userId: userExist._id.toString(),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password." });
        }

    } catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json("Internal server error.");
    }
};

const products = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;

    const category = req.query.category;
    const priceRange = req.query.priceRange;

    try {
        const filter = {};
        if (category) {
            filter.category = { $in: category.split(",") };
        }
        if (priceRange) {
            const [min, max] = priceRange.split(",").map(Number);
            filter.price = { $gte: min, $lte: max };
        }

        const totalProducts = await product.countDocuments(filter);

        const productsList = await product
            .find(filter)
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            total: totalProducts,
            page,
            pages: Math.ceil(totalProducts / limit),
            products: productsList,
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

const sendGoogleWelcomeEmail = async (req, res) => {
    try {
        const { name, email } = req.body;

        // ✅ Send Welcome Email
        const emailSent = await sendEmail(
            email,
            "Welcome to Humayoo - Your Shopping Adventure Begins!",
            `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Hello ${name},</h2>
                <p>Welcome to <strong>Humayoo</strong>! 🎉</p>
                <p>We’re thrilled to have you on board. Get ready to explore a wide range of products at the best prices, enjoy exclusive deals, and experience seamless shopping.</p>
                <p><a href="https://frontend-p6xn.onrender.com" style="background-color: #ff6f61; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Shopping Now</a></p>
                <p>Happy Shopping! 🛍️</p>
                <p><strong>The Humayoo Team</strong></p>
            </div>
            `
        );

        if (!emailSent) {
            console.error("⚠️ Failed to send Google signup email.");
            return res.status(500).json({ message: "Email sending failed" });
        }

        res.status(200).json({ msg: "Welcome email sent successfully." });

    } catch (error) {
        console.error("❌ Google Signup Email Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

module.exports = { home, register, login, products, sendGoogleWelcomeEmail }