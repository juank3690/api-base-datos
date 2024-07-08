import express from "express";
import {PORT} from "./config.js";
import authRouter from "./routes/authRouter.js";
import sectionRouter from "./routes/sectionRouter.js";
import taskRouter from "./routes/taskRouter.js";
import userRouter from "./routes/userRouter.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Kanban API");
});

app.use("/api",authRouter);
app.use("/api",sectionRouter);
app.use("/api",taskRouter);
app.use("/api",userRouter);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
