import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument, CommentModelType } from '../../domain/comment.entity';
import { CommentViewDto } from '../../dto/view/comment.view.dto';
import { Rating } from '../../../../core/Rating.enum';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view.dto';
import { GetCommentQueryParams } from '../../dto/input/get.comment.query.params.input.dto';

@Injectable()
export class CommentQueryRepository {

    constructor(
        @InjectModel(Comment.name) private CommentModel: CommentModelType,
    ){}
    
    async  findByIdWithCheck(id: string, userId: string|null = null): Promise<CommentViewDto> {
        // returns a comment by id, if comment isn't found throws an exception

        if (!Types.ObjectId.isValid(id))
            throw new NotFoundException('comment not found');
        
        const searchItem: CommentDocument | null
            = await this.CommentModel.findOne({
                                                _id: new Types.ObjectId(id),
                                                deletedAt: null,
                                            });
        if(!searchItem)
            throw new NotFoundException('comment not found');

        let likeStatus: Rating = Rating.None
        if(userId){
        }
        return CommentViewDto.mapToView(searchItem, likeStatus);
    }

    async find(queryReq: GetCommentQueryParams, userId: string|null = null): Promise<PaginatedViewDto<CommentViewDto[]>> {

        const parentPostIdSearch = queryReq.searchParentPostId
            ? { name: { $regex: queryReq.searchParentPostId, $options: 'i' } }
            : {};
        const queryFilter: FilterQuery<Comment> = { ...parentPostIdSearch, deletedAt: null };
        const totalCount: number = await this.CommentModel.countDocuments(queryFilter);

        const comments: CommentDocument[] = await this.CommentModel.find(queryFilter)
            .limit(queryReq.pageSize)
            .skip((queryReq.pageNumber - 1) * queryReq.pageSize)
            .sort({ [queryReq.sortBy]: queryReq.sortDirection });

        let likeStatus: Rating
        if(!userId)
            likeStatus = Rating.None

        const items : CommentViewDto[]
            = comments.map(item  => CommentViewDto.mapToView(item, likeStatus));

        return PaginatedViewDto.mapToView({
            items: items,
            page: queryReq.pageNumber,
            size: queryReq.pageSize,
            totalCount: totalCount
        })
    }
}