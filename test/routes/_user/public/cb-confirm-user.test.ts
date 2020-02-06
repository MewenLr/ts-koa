import http from 'http'
import REQUEST from 'supertest'
import JWTOKEN from 'jsonwebtoken'
import {
  User,
  IUser,
  config,
  saveUser,
  initiateServer,
} from '../../../index'

let user: IUser
let server: null|http.Server = null

/**
  * @remarks - [GET] '/user/confirmation/:token'
  *
  * 1. Error on invalid signature - redirection to registration page
  * 2. Error on token malformed - redirection to registration page
  * 3. Error on invalid token - redirection to registration page
  * 4. Error on token expired - redirection to registration page
  * 5. Success on user confirmed - redirection to login page
*/

describe('Public Routes _user', () => {

  beforeAll(async () => {
    server = await initiateServer()
    user = await saveUser({
      email: 'test.mail@gmail.com',
      username: 'testuser',
      password: 'Pass1234',
      confirmPassword: 'Pass1234',
    })
  })

  afterAll(async () => {
    await server.close()
  })

  describe('[GET] /user/confirmation/:token', () => {

    /**
     * 1. Error on invalid signature
    */
    test('should redirect to registration page with param \'token_invalid\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, 'wrong-signature', { expiresIn: 86400 })
      const res = await REQUEST(server)
        .get(`/user/confirmation/${token}`)
        .set('Accept-Language', 'en')
      expect(res.header.location).toEqual(`${config.website}register?notif=token_invalid`)
    })

    /**
     * 2. Error on token malformed
    */
    test('should redirect to registration page with param \'token_invalid\'', async () => {
      const token = JWTOKEN.sign({ id: 'wrong-id' }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .get(`/user/confirmation/${token}`)
        .set('Accept-Language', 'en')
      expect(res.header.location).toEqual(`${config.website}register?notif=token_invalid`)
    })

    /**
     * 3. Error on invalid token
    */
    test('should redirect to registration page with param \'token_invalid\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .get(`/user/confirmation/${token}zfsjdl`)
        .set('Accept-Language', 'en')
      expect(res.header.location).toEqual(`${config.website}register?notif=token_invalid`)
    })

    /**
     * 4. Error on token expired
    */
    test('should redirect to registration page with param \'token_expired\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: -1 })
      const res = await REQUEST(server)
        .get(`/user/confirmation/${token}`)
        .set('Accept-Language', 'en')
      expect(res.header.location).toEqual(`${config.website}register?notif=token_expired`)
    })

    /**
     * 5. Success on user confirmed
    */
    test('should redirect to login page with param \'user_confirmed\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .get(`/user/confirmation/${token}`)
        .set('Accept-Language', 'en')
      const userConfirmed = await User.findOne({ username: 'testuser' })
      expect(userConfirmed.confirmed).toEqual(true)
      expect(res.header.location).toEqual(`${config.website}login?notif=user_confirmed`)
    })

  })
})
