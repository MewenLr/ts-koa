import http from 'http'
import REQUEST from 'supertest'
import {
  User,
  mockUser,
  saveUser,
  initiateServer,
} from '../../../index'

let server: null|http.Server = null

/**
  * @remarks - [POST] /user/authenticate
  *
  * 1. Error on field require - 400 & error msg
  * 2. Error on field empty - 400 & error msg
  * 3. Error on field of incorrect type - 400 & error msg
  * 4. Error on field no match regex - 400 & error msg
  * 5. Error on data not found - 404 & error msg
  * 6. Error on account not confirmed - 401 & error msg
  * 7. Error on password no match - 400 & error msg
  * 8. Success on authenticate user and generate token - 200 & success msg
*/

describe('Public Routes _user', () => {

  beforeAll(async () => {
    server = await initiateServer()
    await saveUser(mockUser())
  })

  afterAll(async () => {
    await server.close()
  })

  describe('[POST] /user/authenticate', () => {

    /**
     * 1. Error on field require
    */
    test('should return 400 & \'email required\'', async () => {
      const res = await REQUEST(server)
        .post('/user/authenticate')
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
        .post('/user/authenticate')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .send({ email: '' })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('email cannot be empty')
    })

    /**
     * 3. Error on field of incorrect type
    */
    test('should return 400 & \'email in incorrect format\'', async () => {
      const res = await REQUEST(server)
        .post('/user/authenticate')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .send({ email: 123 })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('email in incorrect format')
    })

    /**
     * 4. Error on field no match regex
    */
    test('should return 400 & \'invalid email\'', async () => {
      const res = await REQUEST(server)
        .post('/user/authenticate')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .send({ email: 'user.mail@gmail' })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('invalid email')
    })

    /**
     * 5. Error on data not found
    */
    test('should return 404 & \'email not found\'', async () => {
      const res = await REQUEST(server)
        .post('/user/authenticate')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .send({
          email: 'not.found@gmail.com',
          password: 'Test1234',
        })
      expect(res.status).toEqual(404)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('email not found')
    })

    /**
     * 6. Error on account not confirmed
    */
    test('should return 401 & \'you must confirmed your account with the email that you received\'', async () => {
      const res = await REQUEST(server)
        .post('/user/authenticate')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .send({
          email: 'user.mail@gmail.com',
          password: 'Test1234',
        })
      expect(res.status).toEqual(401)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('you must confirmed your account with the email that you received')
    })

    /**
     * 7. Error on password no match
    */
    test('should return 400 & \'password doesn\'t match\'', async () => {
      await User.findOneAndUpdate({ email: 'user.mail@gmail.com' }, { confirmed: true })
      const res = await REQUEST(server)
        .post('/user/authenticate')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .send({
          email: 'user.mail@gmail.com',
          password: 'Test1234',
        })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('password doesn\'t match')
    })

    /**
     * 8. Success on authenticate user and generate token
    */
    test('should return 200 & \'authentication successful\'', async () => {
      await User.findOneAndUpdate({ email: 'user.mail@gmail.com' }, { confirmed: true })
      const res = await REQUEST(server)
        .post('/user/authenticate')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .send({
          email: 'user.mail@gmail.com',
          password: 'Pass1234',
        })
      expect(res.status).toEqual(200)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('authentication successful')
    })
  })
})
