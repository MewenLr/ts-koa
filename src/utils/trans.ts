import { Context } from 'koa'

export default (ctx: Context, transKey: string): string => {
  if (transKey.includes('|')) {
    const [msg, key1, key2] = transKey.split('|')
    if (key2) return ctx.i18n.__(msg, ctx.i18n.__(key1), ctx.i18n.__(key2))
    return ctx.i18n.__(msg, ctx.i18n.__(key1))
  }
  return ctx.i18n.__(transKey)
}
