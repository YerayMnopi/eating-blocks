import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import usersRepository, { CreateUser, User } from '../../repositories/users-repository'
import { ObjectId } from 'mongodb'
import { setResponseStatus } from 'vinxi/http'
import { logger } from '../../logger'

export const Route = createAPIFileRoute('/api/users')({
  GET: ({ request, params }) => {
    return json({ message: 'Hello /api/users' })
  },
  POST: async ({ request }) => {
    const body: CreateUser = await request.json()
    logger.info(`Creating user ${body.email}`)
    const user: User = {
        _id: new ObjectId(),
        ...body
    }
    await usersRepository.insertOne(user)
    logger.info(`User ${user.email} created with id ${user.id}`)
    setResponseStatus(201)
    return json(user)
  },
})
