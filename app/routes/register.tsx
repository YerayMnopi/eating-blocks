import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { FormEvent, FormEventHandler, useCallback, useEffect, useState } from 'react'
import usersRepository, { CreateUser, User } from '../repositories/users-repository'
import classes from './register.module.css'
import { createServerFn } from '@tanstack/start'
import { logger } from '../logger'
import { ObjectId } from 'mongodb'
import { set, z } from 'zod'
import { mailer } from '../mailer'
import { useAppSession } from '../session'
import bcrypt from 'bcrypt';

const userSchema = z.object<CreateUser>({
    email: z.string().email(),
    password: z.string().min(8),
});

const createUser = createServerFn('POST', async(body: CreateUser): Promise<{error: boolean, message: string, user?: User}> => {
    
    const existingUser = await usersRepository.findOne({email: body.email})
  
    // Check if the user exists
    if (existingUser) {
        if (await bcrypt.compare(body.password, existingUser.password)){
            logger.info(`User ${body.email} already exists`)
            // Create a session
            const session = await useAppSession()
        
            // Store the user's email in the session
            await session.update({
                user: existingUser,
            })
            return {
                error: false,
                message: 'User already exists',
                user: existingUser
            }
        } else {
            return {
              error: true,
              message: 'User already exists',
            }
        }
    }
    logger.info(`Creating user ${body.email}`)
    const user: User = {
        _id: new ObjectId(),
        created_at: new Date().toJSON(),
        email: body.email,
        password: await bcrypt.hash(body.password, 3),
    }
    await usersRepository.insertOne(user)
    logger.info(`User ${user.email} created with id ${user._id}`)
    await mailer.sendMail({
        from: "yeray@eating-blocks.com",
        to: user.email,
        subject: "Welcome to Eating Blocks",
        text: "You have successfully registered to Eating Blocks"
    })
    // Create a session
    const session = await useAppSession()

    // Store the user's email in the session
    await session.update({
        user,
    })
    return {
        error: false,
        message: 'User created',
        user
    }
})

export const Route = createFileRoute('/register')({
    beforeLoad: ({ context }) => {
        if (context.user) {
          throw redirect({to: '/planner'})
        }
      },
  component: RegisterPage,
})


function RegisterPage () {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [formState, setFormState] = useState('')
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate()

    const handleOnClick = useCallback(async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!isFormValid) {
          setFormState('Invalid email or password');
          return;
        }
        
        const response = await createUser({email, password})

        if (response.error) {
            setFormState(response.message)
        } else {
            await navigate({to: '/planner'})
        }
    }, [email, password, isFormValid])

    const handleOnEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handleOnPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    useEffect(() => {
        const result = userSchema.safeParse({email, password});
        
        if (!result.success) {
            setIsFormValid(false)
          return;
        }

        setFormState('')
        setIsFormValid(true)
    }, [email, password])


    return (
        <section className={classes.section}>
            <h1>Register</h1>
            <form onSubmit={handleOnClick}>
                <input type="email" placeholder="Email" onChange={handleOnEmailChange}/>
                <input type="password" placeholder="password" onChange={handleOnPasswordChange} />
                <button type='submit' disabled={!isFormValid}>Build my meal plan</button>
            </form>
            <p>{formState}</p>
        </section>
    )
}