import { v5 as uuidv5 } from 'uuid'
// the namespace below should be unique to your application/business/fav cheese...
const MY_NAMESPACE = uuidv5('my-app-name', uuidv5.DNS)

export const createUIDForUser = (user, provider) => {
  const combined = `${user}:${provider}`
  return uuidv5(combined, MY_NAMESPACE)
}
