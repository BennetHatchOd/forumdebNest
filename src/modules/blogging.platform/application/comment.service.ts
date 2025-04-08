import { Injectable } from '@nestjs/common';
import { CommentRepository } from '../infrastucture/comment.repository';

@Injectable()
export class CommentService {
    constructor(
        private commentRepository: CommentRepository,
    ) {}

}
