import { FastifyReply, FastifyRequest } from 'fastify'
import { AuthManager } from '@/utils/auth';
import jwt from 'jsonwebtoken';
import { env } from '@/env'
import { prisma } from '@/lib/prisma';

export async function AuthMiddleware(req: FastifyRequest, res: FastifyReply) {
  try 
  {
    const authorization = req.headers.authorization;

    if(!authorization){
      console.log('There is no token in the request header')
      return res.status(403).send({error: 'There is no token in the request header'})
    }

    const [tokenType, token] = authorization.split(/[ \t]+/)

    if (tokenType.toLowerCase() !== 'bearer') {
      console.log('Type of token is invalid')
      return res.status(403).send({error: 'Type of token is invalid'})
    }
    const { id: user_id } = jwt.verify(
      token, 
      env.JWT_SECRET
    ) as jwt.JwtPayload

    if(!user_id){
      return res.status(403).send({error: ''})
    }

    const user  = await prisma.user.findUnique({
      where: {
        id: user_id
      }
    })
    
    if(!user){
      return res.status(403).send({error: 'Forbidden'})
    }

    req.authManager =  new AuthManager().setAuthenticaded({id: user.id})



  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).send({ error: 'Forbidden' });
    }
    return res.status(500).send({ error: 'Internal Server Error' });
  }
}