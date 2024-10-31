// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { loginSchema, signupSchema, LoginInput, SignupInput } from '../utils/validation';
import { ZodError } from 'zod';
import { prisma } from '..';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedInput = signupSchema.parse(req.body);
    const { name, email, password } = validatedInput;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Create and send JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedInput = loginSchema.parse(req.body);
    const { email, password } = validatedInput;

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Create and send JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};