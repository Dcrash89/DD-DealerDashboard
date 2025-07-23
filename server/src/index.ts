import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import apiRoutes from './routes';
import { env } from './config/env';

const app = express();
const PORT = env.PORT;

app.use(cors({ origin: env.CORS_ORIGIN || '*', credentials: false }));
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('DJI Dealer Dashboard API is running!');
});

app.use('/api', apiRoutes);

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});