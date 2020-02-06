import { Context } from 'koa'
import re from '../helpers/regex'
import trans from './trans'
import resbody from './resbody'
import { ResBodyType } from '../contracts/types'

export default (ctx: Context, next: Function): ResBodyType | Function => {
  const langToken = ctx.get('accept-language').slice(0, 2)
  if (!re.lang.test(langToken)) return resbody(ctx, 400, { msg: trans(ctx, 'error.rule.language') })
  ctx.i18n.setLocale(langToken)
  return next()
}
