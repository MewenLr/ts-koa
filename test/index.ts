import http from 'http'
import BCRYPT from 'bcryptjs'
import { MongoMemoryServer } from 'mongodb-memory-server'
import Server from '../src/server'
import User from '../src/schemas/User'
import config from '../src/config/parameters'
import { IUser } from '../src/contracts/interfaces/IUser'

let user: IUser

const mongoServer = new MongoMemoryServer()

export {
  User,
  IUser,
  config,
}

export const initiateServer = async (): Promise<null|http.Server> => {
  console.info = (): void => {}
  console.error = (): void => {}
  const uri = await mongoServer.getConnectionString()
  const instance = new Server({
    mongoUri: uri,
    port: Math.floor(Math.random() * (10000 - 4000 + 1)) + 4000,
    jwtSecret: '2345678945678',
  })
  return http.createServer(instance.initiate().listen().callback())
}

export const mockUser = (id = ''): object => ({
  email: `user${id}.mail@gmail.com`,
  username: `user${id}`,
  password: 'Pass1234',
  confirmPassword: 'Pass1234',
})

export const saveUser = (newUser): Promise<IUser> => new Promise((res, rej) => {
  user = new User(newUser)
  BCRYPT.hash(user.password, 10, (err, hash): void => {
    if (err) return rej(err)
    user.password = hash
    user.save()
    return res(user)
  })
})
