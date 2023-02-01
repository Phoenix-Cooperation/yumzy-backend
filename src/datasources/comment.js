import { DataSource } from "apollo-datasource";
import console from "consola";

const { success, error } = console;

class CommentAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  async addComment(comment, contentId) {
    console.log(comment)
    console.log(this.context?.user)
    if (!this.context?.user) {
      error({badge: true, message: 'User not logged in'})
      throw new Error('Error! User is not logged in');
    }

    const { user_id } = this.context.user;

    try {
      const Comment = new this.store.Comment({comment, contentId});
      console.log(Comment.comment)
      Comment.contentId = contentId;
      Comment.user_id = user_id
      await Comment.save();
      return { message: "success" }
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }

  async getComments(contentId) {
    try {
      const data = await this.store.ContentDetail.findOne({
        where: { contentId },
        include: { 
          association: 'comments',
          include: 'user'
        }
      })
      const comments = data.comments.map((tempComment) => {
        const { user: { dataValues : userInfo }, ...vals } = tempComment.dataValues
        return { ...vals, user: userInfo }
      })

      console.log(comments)

      return comments
    } catch (err) {
      error({ badge: true, message: err.message })
      throw new Error(err.message)
    }
  }
}

export default CommentAPI;