import { FastifyInstance } from 'fastify'
import { getItems, createItem, getItem, updateItem, deleteItem } from './items'

export async function authRoutes(app: FastifyInstance) {

  app.get('/items', {preValidation: app.authenticate}, getItems)
  app.post('/items', {preValidation: app.authenticate}, createItem)
  app.get('/items/:id', {preValidation: app.authenticate}, getItem)
  app.put('/items/:id', {preValidation: app.authenticate}, updateItem)
  app.delete('/items/:id', {preValidation: app.authenticate}, deleteItem)
}