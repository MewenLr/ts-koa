import KOA from 'koa'
import CORS from 'koa-cors'
import HELMET from 'koa-helmet'
import BODYPARSER from 'koa-bodyparser'
import Db from './db'
import Router from './routes/index'
import I18n from './middlewares/i18n'
import { ConfigServerType } from './contracts/types'

export default class Server {

  protected app: KOA
  protected port: number
  protected mongoUri: string
  protected jwtSecret: string

  constructor(configServer: ConfigServerType) {
    this.app = new KOA()
    this.port = configServer.port
    this.mongoUri = configServer.mongoUri
    this.jwtSecret = configServer.jwtSecret
  }

  protected router(): Server {
    this.app.use(Router._publicRouter.middleware())
    this.app.use(Router._privateRouter.middleware())
    return this
  }

  protected middleware(): Server {
    this.app.use(BODYPARSER())
    this.app.use(HELMET())
    this.app.use(CORS())
    I18n.init(this.app)
    return this
  }

  public initiate(): Server {
    Db.connect(this.mongoUri)
    this.middleware()
    this.router()
    return this
  }

  public listen(): KOA {
    this.app.listen(this.port)
    console.info(`\nServer is listening on port ${this.port}\n`)
    return this.app
  }

}
