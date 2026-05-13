import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../domain/comment.entity';
import { Types } from 'mongoose';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
import { Post } from '@modules/blogging.platform/domain/post.entity';
import { DATA_SOURCE } from '@core/constans/data.source';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentRepository {

    constructor(
        @Inject(DATA_SOURCE) private dataSource: DataSource,
    ) {}
    

    async getCommentById(id: string): Promise<Comment | null> {
        // We're looking for a clean comment,
        // working with one Comment table in the database.

        const numericId = Number(id);
        if (!Number.isInteger(numericId) || numericId < 1) return null;

        const searchItem: Comment[] = await this.dataSource.query(`
                    SELECT *
                    FROM public.comments
                    WHERE id = $1 AND "deletedAt" IS NULL 
                    LIMIT 1`,
            [numericId]
        );
        if (searchItem.length == 0)
            return null;

        return Comment.copyInstance(searchItem[0]);
    }

    async saveComment(saved: Comment): Promise<void> {

        if(!saved.id){
            const result = await this.dataSource.query(`
                INSERT INTO public.comments(
                    content, "postId", "userId", "deletedAt")
                VALUES($1, $2, $3, $4)
                RETURNING id, "createdAt";`,
                [   saved.content,
                    saved.postId,
                    saved.userId,
                    saved.deletedAt,
                ]);
            saved.id = result[0].id;
            saved.createdAt = result[0].createdAt;
            return;
        }

        await this.dataSource.query(`UPDATE public.comments
        SET
            content = $1,
            "deletedAt" = $2
        WHERE id = $5;`,
            [   saved.content,
                saved.deletedAt,
            ]);
        return;
    }
}
