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
  * @remarks - [GET] '/user'
  *
  * 1. Success on valid token & get user - 200 & success msg & doc user
  * 2. Error on user not found - 401 & error msg
*/

testToken('get', '/user')

describe('Private Routes _user', () => {

  beforeAll(async () => {
    server = await initiateServer()
    user = await saveUser(mockUser())
  })

  afterAll(async () => {
    await server.close()
  })


  describe('[GET] /user', () => {

    /**
     * 1. Success on valid token & get user
    */
    test('should return 200 & \'user found\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      const res = await REQUEST(server)
        .get('/user')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toEqual(200)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('user found')
      expect(Object.keys(res.body.doc)).toEqual(
        expect.arrayContaining(['username', 'email']),
      )
    })

    /**
     * 2. Error on user not found
    */
    test('should return 401 & \'unauthorized\'', async () => {
      const token = JWTOKEN.sign({ id: user._id }, config.jwtSecret, { expiresIn: 86400 })
      await User.deleteOne({ username: 'user' })
      const res = await REQUEST(server)
        .get('/user')
        .set('Accept-Language', 'en')
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toEqual(401)
      expect(res.type).toEqual('application/json')
      expect(res.body.msg).toEqual('unauthorized')
    })
  })
})
