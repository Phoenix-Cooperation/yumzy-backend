import {ErrorResponse} from "../../util/errorHandler/errorResponse.js";
import {PubSub} from "graphql-subscriptions";
import console from 'consola';
const {error, success} = console;
const pubsub = new PubSub();

export default {
    Query: {
        getContent: async (_, {pageSize = 20, after = 0}, {dataSources}) => {
            try {
                let {content, hasMore} = await dataSources.ContentAPI.getContent({pageSize, after})

                content = await Promise.all(content.map(async (data) => {
                    const {user: {user_id}, user, ...val} = data
                    const photoURL = await dataSources.UserAPI.getUserPhotoURL(user_id);
                    return {...val, user: {...user, photoURL}}
                }))

                return {content, hasMore}
            } catch (error) {
                throw new ErrorResponse({message: `Cannot get content: ${error.message}`})
            }
        },
        getRecipeById: async (_, {id}, {dataSources}) => {
            const recipe = await dataSources.ContentAPI.getSingleRecipeById(id);
            let comments = await dataSources.CommentAPI.getComments(recipe.id);

            comments = await Promise.all(comments.map(async (comment) => {
                const {user: {user_id}, user, ...vals} = comment;
                const photoURL = await dataSources.UserAPI.getUserPhotoURL(user_id);
                return {...vals, user: {...user, photoURL}}
            }))


            return {...recipe, comments}
        },
        getPostById: async (_, {id}, {dataSources}) => {
            const post = await dataSources.ContentAPI.getSinglePostById(id);
            let comments = await dataSources.CommentAPI.getComments(recipe.id);

            comments = await Promise.all(comments.map(async (comment) => {
                const {user: {user_id}, user, ...vals} = comment;
                const photoURL = await dataSources.UserAPI.getUserPhotoURL(user_id);
                return {...vals, user: {...user, photoURL}}
            }))

            return {...post, comments};
        },
        getTipsById: async (_, {id}, {dataSources}) => {
            const tips = await dataSources.ContentAPI.getSingleTipsById(id);
            let comments = await dataSources.CommentAPI.getComments(recipe.id);

            comments = await Promise.all(comments.map(async (comment) => {
                const {user: {user_id}, user, ...vals} = comment;
                const photoURL = await dataSources.UserAPI.getUserPhotoURL(user_id);
                return {...vals, user: {...user, photoURL}}
            }))

            return {...tips, comments};
        },

        getContentSavedByUserId: async (_, {id}, {dataSources}) => {
            return await dataSources.ContentAPI.getContentSavedByUserId();
        },
    },
    Mutation: {
        createRecipe: async (_, {recipeInput}, {dataSources}) => {
            try {
                const recipe = await dataSources.ContentAPI.createRecipe(recipeInput)
                return recipe;
            } catch (error) {
                throw new ErrorResponse({message: `Cannot create recipe: ${error.message}`})
            }

        },
        createTips: async (_, {tipsInput}, {dataSources}) => {
            try {
                const tips = await dataSources.ContentAPI.createTips(tipsInput)
                return tips;
            } catch (error) {
                throw new ErrorResponse({message: `Cannot create tips: ${error.message}`})
            }
        },

        createPost: async (_, {postInput}, {dataSources}) => {
            try {
                const post = await dataSources.ContentAPI.createPost(postInput)
                const notifyData = ({
                    contentId: post.id,
                    user_id: post.user_id,
                    message: 'POST_CREATED',
                    status: 'U',
                });
                const {id, contentID, user_id, message, status} = await dataSources.NotificationAPI.createNotification(notifyData);
                await pubsub.publish('POST_CREATED', {
                    contentCreateSubscription: {
                        id: id,
                        contentId: contentID,
                        message: message,
                        status: status
                    }
                });
                success({badge: true, message: "Notification created!"});
                return post;
            } catch (error) {
                throw new ErrorResponse({message: `Cannot create post: ${error.message}`})
            }
        },

        reactToContent: async (_, {contentId}, {dataSources}) => {
            const message = await dataSources.ContentAPI.reactToContent(contentId);
            return message;
        },

        unReactToContent: async (_, {contentId}, {dataSources}) => {
            const message = await dataSources.ContentAPI.unReactToContent(contentId);
            return message;
        },

        contentSaved: async (_, {savedInput}, {dataSources}) => {
            try {
                return await dataSources.ContentAPI.contentSaved(savedInput);
            } catch (error) {
                throw new ErrorResponse({message: `Cannot save Content: ${error.message}`})
            }
        },

        deleteSavedContent: async (_, {contentId}, {dataSources}) => {
            try {
                return await dataSources.ContentAPI.deleteSavedContent(contentId);
            } catch (error) {
                throw new ErrorResponse({message: `Cannot save Content: ${error.message}`})
            }
        },
    }
}