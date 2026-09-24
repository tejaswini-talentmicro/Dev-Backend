import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';


const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {

   const { firstName, LastName, emailId, password } = req.body;
   const hashedPassword = await bcrypt.hash(password, 10);
   const user = new User({
      firstName,
      LastName,
      emailId,
      password: hashedPassword
   });
   try {
      await user.save();
      res.status(201).send("User created successfully");
   }
   catch (error) {
      res.status(400).send("Error creating user: " + error.message);
   }

})

authRouter.post('/login', async (req, res) => {

   const { emailId, password } = req.body;
   try {
      const user = await User.findOne({ emailId });
      if (!user) {
         return res.status(404).send("User not found");
      }
      console.log(user)
      const isMatch = await user.validatePassword(password);
      if (!isMatch) {
         return res.status(400).send("Invalid credentials");
      }
      const token = await user.getJWT();
      res.cookie('token', token);
      res.status(200).send("Login successful");
   }
   catch (error) {
      res.status(500).send("Error during login: " + error.message);
   }
})

authRouter.post('/logout', (req, res) => {
    res.cookie('token',null)
    res.status(200).send("Logout successful");
})


export default authRouter;