import { Context } from 'koa'
import JWTOKEN from 'jsonwebtoken'
import trans from './trans'
import resbody from './resbody'
import queries from './queries'
import User from '../schemas/User'
import config from '../config/parameters'
import { ResBodyType } from '../contracts/types'
import { IDecodedToken } from '../contracts/interfaces'

export default async (ctx: Context, next: Function): Promise<Function | ResBodyType> => {
  const token = ctx.request.header.authorization.split(' ')[1]
  try {
    const decoded = await JWTOKEN.verify(token, config.jwtSecret) as IDecodedToken
    ctx.state.user = await queries.findById(ctx, User, decoded.id, 'key.user')
    return next()
  } catch (e) {
    return resbody(ctx, 401, { msg: trans(ctx, 'error.unauthorized') }, e.err)
  }
}
