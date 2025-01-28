const user = require('../models/user-model');
const product = require('../models/product-model');

const home = async (req, res) => {
    try {
        res
            .status(200)
            .send("Welcome to mr.om sonani website, live life.")
    } catch (error) {
        console.log(error);
    }
}

const register = async (req, res, next) => {
    try {
        console.log(req.body);
        const { name, email, phone, password } = req.body

        const userExist = await user.findOne({ email });

        if (userExist) {
            return res.status(400).json({ message: "email already exists." })
        }

        const userCreate = await user.create({
            name,
            email,
            phone,
            password,
        })

        res.status(201).json({
            msg: "Registration successful.",
            token: await userCreate.generateToken(),
            userId: userCreate._id.toString(),
        })

    } catch (error) {
        console.log(req.body);
        next(error)
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const userExist = await user.findOne({ email })
        console.log(userExist);

        if (!userExist) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        const User = await userExist.comparePassword(password)

        if (User) {
            res.status(200).json({
                msg: "Login successful.",
                token: await userExist.generateToken(),
                userId: userExist._id.toString(),
            });
        } else {
            res.status(401).json({ message: "Invalid email or password." })
        }

    } catch (error) {
        res.status(500).json("internal server error.")
    }
}

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


module.exports = { home, register, login, products }