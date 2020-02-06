import http from 'http'
import REQUEST from 'supertest'
import JWTOKEN from 'jsonwebtoken'
import testToken from '../../../token'
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
  * @remarks - [DELETE] '/user'
  *
  * 1. Error on field require - 400 & error msg
  * 2. Error on field empty - 400 & error msg
  * 3. Error on field of incorrect type - 400 & error msg
  * 4. Error on field no match regex - 400 & error msg
  * 5. Success on valid token & delete user - 200 & success msg
  * 6. Error on user not found - 401 & error msg
*/

testToken('delete', '/user')

describe('Private Routes _user', () => {

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

  describe('[DELETE] /user', () => {

    /**
     * 1. Error on field require
    */
    test('should return 400 & \'email required\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .delete('/user')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({})
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('email required')
    })

    /**
     * 2. Error on field empty
    */
    test('should return 400 & \'email cannot be empty\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .delete('/user')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: '' })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('email cannot be empty')
    })

    /**
     * 3. Error on field of incorrect type
    */
    test('should return 400 & \'email in incorrect format\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .delete('/user')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 123 })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('email in incorrect format')
    })

    /**
     * 4. Error on field no match regex
    */
    test('should return 400 & \'invalid email\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .delete('/user')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'test.mail@gmail' })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('invalid email')
    })

    /**
     * 5. Success on valid token & update password
    */
    test('should return 200 & \'user deleted successfully\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .delete('/user')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'test.mail@gmail.com' })
      expect(res.status).toEqual(200)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('user deleted successfully')
    })

    /**
     * 6. Error on user not found
    */
    test('should return 401 & \'unauthorized\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      await User.deleteOne({ username: 'testuser' })
      const res = await REQUEST(server)
        .delete('/user')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'test.mail@gmail.com' })
      expect(res.status).toEqual(401)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('unauthorized')
    })
  })
})
