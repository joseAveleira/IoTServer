import express from "express";
import cors from "cors";
import dotenv from 'dotenv'


dotenv.config();
const expressPort: number =   Number(process.env.SERVERPORT) ||3000;


// Initializations
const app = express();

// Settings
app.set("port",  expressPort);

//midelwares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());


//test Express
app.get("/", (req, res) => {
  res.send("Hello Worlds!");
});



export default app