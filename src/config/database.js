import mongoose from 'mongoose';

const connectDb = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://Tej:Teju1234@nodecluster.oin9p45.mongodb.net/?appName=NodeCluster'
    );
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }
};




export default connectDb;


