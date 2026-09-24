import express from 'express';
import connectDb from './config/database.js';
import dns from 'dns';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth.js';
import profileRouter from './routes/profile.js';
import requestRouter from './routes/request.js';
import userRouter from './routes/user.js';

dns.setServers(['1.1.1.1', '8.8.8.8']);
const app = express();



connectDb()
   .then(() => {
      console.log('MongoDB connected successfully');
      app.listen(3000, () => {
         console.log('Server is running on port 4200');
      });
   })
   .catch((error) => {
      console.error('Error starting the server:', error.message);
   });

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use('/', authRouter);
app.use('/', profileRouter)
app.use('/',requestRouter)
app.use('/',userRouter)




