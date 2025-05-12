import {
    Like,
    LikeDocument,
    LikeModelType,
} from '@modules/blogging.platform/domain/like.entity';
import { InjectModel } from '@nestjs/mongoose';
import { LikeCreateDto } from '@modules/blogging.platform/dto/create/like.create.dto';
import { Types } from 'mongoose';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';

export class LikeRepository {
    constructor(@InjectModel(Like.name) private LikeModel: LikeModelType) {}

    async findLikeDislike(
        searchDto: LikeCreateDto,
    ): Promise<LikeDocument | null> {
        const numberLikes: number = await this.LikeModel.countDocuments({
            targetId: new Types.ObjectId(searchDto.targetId),
            ownerId: new Types.ObjectId(searchDto.ownerId),
            targetType: searchDto.targetType,
        });
        if (numberLikes == 0) return null;
        if (numberLikes > 1)
            throw new DomainException({
                message: 'too many entries in the likes database',
                code: DomainExceptionCode.EmailNotExist,
            });

        return this.LikeModel.findOne({
            targetId: new Types.ObjectId(searchDto.targetId),
            ownerId: new Types.ObjectId(searchDto.ownerId),
            targetType: searchDto.targetType,
        });
    }

    async save(like: LikeDocument): Promise<void> {
        await like.save();
        return ;
    }
    // async hasArrayLikeDislikes<T extends LikeType>( model: Model<T>, entitiesId: Array<string>, userId: string){
    //     const answer = await model.find({ targetId: {$in: entitiesId.map(s => new ObjectId(s))}, ownerId: new ObjectId(userId), active: true}).select({_id: 0, targetId: 1, rating: 1}).lean().exec()
    //     if(answer.length == 0)
    //         return []
    //     return answer.map(s => {return {targetId: s.targetId!.toString(), rating: s.rating}})
    // }
    //
    // async getLastLikes(postId: string): Promise<Array<LastLikesViewType>>{
    //
    //     const lastLikes = await LikePostModel.find({targetId:   postId,
    //                                                 active:     true,
    //                                                 rating:     Rating.Like})
    //                                          .limit(3)
    //                                          .sort({createdAt: -1})
    //
    //     const users = await this.userRepository.getLoginsUsers(lastLikes.map(s => s.ownerId))
    //
    //     return lastLikes.map(s => { const user = users.find(el => el.userId === s.ownerId)
    //                                     return {
    //                                     addedAt:  s.createdAt.toString(),
    //                                     userId:   s.ownerId,
    //                                     login:    user!.login}
    //                                 })
    // }
    //
    // async getArrayLastLikes(postIds: string[]): Promise<Array<PostsLastLikesViewType>>{
    //
    //     const lastLikes = await LikePostModel.aggregate([
    //                                             {$match: {  active:     true,
    //                                                         rating:     Rating.Like,
    //                                                         targetId:   {$in: postIds}}},
    //                                             {$sort: {createdAt: -1}},
    //                                             {$group: {
    //                                                 _id: "$targetId",
    //                                                 likes: {$push: {addedAt: "$createdAt",
    //                                                                  userId: "$ownerId" }}
    //                                             }},
    //                                             {$project: {
    //                                                 targetId:   "$_id",
    //                                                 likes:      { $slice: ["$likes", 3]}
    //                                             }}
    //                                         ])
    //     const usersId: string[] = []
    //
    //     for(let targets of lastLikes){
    //         for(let likes of targets.likes){
    //             usersId.push(likes.userId)
    //         }
    //     }
    //
    //     const users: { userId: string;
    //                     login:  string }[] = await this.userRepository.getLoginsUsers(usersId)
    //     let fullLastLikes = []
    //
    //     for(let targets of lastLikes){
    //         let newLikes: LastLikesViewType[] = []
    //         for(let likes of targets.likes){
    //             const loginUser = users.find(el => likes.userId === el.userId)
    //             newLikes.push({
    //                             addedAt:    likes.addedAt.toString(),
    //                             userId:     likes.userId.toString(),
    //                             login:      loginUser!.login})
    //         }
    //         fullLastLikes.push({postId: targets.targetId as string, newestLikes: newLikes})
    //     }
    //
    //     if(fullLastLikes.length != postIds.length){
    //         const postWithLikes: string[] = fullLastLikes.map(s => s.postId)
    //         const emptyLikes: string[] = postIds.filter(s => !postWithLikes.includes(s))
    //         for(let post of emptyLikes)
    //             fullLastLikes.push({postId: post, newestLikes: []})
    //     }
    //
    //     return fullLastLikes
    // }
    //
    // async clear() {
    //     await LikeCommentModel.deleteMany()
    //     await LikePostModel.deleteMany()
    //
    //     if(await LikeCommentModel.countDocuments({}) == 0 && await LikePostModel.countDocuments({}) == 0)
    //         return
    //
    //     throw "the server can\'t clear blog"
    // }
    //
    //  // User likes and dislikes
    //
    // async stopLike<T extends LikeType>( model: Model<T>, entityId: string, userId: string){
    //     const count: number = await model.countDocuments({targetId: new ObjectId(entityId), ownerId: new ObjectId(userId), rating: Rating.Like})
    //     if(count > 1)
    //         throw new Error("Wrong likes in documents")
    //     if(count == 0)
    //         throw new Error("Like not found")
    //     const document: HydratedDocument<T> | null = await model.findOne({targetId: new ObjectId(entityId), ownerId: new ObjectId(userId), rating: Rating.Like})
    //     document!.active = false
    //     await document!.save()
    // }
    //
    // async stopDislike<T extends LikeType>( model: Model<T>, entityId: string, userId: string){
    //     const count: number = await model.countDocuments({targetId: new ObjectId(entityId), ownerId: new ObjectId(userId), rating: Rating.Dislike})
    //     if(count > 1)
    //         throw new Error("Wrong dislikes in documents")
    //     if(count == 0)
    //         throw new Error("Dislike not found")
    //
    //     const document: HydratedDocument<T> | null = await model.findOne({targetId: new ObjectId(entityId), ownerId: new ObjectId(userId), rating: Rating.Dislike})
    //
    //     document!.active = false
    //     await document!.save()
    // }
    //
    // async addDislike<T extends LikeType>( model: Model<T>, entityId: string, userId: string){
    //     const count: number = await model.countDocuments({targetId: new ObjectId(entityId), ownerId: new ObjectId(userId), rating: Rating.Dislike})
    //     if(count > 1)
    //         throw new Error("Wrong dislikes in documents")
    //     if(count == 0){
    //         await model.create({
    //             active:     true,
    //             createdAt:  new Date(),
    //             targetId:   entityId,
    //             ownerId:    userId,
    //             rating:     Rating.Dislike})
    //         return
    //     }
    //
    //     let document: HydratedDocument<T> | null = await model.findOne({targetId: new ObjectId(entityId), ownerId: new ObjectId(userId), rating: Rating.Dislike})
    //         document!.active = true
    //         await document!.save()
    // }
    //
    // async addLike<T extends LikeType>( model: Model<T>, entityId: string, userId: string){
    //     const count: number = await model.countDocuments({targetId: new ObjectId(entityId), ownerId: new ObjectId(userId), rating: Rating.Like})
    //     if(count > 1)
    //         throw new Error("Wrong likes in documents")
    //     if(count == 0){
    //         await model.create({
    //             active:     true,
    //             createdAt:  new Date(),
    //             targetId:   entityId,
    //             ownerId:    userId,
    //             rating:     Rating.Like})
    //         return
    //     }
    //
    //     let document: HydratedDocument<T> | null = await model.findOne({targetId: new ObjectId(entityId), ownerId: new ObjectId(userId), rating: Rating.Like})
    //         document!.active = true
    //         await document!.save()
    // }
    //
    // // Entity likes and dilikes
    //
    // async decrementLike<T extends Likeable>( model: Model<T>, id: string): Promise<void> {
    //     const document: HydratedDocument<T> | null = await model.findOne({ _id: new ObjectId(id)});
    //
    //     if (!document) {
    //       throw new Error("Document not found");
    //     }
    //     document.likesInfo.likesCount--
    //     await document.save()
    // }
    //
    // async decrementDislike<T extends Likeable>( model: Model<T>, id: string): Promise<void> {
    //     const document: HydratedDocument<T> | null = await model.findOne({ _id: new ObjectId(id)});
    //
    //     if (!document) {
    //       throw new Error("Document not found");
    //     }
    //     document.likesInfo.dislikesCount--
    //     await document.save()
    // }
    //
    // async incrementLike<T extends Likeable>( model: Model<T>, id: string): Promise<void> {
    //     const document: HydratedDocument<T> | null = await model.findOne({ _id: new ObjectId(id)});
    //
    //     if (!document) {
    //       throw new Error("Document not found");
    //     }
    //     document.likesInfo.likesCount++
    //     await document.save()
    // }
    //
    // async incrementDisLike<T extends Likeable>( model: Model<T>, id: string): Promise<void> {
    //
    //     //await model.updateOne({ _id: new ObjectId(id)}, {$inc : {"likesInfo.likes": 1}})
    //
    //     const document: HydratedDocument<T> | null = await model.findOne({ _id: new ObjectId(id)});
    //
    //     if (!document) {
    //       throw new Error("Document not found");
    //     }
    //     document.likesInfo.dislikesCount++
    //     await document.save()
    // }
}
