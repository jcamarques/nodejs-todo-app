import { fastify, FastifyRequest, FastifyReply } from 'fastify';
import { authRoutes } from './http/controllers/auth-required/routes';
import { userRoutes } from './http/controllers/users/routes';
import fjwt, { FastifyJWT } from '@fastify/jwt'
import { env } from './env';

// Registre o middleware no seu aplicativo


export const app = fastify();

app.register(userRoutes)
app.register(fjwt, { secret: env.JWT_SECRET })
app.register(authRoutes)
