import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {
  public async register({ request, auth, response }: HttpContextContract) {
    const validationSchema = schema.create({
      username: schema.string({ trim: true }),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.maxLength(255),
        rules.unique({ table: 'users', column: 'email' }),
      ]),
      password: schema.string({ trim: true })
    })
    const validateData = await request.validate({
      schema: validationSchema,
    })
    const user = await User.create(validateData)
    await auth.login(user)
    return "Create user successfully!"
  }

  public async login({ request, response, auth, session }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    try {
        await auth.attempt(email, password)
    } catch (error) {
        session.flash('form', 'Your username, email, or password is incorrect')
        return "Login failed!"
    }

    return "Login successfully!"
  }

  public async logout({ response, auth }: HttpContextContract) {
    await auth.logout()
    return "Logout success!"
  }

}