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
  * @remarks - [PUT] '/user'
  *
  * 1. Error on update empty - 400 & error msg
  * 2. Error on field empty - 400 & error msg
  * 3. Error on field of incorrect type - 400 & error msg
  * 4. Error on field no match regex - 400 & error msg
  * 5. Error on field uniqueness - 400 & error msg
  * 6. Success on valid token & update user - 200 & success msg & doc user
  * 7. Error on user not found - 401 & error msg
*/

testToken('put', '/user')

describe('Private Routes _user', () => {

  beforeAll(async () => {
    server = await initiateServer()
    user = await saveUser(mockUser())
    await saveUser(mockUser('2'))
  })

  afterAll(async () => {
    await server.close()
  })

  describe('[PUT] /user', () => {

    /**
     * 1. Error on update empty
    */
    test('should return 400 & \'an error occured\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .put('/user')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({})
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('an error occured')
    })

    /**
     * 2. Error on field empty
    */
    test('should return 400 & \'username cannot be empty\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .put('/user')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({ username: '' })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('username cannot be empty')
    })

    /**
     * 3. Error on field of incorrect type
    */
    test('should return 400 & \'username in incorrect format\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .put('/user')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({ username: 123 })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('username in incorrect format')
    })

    /**
     * 4. Error on field no match regex
    */
    test('should return 400 & \'username should contain only letter...\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .put('/user')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({ username: 'te' })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('username should contain only letter, digit, _ or - and between 3 to 6 characters')
    })

    /**
     * 5. Error on field uniqueness
    */
    test('should return 400 & \'failed to update user\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .put('/user')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({ username: 'user2' })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      /* test uniqueness goes for 'failure.key' msg */
      expect(res.body.msg).toEqual('failed to update user')
    })

    /**
     * 6. Success on valid token & update user
    */
    test('should return 200 & \'user updated successfully\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .put('/user')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({ username: 'user3' })
      expect(res.status).toEqual(200)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('user updated successfully')
      expect(Object.keys(res.body.doc)).toEqual(
        expect.arrayContaining(['username']),
      )
    })

    /**
     * 7. Error on user not found
    */
    test('should return 401 & \'unauthorized\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      await User.deleteOne({ username: 'user3' })
      const res = await REQUEST(server)
        .put('/user')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({ username: 'user' })
      expect(res.status).toEqual(401)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('unauthorized')
    })
  })
})
