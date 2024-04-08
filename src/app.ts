import {fastify} from 'fastify';
import { routes } from './http/controllers/routes';

export const app = fastify();

app.register(routes)