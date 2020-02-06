import http from 'http'
import REQUEST from 'supertest'
import { initiateServer } from '../../../index'

let server: null|http.Server = null

/**
  * @remarks - [POST] /user/register
  *
  * 1. Error on field require - 400 & error msg
  * 2. Error on field empty - 400 & error msg
  * 3. Error on field of incorrect type - 400 & error msg
  * 4. Error on field no match regex - 400 & error msg
  * 5. Error on password no match confirmation password - 400 & error msg
  * 6. Success on register user & send mail confirmation - 200 & success msg
  * 7. Error on field uniqueness - 400 & error msg
*/

describe('Public Routes _user', () => {

  beforeAll(async () => {
    server = await initiateServer()
  })

  afterAll(async () => {
    await server.close()
  })

  describe('[POST] /user/register', () => {

    /**
     * 1. Error on field require
    */
    test('should return 400 & \'email required\'', async () => {
      const res = await REQUEST(server)
        .post('/user/register')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .send({})
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('email required')
    })

    /**
     * 2. Error on field empty
    */
    test('should return 400 & \'email cannot be empty\'', async () => {
      const res = await REQUEST(server)
        .post('/user/register')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .send({ email: '' })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('email cannot be empty')
    })

    /**
     * 3. Error on incorrect type
    */
    test('should return 400 & \'email in incorrect format\'', async () => {
      const res = await REQUEST(server)
        .post('/user/register')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .send({ email: 123 })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('email in incorrect format')
    })

    /**
     * 4. Error on no match regex
    */
    test('should return 400 & \'invalid email\'', async () => {
      const res = await REQUEST(server)
        .post('/user/register')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .send({ email: 'user.mail@gmail' })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('invalid email')
    })

    /**
     * 5. Error on password no match confirmation password
    */
    test('should return 400 & \'password doesn\'t match confirm password\'', async () => {
      const res = await REQUEST(server)
        .post('/user/register')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .send({
          email: 'user.mail@gmail.com',
          username: 'user',
          password: 'Pass1234',
          confirmPassword: 'Pass12345',
        })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('password doesn\'t match confirm password')
    })

    /**
     * 6. Success on register user and mail sent confirmation
    */
    test('should return 200 & \'an email to confirm your account has been sent\'', async () => {
      const res = await REQUEST(server)
        .post('/user/register')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .send({
          email: 'user.mail@gmail.com',
          username: 'user',
          password: 'Pass1234',
          confirmPassword: 'Pass1234',
        })
      expect(res.status).toEqual(200)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('an email to confirm your account has been sent')
    })

    /**
     * 7. Error on field uniqueness
    */
    test('should return 400 & \'failed to save user\'', async () => {
      const res = await REQUEST(server)
        .post('/user/register')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .send({
          email: 'user.mail@gmail.com',
          username: 'tesuser2tuser2',
          password: 'Pass1234',
          confirmPassword: 'Pass1234',
        })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      /* test uniqueness goes for 'failure.key' msg */
      expect(res.body.msg).toEqual('failed to save user')
    })
  })
})
