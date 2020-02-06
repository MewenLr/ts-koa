import { Context } from 'koa'
import config from '../config/parameters'
import { ErrRedirectionType } from '../contracts/types'

export default (ctx: Context, pathname = '', notif?: string, e?: ErrRedirectionType): void => {

  if (e?.name === 'TokenExpiredError') return ctx.redirect(`${config.website}${pathname}?notif=token_expired`)

  if (e?.err?.code === 11000) return ctx.redirect(`${config.website}${pathname}?notif=${notif}`)

  if (e) return ctx.redirect(`${config.website}${pathname}?notif=token_invalid`)

  return ctx.redirect(`${config.website}${pathname}?notif=${notif}`)

}
