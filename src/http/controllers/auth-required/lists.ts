import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { AuthManager } from "@/utils/auth";

export async function getLists(req: FastifyRequest, res: FastifyReply) {
  const idSchema = z.object({
    id: z.string()
  })
  

  const validateSchema = idSchema.safeParse(req.authManager?.getAuthenticated())

  
  if(!validateSchema.success){
    return res.status(400).send({error: 'Invalid request'})
  }
  

  const { id } = validateSchema.data



  const lists = await prisma.list.findMany({
    where: {
      user_id: id,
    }
  })

  res.status(200).send({ lists })
}

export async function createList(req: FastifyRequest, res: FastifyReply) {
  const createItemSchema = z.object({
    name: z.string(),
  })
  const idSchema = z.object({
    id: z.string()
  })

  const validateItemSchema = createItemSchema.safeParse(req.body)

  if(!validateItemSchema.success){
    return res.status(400).send({error: 'Invalid request'})
  }

  const { name } = validateItemSchema.data

  const validateIdSchema = idSchema.safeParse(req.authManager?.getAuthenticated())

  
  if(!validateIdSchema.success){
    return res.status(400).send({error: 'Invalid request'})
  }
  
  const { id } = validateIdSchema.data

  const list = await prisma.list.create({
    data: {
      name,
      user_id: id
    }
  })

  res.status(201).send({ list })
}

export async function getList(req: FastifyRequest, res: FastifyReply) {
  const idSchema = z.object({
    id: z.string()
  })

  const validateSchema = idSchema.safeParse(req.authManager?.getAuthenticated())

  
  if(!validateSchema.success){
    return res.status(400).send({error: 'Invalid request'})
  }
  

  const { id } = validateSchema.data

  const list = await prisma.list.findUnique({
    where: {
      id: id
    }
  })

  if(!list){
    return res.status(404).send({error: 'List not found'})
  }

  res.status(200).send({ list })
}

export async function updateList(req: FastifyRequest, res: FastifyReply) {
  const updateItemSchema = z.object({
    name: z.string(),
  })
  const idSchema = z.object({
    id: z.string()
  })

  const validateItemSchema = updateItemSchema.safeParse(req.body)

  if(!validateItemSchema.success){
    return res.status(400).send({error: 'Invalid request'})
  }

  const { name } = validateItemSchema.data

  const validateIdSchema = idSchema.safeParse(req.authManager?.getAuthenticated())

  
  if(!validateIdSchema.success){
    return res.status(400).send({error: 'Invalid request'})
  }
  
  const { id } = validateIdSchema.data

  const list = await prisma.list.update({
    where: {
      id
    },
    data: {
      name
    }
  })

  res.status(200).send({ list })
}

export async function deleteList(req: FastifyRequest, res: FastifyReply) {
  const idSchema = z.object({
    id: z.string()
  })

  const validateSchema = idSchema.safeParse(req.authManager?.getAuthenticated())

  
  if(!validateSchema.success){
    return res.status(400).send({error: 'Invalid request'})
  }
  

  const { id } = validateSchema.data

  await prisma.list.delete({
    where: {
      id
    }
  })

  res.status(204).send()
}