import {
    Controller,
    Get,
    Param,
} from '@nestjs/common';
import { URL_PATH } from 'src/core/setting';
import { CommentViewDto } from '../dto/view/comment.view.dto';
import { CommentQueryRepository } from '../infrastucture/query/comment.query.repository';

@Controller(URL_PATH.comments)
export class CommentController {
    constructor(
        private commentQueryRepository: CommentQueryRepository,
    ) {}

    @Get(':id')
    async getById(@Param('id') id: string):Promise<CommentViewDto>{
    // 
    // Returns comment by id
        
        const foundComment: CommentViewDto = await this.commentQueryRepository.findByIdWithCheck(id);
        return foundComment;
    }

}