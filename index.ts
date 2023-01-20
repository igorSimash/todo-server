require("dotenv").config();
const express = require("express");
const cors = require('cors');

const registration = require("./routes/registration/Registration.ts");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", registration);

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Listening on port ${port}...`));