import MONGOOSE from 'mongoose'

export default class Db {

  public static connect = async (mongoUri: string): Promise<void> => {
    try {
      await MONGOOSE.connect(mongoUri, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      })
      console.info('\nConnected to MongoDB\n')
    } catch (e) {
      console.error(`\nMongoDB connection error. ${e}\n`)
      process.exit(1)
    }
  }

}
