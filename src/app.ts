import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import passportMidelware from "./middlewares/passport";
import autRoutes from "./routes/auth.routes";
import specialRoutes from "./routes/specia.routes";

// Initializations
const expressPort: number = Number(process.env.SERVERPORT) || 3000;
const app = express();
dotenv.config();

// Settings
app.set("port", expressPort);

//midelwares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
passport.use(passportMidelware);

//routes
app.get("/", (req, res) => {
  res.send("Hello Worlds!");
});

app.use(autRoutes);
app.use(specialRoutes);

export default app;
