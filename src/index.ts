import dotenv from 'dotenv';
import express, { Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'; // Import cookie-parser
import router from './routes';
import errorHandler from './middlewares/error-handler';
import connectDb from './configs/db.config';
import mongoose from 'mongoose';
import { GridFsStorage } from 'multer-gridfs-storage';
import Grid from 'gridfs-stream';
import multer from 'multer';

dotenv.config();

connectDb();

const app: Express = express();
const port = process.env.PORT || 8000;

// body parser
app.use(express.json());

const allowedOrigins = [
  'https://faceverses.xyz',
  'http://localhost:3000',
  'https://faceverse.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  })
);

app.use(cookieParser()); // Use cookie-parser middleware

app.use('/api/v1', router);

// GridFS Configuration
// let gfs: any;

// mongoose.connection.once('open', () => {
//   // Initialize GridFS stream
//   gfs = Grid(mongoose.connection.db, mongoose.mongo);
//   gfs.collection('uploads');
// });

// const storage = new GridFsStorage({
//   url: process.env.MONGO_URI!, // Replace with your MongoDB connection string
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       const filename = file.originalname;
//       const fileInfo = {
//         filename: filename,
//         bucketName: 'uploads',
//       };
//       resolve(fileInfo);
//     });
//   },
// });

// const upload = multer({ storage });

// Upload endpoint
// app.post('/upload', upload.single('file'), (req, res) => {
//   res.json({ file: req.file });
// });

// Get image endpoint
// app.get('/image/:filename', (req, res) => {
//   gfs.files.findOne(
//     { filename: req.params.filename },
//     (err: any, file: any) => {
//       if (!file || file.length === 0) {
//         return res.status(404).json({ err: 'No file exists' });
//       }

//       if (
//         file.contentType === 'image/jpeg' ||
//         file.contentType === 'image/png'
//       ) {
//         const readstream = gfs.createReadStream(file.filename);
//         readstream.pipe(res);
//       } else {
//         res.status(404).json({ err: 'Not an image' });
//       }
//     }
//   );
// });

//error handler
app.use(errorHandler);

mongoose.connection.once('open', () => {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
});
