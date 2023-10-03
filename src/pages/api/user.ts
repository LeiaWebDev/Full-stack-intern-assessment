import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

// POST /api/user
// Required fields in body: name, email
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const userId = req.query.id

  try {
    const {name, email} = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required fields' });
    }
    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
      },
    });

    return res.status(201).json(newUser);

  } catch (error) {
    console.error('Error creating a user: ',error)
    return res.status(500).json({error: 'server error'});
  }


  // const result = await prisma.user.create({
  //   data: {
  //     ...req.body,
  //   },
  // })
  // return res.status(201).json(result)
}
