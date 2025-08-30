import express from "express";
import { config } from "dotenv";
import { connectDb } from "./config/db";
import userRoute from "./routes/user.route";
import projectRoute from "./routes/project.route";
import errorHandler from "./middleware/error.middleware";

config();

const app = express();

app.use(express.json());

(async () => {
  await connectDb();
})();

app.use("/api/v1/users", userRoute);
app.use("/api/v1/projects", projectRoute);

app.use(errorHandler);

app.listen(process.env.SERVER_PORT, () => {
  console.log(process.env.SERVER_PORT);
  console.log("Server started listening...");
});
