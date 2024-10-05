import { createRootRoute } from '@tanstack/react-router'
import { Outlet, ScrollRestoration } from '@tanstack/react-router'
import { Body, createServerFn, Head, Html, Meta, Scripts } from '@tanstack/start'
import * as React from 'react'
import appCss from '../styles.css?url'
import indexCss from './index.css?url'
import { useAppSession } from '../session'

const fetchUser = createServerFn('GET', async () => {
  // We need to auth on the server so we have access to secure cookies
  const session = await useAppSession()
  const user = session.data.user
  
  if (!user) {
    return null
  }

  return {
    user
  }
})

export const Route = createRootRoute({
  meta: () => [
    {
      charSet: 'utf-8',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      title: 'Eating blocks',
    },
  ],
  links: () => [
    { rel: 'stylesheet', href: appCss },
    { rel: 'stylesheet', href: indexCss },
    {
      rel: 'icon',
      href: '/logo.png',
    },  ],
    beforeLoad: async () => {
      const user = await fetchUser()
  
      return {
        user,
      }
    },
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
      <div>
          <span className="nav__home" >Eating bl</span>
          <img src="logo.png" width="16" height="16" />
          <span className="nav__home" >cks</span>
        </div>
        <p className="subheading">
          Let&apos;s build your body!
        </p>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <Html>
      <Head>
        <Meta />
      </Head>
      <Body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </Body>
    </Html>
  )
}