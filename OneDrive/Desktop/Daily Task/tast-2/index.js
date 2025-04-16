import express from "express";
//import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/menu.js";
import { connectdb } from "./db/connectDb.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const initialize = async () => {
    try {
        const db_status = await connectdb();

        app.get("/", (req, res) => {
            res.status(200).json({ message: "hi world" });
        });
        app.use("/api/menu", router);
        app.listen(PORT, async () => {
            if (db_status) {
                console.log("database connected!");
            } else {
                console.log("database couldn't connect ");
                process.exit(1);
            }
            console.log(`server is runnung on http://localhost:${PORT}`);
            console.log("=========================================>");
        });
    } catch (error) {
        console.log("server not started:", error.message);
        process.exit(1);
    }
};

initialize();
