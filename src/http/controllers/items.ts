import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'



export async function getItems(req: FastifyRequest, res: FastifyReply) {
  const items = await prisma.item.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })
  res.send(items)
}

export async function createItem(req: FastifyRequest, res: FastifyReply) {
  const itemSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
  })
  const item = itemSchema.parse(req.body)
  const newItem = await prisma.item.create({
    data: item,
  })
  res.send(newItem)
}

export async function getItem(req: FastifyRequest, res: FastifyReply) {
  const itemSchema = z.object({
    id: z.string(),
  })
  const validateSchema = itemSchema.safeParse(req.params)

  if (!validateSchema.success) {
    return res.status(400).send({ error: 'Invalid request' })
    
  }
  const { id } = validateSchema.data

  const item = await prisma.item.findUnique({
    where: {
      id,
    },
  })

  if (!item) {
    return res.status(404).send({ error: 'Item not found ❌' })
  }

  res.send(item)
}
export async function updateItem(req: FastifyRequest, res: FastifyReply) {
  const updateItemSchema = z.object({
    id: z.string(),
  })
  const itemSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    checked: z.boolean().optional(),
  })

  const validatedUpdateItemSchema = updateItemSchema.safeParse(req.params)
  const validatedItemSchema = itemSchema.safeParse(req.body)

  if(!validatedUpdateItemSchema.success || !validatedItemSchema.success){
    return res.status(400).send({ error: 'Invalid request' })
  }

  
  const { id } = validatedUpdateItemSchema.data
  const {name, description, checked} = validatedItemSchema.data
  
  const currentItem = await prisma.item.findUnique({ where: { id, deletedAt: null } });

  if (!currentItem) {
    return res.status(404).send({ error: 'Item not found ❌' })
  }

  let checkedAt = currentItem.checkedAt; // mantém o valor atual de checkedAt

  if (checked !== undefined) {
    checkedAt = checked ? new Date() : null;
  }


  const updatedItem = await prisma.item.update({
    where: {
      id,
      deletedAt: null,
    },
    data: {
      name,
      description,
      checked,
      checkedAt,
    }
  })

  res.send(updatedItem)
}

export async function deleteItem(req: FastifyRequest, res: FastifyReply) {
  const itemSchema = z.object({
    id: z.string(),
  })
  const validateSchema = itemSchema.safeParse(req.params)

  if (!validateSchema.success) {
    return res.status(400).send({ error: 'Invalid request' })
  }

  const { id } = validateSchema.data

  const deletedItem = await prisma.item.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  })

  res.send(deletedItem)
}