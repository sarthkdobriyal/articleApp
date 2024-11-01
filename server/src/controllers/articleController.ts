import { Request, Response } from 'express';
import { prisma } from "..";
import { z } from 'zod';
import { Article } from '@prisma/client';
import { createArticleSchema, CreateArticleRequest } from '../utils/validation';


export const getAllArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const articles = await prisma.article.findMany({
        where: {
            authorId: req.userId
        },
        include: {
            author: {
                select : {
                    name: true
                }
            }
        }

    });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching patients' });
  }
};
export const getCredits = async (req: Request, res: Response): Promise<void> => {
  try {
    const credits = await prisma.user.findMany({
        where: {
            id: req.userId
        },
        select: {
            credits: true
        }
    });
    res.json(credits);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching patients' });
  }
};



export const createArticle = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.userId;
      if (!userId) {
         res.status(401).json({
          success: false,
          message: 'Unauthorized: User not authenticated',
        });
      }
  
      
      const validationResult = createArticleSchema.safeParse(req.body);
      if (!validationResult.success) {
         res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validationResult.error.errors,
        });
      }
  
      const { title, content }: CreateArticleRequest = validationResult.data!;


      if(!title || !content) res.status(400).json({
        success: false,
        message: 'Error in details',
      });
  
      
      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { credits: true },
        });
  
        if (!user) {
          throw new Error('User not found');
        }
  
        if (user.credits < 1) {
          throw new Error('Insufficient credits');
        }
  
        await tx.user.update({
          where: { id: userId },
          data: { credits: { decrement: 1 } },
        });
  
        const article = await tx.article.create({
          data: {
            title,
            content,
            authorId: userId!,
          },
          include: {
            author: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        });
  
         article;
      });
  
       res.status(201).json({
        success: true,
        message: 'Article created successfully',
        data: result,
      });
  
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Insufficient credits') {
           res.status(403).json({
            success: false,
            message: 'You do not have enough credits to create an article',
          });
        }
        if (error.message === 'User not found') {
           res.status(404).json({
            success: false,
            message: 'User not found',
          });
        }
      }
  
      
      console.error('Error creating article:', error);
  
       res.status(500).json({
        success: false,
        message: 'An error occurred while creating the article',
      });
    }
  };


