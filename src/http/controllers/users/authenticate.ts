import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'


export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  const authenticateSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  const validateSchema = authenticateSchema.safeParse(req.body)
  if(!validateSchema.success){
    return res.status(400).send({error: 'Invalid request'})
  }

  const { email, password } = validateSchema.data

  const user = await prisma.user.findUnique({
    where: {
      email,
    }
  })
  if(!user){
    return res.status(400).send({error: 'User not found'})
  }

  const passwordMatch = await bcrypt.hash(password, user.password)
  if(!passwordMatch){
    return res.status(400).send({error: 'Invalid password'})
  }

  const { username, id, name } = user

  const token = await res.jwtSign({
    id: user.id,
    email: user.email,
  })

  const refreshToken = await res.jwtSign({
    id: user.id,
    email: user.email,
  }, {
    expiresIn: '30min'
  })

  res.setCookie('access_token', refreshToken, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: true,
  }).status(200).send(
    {
      token,
      refreshToken,
      user: {
        id,
        email,
        username,
        name,
      }
    }
  )
  

}