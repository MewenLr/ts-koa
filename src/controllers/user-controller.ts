import { Context } from 'koa'
import * as JWTOKEN from 'jsonwebtoken'
import User from '../schemas/User'
import trans from '../utils/trans'
import filters from '../utils/filters'
import queries from '../utils/queries'
import resbody from '../utils/resbody'
import config from '../config/parameters'
import mailer from '../middlewares/mailer'
import bcrypt from '../middlewares/bcrypt'
import redirections from '../utils/redirections'
import { ResBodyType } from '../contracts/types'
import { IDecodedToken } from '../contracts/interfaces'

export default class UserController {

  public static mailRegUser = async (ctx: Context): Promise<ResBodyType> => {
    const { password, confirmPassword } = ctx.request.body
    try {
      if (password !== confirmPassword)
        throw { code: 400, msg: trans(ctx, 'error.match|key.password|key.confirmPassword') }
      const newUser = new User({ ...ctx.request.body, expireAt: Date.now() })
      newUser.password = await bcrypt.hash(ctx, newUser.password)
      await queries.save(ctx, newUser, 'save|key.user')
      const token = JWTOKEN.sign({ id: newUser._id }, config.jwtSecret, { expiresIn: 86400 })
      const { code, msg } = await mailer.send(ctx, 'confirmUserMail', { email: newUser.email, token })
      return resbody(ctx, code, { msg })
    } catch (e) {
      return resbody(ctx, e.code, { msg: e.msg }, e.err)
    }
  }

  public static cbRegUser = async (ctx: Context): Promise<void> => {
    try {
      const decoded = await JWTOKEN.verify(ctx.params.token, config.jwtSecret) as IDecodedToken
      await queries.updateOne(ctx, User, { _id: decoded.id }, { confirmed: true }, { expireAt: '' }, 'key.user')
      return redirections(ctx, 'login', 'user_confirmed')
    } catch (e) {
      return redirections(ctx, 'register', '', e)
    }
  }

  public static authUser = async (ctx: Context): Promise<ResBodyType> => {
    const { email, password } = ctx.request.body
    try {
      const { code, doc } = await queries.findOne(ctx, User, { email } as { email: string }, 'key.user')
      if (!doc.confirmed) throw { code: 401, msg: trans(ctx, 'error.confirm.account') }
      await bcrypt.compareHash(ctx, password, doc.password)
      const token = JWTOKEN.sign({ id: doc._id }, config.jwtSecret, { expiresIn: 86400 })
      return resbody(ctx, code, { msg: trans(ctx, 'success.authentication'), token: `Bearer ${token}` })
    } catch (e) {
      return resbody(ctx, e.code, { msg: e.msg }, e.err)
    }
  }

  public static getUser = async (ctx: Context): Promise<ResBodyType> => {
    const { code, msg, doc } = ctx.state.user
    const docFiltered = filters.objByKey(doc, ['username', 'email'])
    return resbody(ctx, code, { msg, doc: docFiltered })
  }

  public static updUser = async (ctx: Context): Promise<ResBodyType> => {
    try {
      const updatedUser = Object.assign(ctx.state.user.doc, ctx.request.body)
      const { code, msg, doc } = await queries.save(ctx, updatedUser, 'update|key.user')
      const resFiltered = filters.objByKey(doc, ['username'])
      return resbody(ctx, code, { msg, doc: resFiltered })
    } catch (e) {
      return resbody(ctx, e.code, { msg: e.msg }, e.err)
    }
  }

  public static resetPwd = async (ctx: Context): Promise<ResBodyType> => {
    const { doc } = ctx.state.user
    const { password, newPassword, confirmNewPassword } = ctx.request.body
    try {
      if (newPassword !== confirmNewPassword)
        throw { code: 400, msg: trans(ctx, 'error.match|key.newPassword|key.confirmNewPassword') }
      if (password) await bcrypt.compareHash(ctx, password, doc.password)
      const newPasswordHash = await bcrypt.hash(ctx, newPassword)
      const updatedUser = Object.assign(doc, { password: newPasswordHash })
      const { code, msg } = await queries.save(ctx, updatedUser, 'update|key.password')
      return resbody(ctx, code, { msg })
    } catch (e) {
      return resbody(ctx, e.code, { msg: e.msg })
    }
  }

  public static mailResetPwd = async (ctx: Context): Promise<ResBodyType> => {
    const { email } = ctx.request.body
    try {
      const { doc } = await queries.findOne(ctx, User, { email }, 'key.user')
      const token = JWTOKEN.sign({ id: doc.id }, config.jwtSecret, { expiresIn: 86400 })
      const { code, msg } = await mailer.send(ctx, 'resetPasswordMail', { email: doc.email, token })
      return resbody(ctx, code, { msg })
    } catch (e) {
      return resbody(ctx, e.code, { msg: e.msg }, e.err)
    }
  }

  public static mailChangeEmail = async (ctx: Context): Promise<ResBodyType> => {
    const { _id } = ctx.state.user.doc
    const { newEmail } = ctx.request.body
    try {
      const token = JWTOKEN.sign({ id: _id, email: newEmail }, config.jwtSecret, { expiresIn: -1 })
      const { code, msg } = await mailer.send(ctx, 'changeEmailMail', { email: newEmail, token })
      return resbody(ctx, code, { msg })
    } catch (e) {
      return resbody(ctx, e.code, { msg: e.msg })
    }
  }

  public static cbChangeEmail = async (ctx: Context): Promise<void> => {
    try {
      const decoded = await JWTOKEN.verify(ctx.params.token, config.jwtSecret) as IDecodedToken
      await queries.updateOne(ctx, User, { _id: decoded.id }, { email: decoded.email }, {}, 'key.email')
      return redirections(ctx, 'login', 'email_updated')
    } catch (e) {
      return redirections(ctx, '', 'email_exists', e)
    }
  }

  public static delUser = async (ctx: Context): Promise<ResBodyType> => {
    const { email } = ctx.request.body
    try {
      const { code, msg } = await queries.deleteOne(ctx, User, { email }, 'key.user')
      return resbody(ctx, code, { msg })
    } catch (e) {
      return resbody(ctx, e.code, { msg: e.msg }, e.err)
    }
  }

}
