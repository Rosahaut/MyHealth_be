import express from 'express';
/*
import path from 'path';
import { fileURLToPath } from 'url';
*/
import cors from 'cors';

import userRouter from './routes/user-router.js';
import entryRouter from './routes/entry-router.js';
import authRouter from './routes/auth-router.js';
import measurementRouter from './routes/measurements-router.js';
import medicationRouter from './routes/medication-router.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';

// Define the host
const hostname = '127.0.0.1';
const port = 3000;
const app = express();

// Enable CORS
app.use(cors());

// Serve static files from the 'public' directory
app.use('/', express.static('public'));

// Parse JSON requests
app.use(express.json());

// rest-apin dokumentaatio tarjoillaan /api-juuripolun alla
app.use('/api', express.static('docs'));

// Serve static files from a sub-route (optional)
/*
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/sivusto', express.static(path.join(__dirname, '../public')));
*/

// API routes
app.use('/api/users', userRouter);
app.use('/api/entries', entryRouter);
app.use('/api/auth', authRouter);
app.use('/api/measurements', measurementRouter);
app.use('/api/medications', medicationRouter);

// 404 not found middleware
app.use(notFoundHandler);

// Error handler for the rest of error cases
app.use(errorHandler);

// Start the server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
