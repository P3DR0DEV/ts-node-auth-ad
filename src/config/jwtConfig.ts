interface Payload {
  user: string,
  authUser: boolean
}

import { sign } from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export function createToken(payload: Payload) {
  const token = sign({ payload }, process.env.SECRET as string, {
    expiresIn: '7d'
  })
  return token
}