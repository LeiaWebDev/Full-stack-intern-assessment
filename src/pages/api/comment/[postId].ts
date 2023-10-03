import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const postId = req.query.postId
// const postId = req.query.id

  switch (req.method) {
    case 'GET':
      return handleGET(postId, res)

    case 'POST':
      return handlePOST(postId, req.body, res)

    case 'DELETE':
      return handleDELETE(postId, req.body.commentId, res)

    default:
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`,
      )
  }
}


// GET /api/comments/:postId
// fetch all comments for a specific post
async function handleGET(postId: string | string[] | undefined, res: NextApiResponse) {
    const comments = await prisma.comment.findMany({
      where: { postId: Number(postId) },
      
    })
    return res.status(200).json(comments)
  }

// POST /api/comment/:postId
async function handlePOST(postId: string | string[] | undefined,
    req: NextApiRequest,
    res: NextApiResponse,
  ) {
    const { commentContent, userId } = req.body
    const newComment = await prisma.comment.create({
      data: {
        commentContent: commentContent,
        userId: userId,
        postId: Number(postId),
      },
    })
    return res.status(201).json(newComment)
  }

// DELETE /api/comment/:postId
async function handleDELETE(postId: string | string[] | undefined, commentId: number,res: NextApiResponse) {
    const comment = await prisma.comment.delete({
        where: { id: commentId, postId: Number(postId) },
      })
      return res.json(comment)
    }