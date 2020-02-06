/* eslint arrow-body-style: ["error", "always"] */
import { Context } from 'koa'
import { Document, Model } from 'mongoose'
import trans from './trans'
import { ResFormatType } from '../contracts/types'

export default {

  save: (ctx: Context, data: Document, transKey: string): Promise<ResFormatType> => {
    return new Promise((res, rej) => {
      data.save((err) => {
        if (err) {
          const errorMsg = err.code === 11000 && err.keyValue
            ? trans(ctx, `error.unique|key.${Object.keys(err.keyValue)[0]}`) : trans(ctx, `failure.${transKey}`)
          return rej({ code: 400, msg: errorMsg, err: err.code !== 11000 ? err : undefined })
        }
        return res({ code: 200, msg: trans(ctx, `success.${transKey}`), doc: data })
      })
    })
  },

  findOne: (ctx: Context, collection: Model<Document>, query: object, transKey: string): Promise<ResFormatType> => {
    return new Promise((res, rej) => {
      collection.findOne(query, (err, doc) => {
        if (err) return rej({ code: 400, msg: trans(ctx, `failure.find|${transKey}`), err })
        if (!doc) return rej({ code: 404, msg: trans(ctx, `error.docNotFound|key.${Object.keys(query)[0]}`) })
        return res({ code: 200, msg: trans(ctx, `success.find|${transKey}`), doc })
      })
    })
  },

  findById: (ctx: Context, collection: Model<Document>, id: string, transKey: string): Promise<ResFormatType> => {
    return new Promise((res, rej) => {
      collection.findById(id, (err, doc) => {
        if (err) return rej({ code: 400, msg: trans(ctx, `failure.find|${transKey}`), err })
        if (!doc) return rej({ code: 404, msg: trans(ctx, `error.docNotFound|${transKey}`) })
        return res({ code: 200, msg: trans(ctx, `success.find|${transKey}`), doc })
      })
    })
  },

  updateOne: (
    ctx: Context,
    collection: Model<Document>,
    query: object,
    updates: object,
    unset: object,
    transKey: string,
  ): Promise<ResFormatType> => {
    return new Promise((res, rej) => {
      collection.findOneAndUpdate(query, { $set: updates, $unset: unset }, { new: true }, (err, doc) => {
        if (err) return rej({ code: 400, msg: trans(ctx, `failure.update|${transKey}`), err })
        if (!doc) return rej({ code: 404, msg: trans(ctx, `error.docNotFound|${transKey}`) })
        return res({ code: 200, msg: trans(ctx, `success.update|${transKey}`), doc })
      })
    })
  },

  deleteOne: (ctx: Context, collection: Model<Document>, query: object, transKey: string): Promise<ResFormatType> => {
    return new Promise((res, rej) => {
      collection.deleteOne(query, (err) => {
        if (err) return rej({ code: 400, msg: trans(ctx, `failure.delete|${transKey}`), err })
        return res({ code: 200, msg: trans(ctx, `success.delete|${transKey}`) })
      })
    })
  },

}
