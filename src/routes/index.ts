import ROUTER from 'koa-joi-router'
import UserRoutes from './user/_user'

const router = ROUTER()

export default class Router {

  public static _publicRouter = router.route([
    ...UserRoutes.publicRoutes,
  ])

  public static _privateRouter = router.route([
    ...UserRoutes.privateRoutes,
  ])

}
