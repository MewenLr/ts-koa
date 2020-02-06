import { Schema, model } from 'mongoose'
import { IUser } from '../contracts/interfaces'

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    unique: true,
  },

  username: {
    type: String,
    unique: true,
  },

  password: {
    type: String,
  },

  confirmed: {
    type: Boolean,
    default: false,
  },

  expireAt: {
    type: Date,
    index: { expires: '1d' },
  },
})

export default model<IUser>('User', UserSchema)
