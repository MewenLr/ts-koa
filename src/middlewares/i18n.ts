import KOA from 'koa'
import i18n from 'koa-i18n'
import locale from 'koa-locale'

export default class I18n {

  public static init(app: KOA): KOA {
    locale(app)
    return app.use(i18n(app, {
      directory: './src/config/translations',
      locales: ['en', 'fr'],
      defaultLocale: 'en',
      extension: '.json',
      filePermissions: '755',
      updateFiles: false,
    }))
  }

}
