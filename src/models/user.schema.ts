import {Model, Schema} from 'mongoose'

export const UserSchemaName = 'user'
export const UserSchema = new Schema(
  {
    email: {
      type: String,
      index: true,
    },
    password: {
      type: String,
      required: true
    },
  },
  {
    timestamps: true,
  },
)

export class UserModel extends Model {
  static async createNewUser(body) {
    return this.create(body)
  }
}

UserSchema.loadClass(UserModel)
