import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import crypto from 'crypto';

const router = Router();
const prisma = new PrismaClient();

// Helper to generate a random password
const generateRandomPassword = (length = 12) => {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
};

// POST /api/users - Create a new user (Admin only)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  if (authReq.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const { email, password, role, dealerId } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: 'Email, password, and role are required' });
  }
  if (role === 'DEALER' && !dealerId) {
    return res.status(400).json({ message: 'Dealer ID is required for dealer role' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        dealerId: role === 'DEALER' ? dealerId : null,
      },
      select: { id: true, email: true, role: true, dealerId: true },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error });
  }
});

// PUT /api/users/:id - Update a user (Admin only)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    if (authReq.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    const { id } = req.params;
    const { email, role, dealerId } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                email,
                role,
                dealerId: role === 'DEALER' ? dealerId : null,
            },
            select: { id: true, email: true, role: true, dealerId: true },
        });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user', error });
    }
});

// DELETE /api/users/:id - Delete a user (Admin only)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    if (authReq.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    const { id } = req.params;
    
    if (authReq.user?.id === id) {
        return res.status(400).json({ message: "You cannot delete your own account." });
    }

    try {
        await prisma.user.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error });
    }
});


// POST /api/users/change-password - User changes their own password
router.post('/change-password', authMiddleware, async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const authReq = req as AuthRequest;
  const userId = authReq.user?.id;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new passwords are required' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters long' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change password', error });
  }
});

// POST /api/users/:id/reset-password - Admin resets a user's password
router.post('/:id/reset-password', authMiddleware, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  if (authReq.user?.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  const { id } = req.params;
  const newPassword = generateRandomPassword();

  try {
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id },
      data: { password: hashedNewPassword },
    });
    
    // Return the plain text password for the admin to securely give to the user
    res.json({ message: 'Password reset successfully', newPassword });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reset password', error });
  }
});

export default router;