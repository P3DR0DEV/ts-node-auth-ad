interface Request { user: string, password: string }
import express from "express"
import { AuthenticationOptions, authenticate } from "ldap-authentication"
import { createToken } from "./config/jwtConfig"
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
        url: 'ldap://192.168.18.5:389',
      },
      userDn: `${user}@claretiano.rede`,
      userPassword: password,
      userSearchBase: 'dc=claretiano.rede,dc=bho-dc-01',
      groupsSearchBase: 'dc=claretiano.rede,dc=bho-dc-01'

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

app.listen(3000, () => {
  console.log(`Running on 3000...`)
})