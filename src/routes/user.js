import express from 'express'
import User from '../models/user.js';
import authMiddleware from '../middleware/auth.js';
import ConnectionReqModel from '../models/connectRequest.js';


const userRouter = express.Router();
const USER_SAFE_DATA = ['firstName', 'LastName', 'keySkills']


//get who all are interested in your profile
userRouter.get('/user/requests/received', authMiddleware, async (req, res) => {
    try {

        const loggedInUser = req.user

        const findRequests = await ConnectionReqModel.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId", "firstName lastName")

        res.json({
            message: "Data fetched successfully",
            data: findRequests
        })


    }
    catch (error) {
        res.status(500).send("Error: " + error.message);
    }
})


userRouter.get('/user/connections', authMiddleware, async (req, res) => {
    try {

        const loggedInUser = req.user

        const connectionRequests = await ConnectionReqModel.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" },
            ]
        }).populate("fromUserId", USER_SAFE_DATA)
            .populate("toUserId", USER_SAFE_DATA)

        const data = connectionRequests.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            return row.fromUserId
        })

        res.json({
            message: "Data fetched successfully",
            data: data
        })


    }
    catch (error) {
        res.status(500).send("Error: " + error.message);
    }
})


userRouter.get('/user/feed', authMiddleware, async (req, res) => {
    try {

        const loggedInUser = req.user;
        const page = req.query.page;
        const limit = (req.query.limit > 100) ? 10 : req.query.limit
        const skip = (page-1) * 10
        

        const connectRequests = await ConnectionReqModel.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        })

        const hideUserFromFeed = new Set();

        connectRequests.forEach((req) => {
            hideUserFromFeed.add(req.fromUserId),
                hideUserFromFeed.add(req.toUserId)
        })

        const users = await User.find({
            $and:[
                {_id : { $nin: Array.from(hideUserFromFeed) }},
                {_id : {$ne: loggedInUser._id}}
            ]
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit)

        res.json({data: users})


    }
    catch (error) {
        res.status(500).send("Error: " + error.message);
    }
})

export default userRouter