import KOA from 'koa'
import Server from './server'
import config from './config/parameters'

process.on('unhandledRejection', e => console.error(e))
process.on('uncaughtException', e => console.error(e.stack || e))

class Services {

  public static server = (): KOA => {
    const server = new Server(config)
    return server.initiate().listen()
  }

}

export default Services.server()
