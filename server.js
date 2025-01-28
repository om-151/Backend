require("dotenv").config();
const express = require('express')
const cors = require("cors");
const connectDB = require("./utils/db")
const authRouter = require("./routes/auth-routes")
const contactRoute = require("./routes/contact-routes");
const bodyParser = require('body-parser');
const paymentRoute = require("./routes/payment-routes")

const app = express()
const port = process.env.PORT || 3000

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = ["http://localhost:5173", "https://frontend-p6xn.onrender.com"];
        const isAllowed = allowedOrigins.includes(origin);
        callback(null, isAllowed ? origin : false)
    },
    methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
    credentials: true,
}

app.use(cors(corsOptions))

app.use(express.json())
app.use(bodyParser.json())
app.use("/api/auth", authRouter)
app.use("/api/form", contactRoute)
app.use("/api/stripe", paymentRoute)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
    connectDB()
})