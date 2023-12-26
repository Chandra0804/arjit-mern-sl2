import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";;
import { register } from "./controllers/auth.js";
import User from "./models/User.js";

/* CONFIGURATIONS */
dotenv.config();
const allowedOrigins = [
  "https://nayepankh-react-frontend.vercel.app",
  "http://localhost:3000",
];
const app = express();
app.use(cors({
  origin: allowedOrigins,
  methods: ["POST", "GET"],
  credentials: true
}));

//app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
// }));
// app.options('*', cors()); // Enable preflight for all routes



app.use(express.json());

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));



app.post('/auth/register', (req, res) => {
  const { email } = req.body;
  console.log('Received email:', email);
  if (!email || !email.endsWith('@gmail.com')) {  
    res.send("invalidemail");
    return;
  }
  // Proceed to the register controller if the email is valid
  register(req, res);
});



/*ROUTES*/
app.use("/auth",authRoutes);

// Create a Mongoose schema and model
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
});

const Contact = mongoose.model('Contact', contactSchema);
// Endpoint to handle form submissions
app.post('/submitForm', (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Create a new Contact instance
  const newContact = new Contact({
    name,
    email,
    phone,
    subject,
    message,
  });

  // Save the new contact to the database
  newContact.save()
  .then(() => {
    res.status(200).send('Contact saved successfully');
  })
  .catch((err) => {
    res.status(500).send('Error saving contact to the database');
  });
});

/*MONGOOSE SETUP*/
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL)
.then(()=> {
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));

})
.catch((error) => {
    console.log(error);
})
