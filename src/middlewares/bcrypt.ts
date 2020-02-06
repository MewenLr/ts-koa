import { Context } from 'koa'
import BCRYPT from 'bcryptjs'
import trans from '../utils/trans'

export default class Bcrypt {

  public static hash(ctx: Context, value: string): Promise<string> {
    return new Promise((res, rej) => {
      BCRYPT.hash(value, 10, (err, hash) => {
        if (err) return rej({ code: 400, msg: trans(ctx, 'failure.hash'), err })
        return res(hash)
      })
    })
  }

  public static compareHash(ctx: Context, value: string, hash: string): Promise<boolean> {
    return new Promise((res, rej) => {
      BCRYPT.compare(value, hash, (err, match) => {
        if (err) return rej({ code: 400, msg: trans(ctx, 'failure.hash'), err })
        if (!match) return rej({ code: 400, msg: trans(ctx, 'failure.hash.matchPassword') })
        return res(match)
      })
    })
  }

}
