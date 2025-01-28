const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
})

userSchema.pre("save", async function (next) {
    const User = this;

    if (!User.isModified("password")) {
        next()
    }

    try {
        const saltRound = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(User.password, saltRound);
        User.password = hash_password
    } catch (error) {
        next(error)
    }
})

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)
}

userSchema.methods.generateToken = async function () {
    try {
        return jwt.sign(
            {
                userId: this._id.toString(),
                email: this.email,
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1d",
            }
        );
    } catch (error) {
        console.error(error);
    }
};

const user = new mongoose.model("USER", userSchema);
module.exports = user;