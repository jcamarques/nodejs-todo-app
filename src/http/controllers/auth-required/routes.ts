import { FastifyInstance } from 'fastify'
import { getItems, createItem, getItem, updateItem, deleteItem } from './items';
import { getLists, createList, getList, updateList, deleteList } from './lists';
import { AuthMiddleware } from '@/http/middlewares/authentication-middleware';

export async function authRoutes(app: FastifyInstance) {

  app.get('/items', {preHandler: AuthMiddleware}, getItems)
  app.post('/items', {preHandler: AuthMiddleware}, createItem)
  app.get('/items/:id', {preHandler: AuthMiddleware}, getItem)
  app.put('/items/:id', {preHandler: AuthMiddleware}, updateItem)
  app.delete('/items/:id', {preHandler: AuthMiddleware}, deleteItem)

  app.get('/lists', {preHandler: AuthMiddleware}, getLists)
  app.post('/lists', {preHandler: AuthMiddleware}, createList)
  app.get('/lists/:id', {preHandler: AuthMiddleware}, getList)
  app.put('/lists/:id', {preHandler: AuthMiddleware}, updateList)
  app.delete('/lists/:id', {preHandler: AuthMiddleware}, deleteList)
}