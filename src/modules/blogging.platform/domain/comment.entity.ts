import { CreateCommentDto } from '../dto/create/create.comment.dto';

export class Comment {
    id?: number;
    content: string;
    postId: number; // post id for which the comment was written
    createdAt: Date;
    userId: number; // user id who wrote the comment
    deletedAt:  Date | null;

    delete() {
        if (this.deletedAt !== null) {
            throw new Error('Comment already deleted');
        }
        this.deletedAt = new Date();
    }

    async update(change: string): Promise<void> {
        this.content = change;
    }

    static createInstance(createDto: CreateCommentDto): Comment {

        const comment = new this();
        comment.content = createDto.content;
        comment.postId = createDto.postId;
        comment.userId = createDto.userId;
        comment.deletedAt = null;

        return comment;
    }
}
