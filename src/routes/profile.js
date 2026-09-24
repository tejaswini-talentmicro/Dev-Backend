import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import authMiddleware from '../middleware/auth.js';
import express from 'express';  


const profileRouter = express.Router();


profileRouter.get('/users',authMiddleware, async (req, res) => {
   try {
      const users = await User.find();
      res.status(200).json(users);
   }
   catch (error) {
      res.status(500).send("Error fetching users: " + error.message);
   }
})

profileRouter.get('/users/:id',authMiddleware, async (req, res) => {
   try {
      const user = await User.findById(req.params.id);
      if (!user) {
         return res.status(404).send("User not found");
      }
      res.status(200).json(user);
   }
   catch (error) {
      res.status(500).send("Error fetching user: " + error.message);
   }
})

profileRouter.put('/users/:id',authMiddleware, async (req, res) => {
   try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { runValidators: true });
      if (!user) {
         return res.status(404).send("User not found");
      }
      res.status(200).json(user);
   }
   catch (error) {
      res.status(500).send("Error updating user: " + error.message);
   }
})

profileRouter.delete('/users/:id',authMiddleware, async (req, res) => {
   try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
         return res.status(404).send("User not found");
      }
      res.status(200).send("User deleted successfully");
   }
   catch (error) {
      res.status(500).send("Error deleting user: " + error.message);
   }
})

profileRouter.patch('/users/edit/:id',authMiddleware, async (req, res) => {
    const allowedUpdates = ['firstName', 'LastName', 'age','skills'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
   try {
        if (!isValidOperation) {
            return res.status(400).send("Invalid updates!");
        }
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send("User not found");
        }
        await user.save();
        res.status(200).json(user);
   }
   catch (error) {
      res.status(500).send("Error updating user: " + error.message);
   }
})





export default profileRouter;
