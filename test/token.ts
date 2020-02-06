import http from 'http'
import REQUEST from 'supertest'
import JWTOKEN from 'jsonwebtoken'
import {
  IUser,
  config,
  saveUser,
  initiateServer,
} from './index'

let user: IUser
let server: null|http.Server = null

/**
  * @remarks - [TOKEN]
  *
  * 1. Error on no authorization header - 401 & error msg
  * 2. Error on token no match regex - 401 & error msg
  * 3. Error on invalid token - 401 & error msg
  * 4. Error on token expired - 401 & error msg
  * 5. Error on invalid signature
  * 6. Error on token malformed
*/

export default (type, path, data?): void => {

  /* all fields to avoid require err */
  const userToken = {
    email: 'usertoken.mail@gmail.com',
    newEmail: 'usertoken2.mail@gmail.com',
    username: 'usertoken',
    password: 'Pass1234',
    newPassword: 'Pass1234',
    confirmPassword: 'Pass1234',
    confirmNewPassword: 'Pass1234',
  }

  describe('Private Routes _user', () => {

    beforeAll(async () => {
      server = await initiateServer()
      user = await saveUser(userToken)
    })

    afterAll(async () => {
      await server.close()
    })

    describe(`[${type.toUpperCase()}-Token] ${path}`, () => {

      /**
       * 1. Error on no authorization header
      */
      test('No authorization header - should return 401 & \'unauthorized\'', async () => {
        const res = await REQUEST(server)[type](path)
          .set('Content-Type', 'application/json')
          .set('Accept-Language', 'en')
          .send(userToken)
        expect(res.status).toEqual(401)
        expect(res.type).toEqual('application/json')
        expect(res.body.msg).toEqual('unauthorized')
      })

      /**
       * 2. Error on token no match regex
      */
      test('No match regex - should return 401 & \'unauthorized\'', async () => {
        const token = JWTOKEN.sign({ id: user._id, ...data }, config.jwtSecret, { expiresIn: 86400 })
        const res = await REQUEST(server)[type](path)
          .set('Content-Type', 'application/json')
          .set('Accept-Language', 'en')
          .set('Authorization', `Beer ${token}`)
          .send(userToken)
        expect(res.status).toEqual(401)
        expect(res.type).toEqual('application/json')
        expect(res.body.msg).toEqual('unauthorized')
      })

      /**
       * 3. Error on invalid token
      */
      test('Invalid token - should return 401 & \'unauthorized\'', async () => {
        const token = JWTOKEN.sign({ id: user._id, ...data }, config.jwtSecret, { expiresIn: 86400 })
        const res = await REQUEST(server)[type](path)
          .set('Content-Type', 'application/json')
          .set('Accept-Language', 'en')
          .set('Authorization', `Bearer ${token}afdsf`)
          .send(userToken)
        expect(res.status).toEqual(401)
        expect(res.type).toEqual('application/json')
        expect(res.body.msg).toEqual('unauthorized')
      })

      /**
       * 4. Error on token expired
      */
      test('Token expired - should return 401 & \'unauthorized\'', async () => {
        const token = JWTOKEN.sign({ id: user._id, ...data }, config.jwtSecret, { expiresIn: -1 })
        const res = await REQUEST(server)[type](path)
          .set('Content-Type', 'application/json')
          .set('Accept-Language', 'en')
          .set('Authorization', `Bearer ${token}`)
          .send(userToken)
        expect(res.status).toEqual(401)
        expect(res.type).toEqual('application/json')
        expect(res.body.msg).toEqual('unauthorized')
      })

      /**
       * 5. Error on invalid signature
      */
      test('Invalid signature - should return 401 & \'unauthorized\'', async () => {
        const token = JWTOKEN.sign({ id: user._id }, 'wrong-sign', { expiresIn: 86400 })
        const res = await REQUEST(server)[type](path)
          .set('Content-Type', 'application/json')
          .set('Accept-Language', 'en')
          .set('Authorization', `Bearer ${token}`)
          .send(userToken)
        expect(res.status).toEqual(401)
        expect(res.type).toEqual('application/json')
        expect(res.body.msg).toEqual('unauthorized')
      })

      /**
       * 6. Error on token malformed
      */
      test('Token malformed - should return 401 & \'unauthorized\'', async () => {
        const token = JWTOKEN.sign({ id: 'wrong-id' }, config.jwtSecret, { expiresIn: 86400 })
        const res = await REQUEST(server)[type](path)
          .set('Content-Type', 'application/json')
          .set('Accept-Language', 'en')
          .set('Authorization', `Bearer ${token}`)
          .send(userToken)
        expect(res.status).toEqual(401)
        expect(res.type).toEqual('application/json')
        expect(res.body.msg).toEqual('unauthorized')
      })
    })
  })
}
