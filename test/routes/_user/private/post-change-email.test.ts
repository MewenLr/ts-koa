import http from 'http'
import REQUEST from 'supertest'
import JWTOKEN from 'jsonwebtoken'
import testToken from '../../../token'
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
  * @remarks - [POST] '/user/change-email'
  *
  * 1. Error on field require - 400 & error msg
  * 2. Error on field empty - 400 & error msg
  * 3. Error on field of incorrect type - 400 & error msg
  * 4. Error on field no match regex - 400 & error msg
  * 5. Success on valid token & send mail update password - 200 & success msg & doc user
  * 6. Error on user not found - 401 & error msg
*/

testToken('post', '/user/change-email')

describe('Private Routes _user', () => {

  beforeAll(async () => {
    server = await initiateServer()
    user = await saveUser(mockUser())
  })

  afterAll(async () => {
    await server.close()
  })

  describe('[POST] /user/change-email', () => {

    /**
     * 1. Error on field require
    */
    test('should return 400 & \'new email required\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .post('/user/change-email')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({})
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('new email required')
    })

    /**
     * 2. Error on field empty
    */
    test('should return 400 & \'new email cannot be empty\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .post('/user/change-email')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({ newEmail: '' })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('new email cannot be empty')
    })

    /**
     * 3. Error on field of incorrect type
    */
    test('should return 400 & \'new email in incorrect format\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .post('/user/change-email')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({ newEmail: 123 })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('new email in incorrect format')
    })

    /**
     * 4. Error on field no match regex
    */
    test('should return 400 & \'invalid new email\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .post('/user/change-email')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({ newEmail: 'user2.mail@gmail' })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('invalid new email')
    })

    /**
     * 5. Success on valid token & update password
    */
    test('should return 200 & \'an email to change your email address has been sent...\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .post('/user/change-email')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({ newEmail: 'user2.mail@gmail.com' })
      expect(res.status).toEqual(200)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('an email to change your email address has been sent to this new address')
    })

    /**
     * 6. Error on user not found
    */
    test('should return 401 & \'unauthorized\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      await User.deleteOne({ username: 'user' })
      const res = await REQUEST(server)
        .post('/user/change-email')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({ newEmail: 'user2.mail@gmail.com' })
      expect(res.status).toEqual(401)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('unauthorized')
    })
  })
})
