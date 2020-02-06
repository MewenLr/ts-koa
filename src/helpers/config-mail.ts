import { Context } from 'koa'
import trans from '../utils/trans'
import mails from '../config/mails/index'
import { DataMailType, ConfigMailType } from '../contracts/types'

export default {

  changeEmailMail: (ctx: Context, data: DataMailType): ConfigMailType => ({
    subject: trans(ctx, 'mail.changeEmail.subject'),
    html: mails.changeEmailHtml(ctx, data),
    success: trans(ctx, 'success.mail.changeEmail'),
  }),

  confirmUserMail: (ctx: Context, data: DataMailType): ConfigMailType => ({
    subject: trans(ctx, 'mail.confirmUser.subject'),
    html: mails.confirmUserHtml(ctx, data),
    success: trans(ctx, 'success.mail.confirmUser'),
  }),

  resetPasswordMail: (ctx: Context, data: DataMailType): ConfigMailType => ({
    subject: trans(ctx, 'mail.resetPassword.subject'),
    html: mails.resetPasswordHtml(ctx, data),
    success: trans(ctx, 'success.mail.resetPassword'),
  }),

}
