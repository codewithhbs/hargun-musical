const express = require('express');
const cors = require('cors');
const redis = require('redis');
const dotenv = require('dotenv');
const nodemailer = require("nodemailer");
dotenv.config();
const cookieParser = require('cookie-parser')
const ConnectDB = require('./database/database.config');
const route = require('./routes/routes');
const setupBullBoard = require('./bullboard');
const app = express();
const port = process.env.PORT;

const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};


// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());






app.get("/test-mail", async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASS
            }
        });

        let info = await transporter.sendMail({
            from: process.env.SMTP_MAIL,
            to: "codersvox@gmail.com",
            subject: "Test Email",
            html: "<h1>Mail Test Working ✔</h1>"
        });

        console.log("SMTP Config:", {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            user: process.env.SMTP_MAIL
        });

        res.send("Email Sent Successfully!");

    } catch (error) {
        console.log("Mail Error:", error);
        res.send("Mail Failed! Check console.");
    }
});





// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});
ConnectDB()
// Redis setup
const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
});
setupBullBoard(app);
const connectRedis = async () => {
    try {
        redisClient.on("error", (error) => {
            console.error(`Error connecting to Redis: ${error}`);
            process.exit(1);
        });
        redisClient.on("ready", () => console.log("Redis is ready"));
        await redisClient.connect();
        await redisClient.ping();
        app.locals.redis = redisClient;
    } catch (error) {
        console.error(`Error connecting to Redis: ${error}`);
        process.exit(1);
    }
};


(async () => {
    await connectRedis();
})();

app.use('/api/v1', route)
app.listen(port, () => {
    console.log(`Bull Board available at http://localhost:${port}/admin/queues`);
    console.log(`Server is running on http://localhost:${port}`);
});
