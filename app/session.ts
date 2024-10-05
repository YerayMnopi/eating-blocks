import { useSession } from 'vinxi/http'
import { User } from './repositories/users-repository'

type SessionUser = {
  user: User
}

export function useAppSession() {
  return useSession<SessionUser>({
    password: 'ChangeThisBeforeShippingToProdOrYouWillBeFired',
  })
}
