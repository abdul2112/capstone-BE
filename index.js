import express from 'express';
import path from 'path';
import cors from 'cors';
// const bodyParser = require("body-parser");
import bodyParser from 'body-parser';
// const cookieParser = require("cookie-parser");
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import userRouter from './routes/users.js';
import commentsRouter from './routes/comment.js';
import likesRouter from './routes/like.js';
import favoritesRouter from './routes/favorite.js';
import listEndpoints from 'express-list-endpoints';

// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static('client/build'));

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
//   });
// }

const app = express();

const port = process.env.PORT || 5000;

// ******** MIDDLEWARES ************

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// ******** Serving static images ************

app.use('/uploads', express.static('uploads'));

// ******** ROUTES ************

app.use('/api/users', userRouter);
app.use('/api/comment', commentsRouter);
app.use('/api/like', likesRouter);
app.use('/api/favorite', favoritesRouter);

console.table(listEndpoints(app));

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB 🌵');
    app.listen(port, () => {
      console.log('Server listening on port', port, '✅');
    });
  })
  .catch((err) => console.log(err));
