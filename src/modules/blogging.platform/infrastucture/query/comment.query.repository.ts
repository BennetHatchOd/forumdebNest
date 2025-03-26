import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument, CommentModelType } from '../../domain/comment.entity';
import { CommentViewDto } from '../../dto/view/comment.view.dto';

@Injectable()
export class CommentQueryRepository {

    constructor(
        @InjectModel(Comment.name) private CommentModel: CommentModelType,
    ){}
    
    async  findById(id: string): Promise<CommentViewDto> {
        if (!Types.ObjectId.isValid(id)) 
            throw new NotFoundException('comment not found');
        
        const searchItem: CommentDocument | null
            = await this.CommentModel.findOne({
                                                _id: new Types.ObjectId(id),
                                                deletedAt: null,
                                            });
        if(searchItem)
            return CommentViewDto.mapToView(searchItem);
        throw new NotFoundException('comment not found');
    }
}