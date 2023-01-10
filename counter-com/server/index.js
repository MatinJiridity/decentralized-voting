
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import { listenToEvent } from './controllers/web3.js';

import userRouter from "./routes/user.js";

import adminRouter from "./routes/admin.js";

const app = express();

app.use("/admin", adminRouter); 

app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());

// added route for users
app.use("/user", userRouter); 

const CONNECTION_URL = "mongodb+srv://matin:nFc9R17sa4kMJKmb@cluster0.rbrvkez.mongodb.net/?retryWrites=true&w=majority";
const PORT = process.env.PORT|| 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)), listenToEvent())
  .catch((error) => console.log(`${error} did not connect`));

mongoose.set('useFindAndModify', false);

