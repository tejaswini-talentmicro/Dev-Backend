import mongoose from 'mongoose';

const connectRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    status: {
        type: String,
        enum: {
            values: ['interested', 'ignored', 'rejected', 'accepted'],
            message: `{VALUE} is incorrect status type`
        },
        required: true
    }
},
    {
        timeStamps: true
    }
)

connectRequestSchema.index({ fromUserId: 1, toUserId: 1 })


//This will be called before await data.save()
connectRequestSchema.pre("save", function () {
    const connectionRequest = this;

    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send request to yourself!");
    }
});

const ConnectionReqModel = mongoose.model("connectRequest", connectRequestSchema)

export default ConnectionReqModel