import {
    Controller,
    Get,
    Param,
} from '@nestjs/common';
import { CommentViewDto } from '../dto/view/comment.view.dto';
import { CommentQueryRepository } from '../infrastucture/query/comment.query.repository';
import { URL_PATH } from '../../../core/url.path.setting';
import { IdInputDto } from '../../../core/dto/input/id.Input.Dto';

@Controller(URL_PATH.comments)
export class CommentController {
    constructor(
        private commentQueryRepository: CommentQueryRepository,
    ) {}

    @Get(':id')
    async getById(@Param('id') inputId: IdInputDto):Promise<CommentViewDto>{
    // 
    // Returns comment by id
        
        const foundComment: CommentViewDto = await this.commentQueryRepository.findByIdWithCheck(inputId.id);
        return foundComment;
    }

}