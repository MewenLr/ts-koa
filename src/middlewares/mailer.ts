import mjml2html from 'mjml'
import { Context } from 'koa'
import nodemailer from 'nodemailer'
import trans from '../utils/trans'
import configMail from '../helpers/config-mail'
import { DataMailType, ResFormatType } from '../contracts/types'

const ENV = process.env

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: ENV.MAIL_PROJECT ? ENV.MAIL_PROJECT : 'website.box.mail@gmail.com',
    pass: ENV.MAIL_PASS ? ENV.MAIL_PASS : 'website.mail.password',
  },
})

const options = {
  fonts: {
    Roboto: 'https://fonts.googleapis.com/css?family=Roboto&display=swap',
  },
}

export default class Mailer {

  public static send(ctx: Context, type: string, data: DataMailType): Promise<ResFormatType> {
    return new Promise((res, rej) => {
      const { subject, html, success } = configMail[type](ctx, data)
      const htmlOutput = mjml2html(html, options)
      return transporter.sendMail({
        from: `My Custom Website <${ENV.MAIL_PROJECT ? ENV.MAIL_PROJECT : 'website.box.mail@gmail.com'}>`,
        to: `${data.email}`,
        subject,
        text: '',
        html: htmlOutput.html,
      }, (e) => {
        if (e) return rej({ code: 500, msg: trans(ctx, 'failure.mail.send'), err: e })
        return res({ code: 200, msg: success })
      })
    })
  }

}
