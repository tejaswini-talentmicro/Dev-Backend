import express, { request } from 'express';
import User from '../models/user.js';
import authMiddleware from '../middleware/auth.js';
import ConnectionReqModel from '../models/connectRequest.js';


const requestRouter = express.Router();

requestRouter.post('/request/send/:status/:toUserId',authMiddleware, async (req, res) => {
   try {
     const fromUserId = req.user._id;
     const toUserId = req.params.toUserId;
     const status = req.params.status

     const allowedStatuses = ['ignored','interested']

     if(!allowedStatuses.includes(status)){
        return res.status(400).json({message: 'Invalid Status'})
     }

     const toUser = await User.findById(toUserId);
     if(!toUser){
         return res.status(400).json({message: 'User not found!'})
     }

     const doesConnectionReqExist = await ConnectionReqModel.findOne({
        $or:[
            {fromUserId,toUserId},
            {fromUserId: toUserId, toUserId: fromUserId}
        ]
     })

     if(doesConnectionReqExist){
        return res.status(400).json({message: 'Connection already exists!!'})
     }

     const data = new ConnectionReqModel({
        fromUserId,
        toUserId,
        status
     })

     await data.save()
     res.status(200).json({message: `Connection ${status} successfully`})

   }
   catch (error) {
      res.status(500).send("Error: " + error.message);
   }
})


requestRouter.post('/review/send/:status/:requestId',authMiddleware, async (req, res) => {
   try {
     const loggedInUser = req.user
     const {status,requestId} = req.params
     console.log(loggedInUser._id)
     console.log(requestId)

     const allowedStatuses = ['accepted','rejected']

     if(!allowedStatuses.includes(status)){
        return res.status(400).json({message: 'Invalid Status'})
     }

     const validRequestObj = await ConnectionReqModel.findOne({
       toUserId: loggedInUser._id,
       _id: requestId,
       status:"interested"
     })

     if(!validRequestObj){
        return res.status(400).json({message: 'Invalid Request!!'})
     }

     validRequestObj.status = status

     await validRequestObj.save()
     res.status(200).json({message: `Connection ${status} successfully`})

   }
   catch (error) {
      res.status(500).send("Error: " + error.message);
   }
})


export default requestRouter