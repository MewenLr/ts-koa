import { Context } from 'koa'
import { ResBodyType } from '../contracts/types'

export default (ctx: Context, code: number, body: ResBodyType, e?: object): ResBodyType => {
  if (e) console.error(`\n[err] >> ${e}\n`)
  ctx.status = code
  return ctx.body = body
}
