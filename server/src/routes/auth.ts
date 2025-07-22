import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    });
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;

    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
});

// GET /api/auth/me - Get current logged in user
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  if (!authReq.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  const user = await prisma.user.findUnique({
    where: { id: authReq.user.id },
    select: {
      id: true,
      email: true,
      role: true,
      dealerId: true
    }
  });

  res.json(user);
});


export default router;