import { Model, Schema } from 'mongoose'

export const Providers = {
  Economist: 'economist',
}
export const ArticleSchemaName = 'article'
export const ArticleSchema = new Schema(
  {
    provider: {
      type: String,
      required: true,
      index: true,
    },
    link: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      index: true,
    },
    body: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

export class ArticleModel extends Model {
  static async getList(page: number, size: number) {
    const reformattedPage = page === 0 ? 1 : page
    return this.find({})
      .sort({ _id: -1 })
      .skip((reformattedPage - 1) * size)
      .limit(size)
  }

  static async countAll(){
    return this.count()
  }
}

ArticleSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 })
ArticleSchema.loadClass(ArticleModel)
