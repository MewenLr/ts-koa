import { Document } from 'mongoose'

/**
 * @param email - The user email
 * @param username - The username
 * @param password - The user password
*/

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  confirmed?: boolean;
}
