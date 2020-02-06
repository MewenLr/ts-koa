import http from 'http'
import REQUEST from 'supertest'
import {
  saveUser,
  mockUser,
  initiateServer,
} from '../../../index'

let server: null|http.Server = null

/**
  * @remarks - [POST] /user/reset-password
  *
  * 1. Error on field require - 400 & error msg
  * 2. Error on field empty - 400 & error msg
  * 3. Error on field of incorrect type - 400 & error msg
  * 4. Error on field no match regex - 400 & error msg
  * 5. Error on data not found - 404 & error msg
  * 6. Success on generate token & send mail reset password - 200 & success msg
*/

describe('Private Routes _user', () => {

  beforeAll(async () => {
    server = await initiateServer()
    await saveUser(mockUser())
  })

  afterAll(async () => {
    await server.close()
  })

  describe('[POST] /user/reset-password', () => {

    /**
     * 1. Error on field require
    */
    test('should return 400 & \'email required\'', async () => {
      const res = await REQUEST(server)
        .post('/user/reset-password')
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
        .post('/user/reset-password')
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
        .post('/user/reset-password')
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
        .post('/user/reset-password')
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
        .post('/user/reset-password')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .send({ email: 'not.found@gmail.com' })
      expect(res.status).toEqual(404)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('email not found')
    })

    /**
     * 6. Success on generate token & send mail reset password
    */
    test('should return 200 & \'an email to reset your password has been sent\'', async () => {
      const res = await REQUEST(server)
        .post('/user/reset-password')
        .set('Content-Type', 'application/json')
        .set('Accept-Language', 'en')
        .send({ email: 'user.mail@gmail.com' })
      expect(res.status).toEqual(200)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('an email to reset your password has been sent')
    })
  })
})
