/* eslint-disable max-len */
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
  * @remarks - [PUT] '/user/password'
  *
  * 1. Error on field require - 400 & error msg
  * 2. Error on field empty - 400 & error msg
  * 3. Error on field of incorrect type - 400 & error msg
  * 4. Error on field no match regex - 400 & error msg
  * 5. Error on password no match - 400 & error msg
  * 6. Error on new password no match confirm - 400 & error msg
  * 7. Success on valid token & update password - 200 & success msg & doc user
  * 8. Error on user not found - 401 & error msg
*/

testToken('put', '/user/password')

describe('Private Routes _user', () => {

  beforeAll(async () => {
    server = await initiateServer()
    user = await saveUser(mockUser())
  })

  afterAll(async () => {
    await server.close()
  })

  describe('[PUT] /user/password', () => {

    /**
     * 1. Error on field require
    */
    test('should return 400 & \'new password required\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .put('/user/password')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'Pass1234',
          confirmNewPassword: 'Test1234',
        })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('new password required')
    })

    /**
     * 2. Error on field empty
    */
    test('should return 400 & \'confirm new password cannot be empty\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .put('/user/password')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'Passs1234',
          newPassword: 'Test1234',
          confirmNewPassword: '',
        })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('confirm new password cannot be empty')
    })

    /**
     * 3. Error on field of incorrect type
    */
    test('should return 400 & \'password in incorrect format\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .put('/user/password')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 123,
          newPassword: 'Test1234',
          confirmNewPassword: 'Test1234',
        })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('password in incorrect format')
    })

    /**
     * 4. Error on field no match regex
    */
    test('should return 400 & \'password should contain at least one digit...\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .put('/user/password')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'pass123',
          newPassword: 'Test1234',
          confirmNewPassword: 'Test1234',
        })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('password should contain at least one digit, one lower case, one upper case and at least 8 characters')
    })

    /**
     * 5. Error on password no match
    */
    test('should return 400 & \'password doesn\'t match\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .put('/user/password')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'Pass12345',
          newPassword: 'Test1234',
          confirmNewPassword: 'Test1234',
        })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('password doesn\'t match')
    })

    /**
     * 6. Error on new password no match confirm
    */
    test('should return 400 & \'new password doesn\'t match confirm new password\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .put('/user/password')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'Pass1234',
          newPassword: 'Test1234',
          confirmNewPassword: 'Test12345',
        })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('new password doesn\'t match confirm new password')
    })

    /**
     * 7. Success on valid token & update password
    */
    test('should return 200 & \'password updated successfully\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .put('/user/password')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'Pass1234',
          newPassword: 'Test1234',
          confirmNewPassword: 'Test1234',
        })
      expect(res.status).toEqual(200)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('password updated successfully')
    })

    /**
     * 8. Error on user not found
    */
    test('should return 401 & \'unauthorized\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      await User.deleteOne({ username: 'user' })
      const res = await REQUEST(server)
        .put('/user/password')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'Test1234',
          newPassword: 'Pass1234',
          confirmNewPassword: 'Pass1234',
        })
      expect(res.status).toEqual(401)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('unauthorized')
    })
  })
})
