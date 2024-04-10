import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

export async function register(req: FastifyRequest, res: FastifyReply) {
  const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
    username: z.string().min(3),
    name: z.string().min(3),
  })
  const validateSchema = registerSchema.safeParse(req.body)
  if(!validateSchema.success){
    return res.status(400).send({error: 'Invalid request'})
  }

  const { email, password, confirmPassword, username, name } = validateSchema.data

  if(password !== confirmPassword){
    return res.status(400).send({error: 'Password does not match'})
  }

  const userExist = await prisma.user.findFirst({
    where: {
      email,
    }
  })
  if(userExist){
    return res.status(400).send({error: 'Email already exist'})
  }
  
  const usernameExist = await prisma.user.findFirst({
    where: {
      username,
    }
  })
  if(usernameExist){
    return res.status(400).send({error: 'Username already exist'})
  }

  const password_hash = await bcrypt.hash(password, 6)

  const user = await prisma.user.create({
    data: {
      email,
      password: password_hash,
      username,
      name,
    }
  })

  
  res.send(user)
}