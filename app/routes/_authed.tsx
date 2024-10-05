import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/start'
import usersRepository from '../repositories/users-repository'
import bcrypt from 'bcrypt';
import { useAppSession } from '../session';

export const loginFn = createServerFn(
    'POST',
    async (
      payload: {
        email: string
        password: string
      }
    ) => {
      // Find the user
      const user = await usersRepository.findOne({email: payload.email})
  
      // Check if the user exists
      if (!user) {
        return {
          error: true,
          userNotFound: true,
          message: 'User not found',
        }
      }
  
      // Check if the password is correct
      const passwordsMatch = await bcrypt.compare(payload.password, user.password)
  
      if (!passwordsMatch) {
        return {
          error: true,
          message: 'Incorrect password',
        }
      }
  
      // Create a session
      const session = await useAppSession()
  
      // Store the user's email in the session
      await session.update({
        user,
      })
    }
  )


export const Route = createFileRoute('/_authed')({
    beforeLoad: ({ context }) => {
        if (!context.user) {
          throw redirect({to: '/register'})
        }
      },
})
