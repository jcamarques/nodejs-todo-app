import { fastify, FastifyRequest, FastifyReply } from 'fastify';
import { authRoutes } from './http/controllers/auth-required/routes';
import { userRoutes } from './http/controllers/users/routes';
import fjwt, { FastifyJWT } from '@fastify/jwt'
import fCookie from '@fastify/cookie'
import { env } from './env';
import { verifyJWT } from '@/http/middlewares/verify-jwt';

// Registre o middleware no seu aplicativo


export const app = fastify();

app.register(userRoutes)
app.register(fjwt, { secret: env.JWT_SECRET })
app.register(authRoutes)

app.decorate('authenticate', async function(request: FastifyRequest, reply: FastifyReply) {
  try 
  {
    await request.jwtVerify()
  } catch (err) {
    if (err instanceof Error) {
      reply.status(401).send({ error: 'Unauthorized' }); // Properly handle authentication failure
    } else {
      reply.status(500).send({ error: 'Internal Server Error' }); // Handle other unknown errors
    }
  }
})