/* eslint-disable padded-blocks,import/no-unresolved */
import { Context } from 'koa'
import { ValidationErrorItem } from 'joi'
import trans from './trans'
import resbody from './resbody'
import altTransKey from '../helpers/alt-trans-key'
import { ResBodyType, ErrJoiDetailsType } from '../contracts/types'


const errJoiCustomMsg = (ctx: Context, details: ErrJoiDetailsType[]): Promise<object> => new Promise((res) => {
  details.map((e) => {
    let altTrans: string
    const { type, context } = e

    switch (true) {
      case type.includes('object.min'):
        return res({ message: trans(ctx, 'error.default') })

      case type.includes('.allowUnknown'):
        return res({ message: trans(ctx, `error.notAllow|key.${context.key}`) })

      case type.includes('.empty'):
        return res({ message: trans(ctx, `error.noEmpty|key.${context.key}`) })

      case type.includes('.regex'):
        altTrans = altTransKey[context.key] ? altTransKey[context.key] : context.key
        return res({ message: trans(ctx, `error.rule.${altTrans}|key.${context.key}`) })

      case type.includes('.base'):
        return res({ message: trans(ctx, `error.type|key.${context.key}`) })

      case type.includes('.required'):
        return res({ message: trans(ctx, `error.require|key.${context.key}`) })

      default:
        return res({ message: trans(ctx, 'error.default') })
    }
  })
})

export const errJoiHandler = async (ctx: Context, next: Function): Promise<ResBodyType | Function> => {

  if (ctx?.invalid) {

    if (ctx?.invalid?.header) return resbody(ctx, 401, { msg: trans(ctx, 'error.unauthorized') })

    if (ctx?.invalid?.body) {
      const { status, details } = ctx.invalid.body
      details[0] = await errJoiCustomMsg(ctx, details)
      return resbody(ctx, status, { msg: details[0].message })
    }

    return resbody(ctx, 400, { msg: trans(ctx, 'error.default') })
  }

  return next()
}

export const errJoiOutput = (e: ValidationErrorItem[]): ValidationErrorItem[] => {
  console.error(`\n[err] Joi output >> ${e}\n`)
  return e
}
