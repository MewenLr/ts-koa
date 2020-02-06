import http from 'http'
import REQUEST from 'supertest'
import JWTOKEN from 'jsonwebtoken'
import {
  User,
  IUser,
  config,
  saveUser,
  mockUser,
  initiateServer,
} from '../../../index'

let user: IUser
let server: null|http.Server = null

/**
  * @remarks - [GET] '/user/change-email/:token'
  *
  * 1. Error on invalid signature - redirection to homepage
  * 2. Error on token malformed - redirection to homepage
  * 3. Error on token invalid - redirection to homepage
  * 4. Error on token expired - redirection to homepage
  * 5. Error on emails exists - redirection to homepage
  * 6. Success on user confirmed - redirection to login page
*/

describe('Private Routes _user', () => {

  beforeAll(async () => {
    server = await initiateServer()
    user = await saveUser(mockUser())
    await saveUser(mockUser('2'))
  })

  afterAll(async () => {
    await server.close()
  })

  describe('[GET] /user/change-email/:token', () => {

    /**
     * 1. Error on invalid signature
    */
    test('should redirect to homepage page with param \'token_invalid\'', async () => {
      const token = JWTOKEN.sign({ id: user._id, email: 'new.mail@gmail.com' }, 'wrong-signature', { expiresIn: 86400 })
      const res = await REQUEST(server)
        .get(`/user/change-email/${token}`)
        .set('Accept-Language', 'en')
      expect(res.header.location).toEqual(`${config.website}?notif=token_invalid`)
    })

    /**
     * 2. Error on token malformed
    */
    test('should redirect to homepage page with param \'token_invalid\'', async () => {
      const token = JWTOKEN.sign({ id: 'wrong-id', email: 'wrong-mail' }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .get(`/user/change-email/${token}`)
        .set('Accept-Language', 'en')
      expect(res.header.location).toEqual(`${config.website}?notif=token_invalid`)
    })

    /**
     * 3. Error on invalid token
    */
    test('should redirect to homepage page with param \'token_invalid\'', async () => {
      const token = JWTOKEN.sign({ id: user._id, email: 'new.mail@gmail.com' }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .get(`/user/change-email/${token}zfsjdl`)
        .set('Accept-Language', 'en')
      expect(res.header.location).toEqual(`${config.website}?notif=token_invalid`)
    })

    /**
     * 4. Error on token expired
    */
    test('should redirect to homepage page with param \'token_expired\'', async () => {
      const token = JWTOKEN.sign({ id: user._id, email: 'new.mail@gmail.com' }, config.jwtSecret, { expiresIn: -1 })
      const res = await REQUEST(server)
        .get(`/user/change-email/${token}`)
        .set('Accept-Language', 'en')
      expect(res.header.location).toEqual(`${config.website}?notif=token_expired`)
    })

    /**
     * 5. Error on email exists
    */
    test('should redirect to homepage page with param \'email_exists\'', async () => {
      const token = JWTOKEN.sign({
        id: user._id,
        email: 'user2.mail@gmail.com',
      }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .get(`/user/change-email/${token}`)
        .set('Accept-Language', 'en')
      expect(res.header.location).toEqual(`${config.website}?notif=email_exists`)
    })

    /**
     * 6. Error on token expired
    */
    test('should update email & redirect to login page with param \'email_updated\'', async () => {
      const token = JWTOKEN.sign({ id: user._id, email: 'new.mail@gmail.com' }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .get(`/user/change-email/${token}`)
        .set('Accept-Language', 'en')
      const userUpdated = await User.findOne({ username: 'user' })
      expect(userUpdated.email).toEqual('new.mail@gmail.com')
      expect(res.header.location).toEqual(`${config.website}login?notif=email_updated`)
    })

  })
})
