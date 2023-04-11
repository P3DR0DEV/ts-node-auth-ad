interface Request { user: string, password: string }
import express from "express"
import { AuthenticationOptions, authenticate } from "ldap-authentication"
import { createToken } from "@/config/jwtConfig"
import dotenv from 'dotenv'
dotenv.config()
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/', async (req, res) => {
  try {
    const { user, password }: Request = req.body
    if (!user || !password) {
      return res.status(400).json({
        error: 'You need to provide User and Password on the body Request!'
      })
    }

    const options: AuthenticationOptions = {
      ldapOpts: {
        url: process.env.LDAP_URL,
      },
      userDn: `${user}@${process.env.DOMAIN}`,
      userPassword: password,
      userSearchBase: process.env.DOMAIN_CONTROLLER,
    }

    const authUser: boolean = await authenticate(options)
    if (!authUser) {
      return res.json({
        message: "Connection Error"
      })
    }
    const token = createToken({ user, authUser })
    return res.json({ token })
  } catch (e) {
    console.log(e)
  }
})

app.listen(process.env.PORT, () => {
  console.log(`Running on ${process.env.PORT}...`)
})