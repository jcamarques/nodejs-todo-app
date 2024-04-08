import { FastifyInstance } from 'fastify'
import { getItems, createItem, getItem, updateItem, deleteItem } from './items'

export async function routes(app: FastifyInstance) {

  app.get('/items', getItems)
  app.post('/items', createItem)
  app.get('/items/:id', getItem)
  app.put('/items/:id', updateItem)
  app.delete('/items/:id', deleteItem)
}