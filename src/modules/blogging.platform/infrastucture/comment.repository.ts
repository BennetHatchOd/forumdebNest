 import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from '../domain/comment.entity';
import { Types } from 'mongoose';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';
 import { DATA_SOURCE } from '@core/constans/data.source';
 import { DataSource } from 'typeorm';
 import { BaseRepository } from '@core/infrastucture/base.repository';
 import { Blog } from '@modules/blogging.platform/domain/blog.entity';

@Injectable()
export class CommentRepository extends BaseRepository{

    constructor(@Inject(DATA_SOURCE) protected dataSource: DataSource) {
        super(dataSource);
    }

    async findById(id: number): Promise<Comment | null> {

        return this.findEntityById<Comment>(id, 'comments', Comment);
    }


    async save(changedItem: Comment): Promise<void> {

        if(!changedItem.id){
            const result =await this.dataSource.query(`
            INSERT INTO public.comments(
                    content, "postId", "userId")
            VALUES ($1, $2, $3)
            RETURNING id;`,
            [ changedItem.content,
              changedItem.postId,
              changedItem.userId,
            ])
            changedItem.id = result[0].id;
            return ;
        }

        await this.dataSource.query(`
        UPDATE public.blogs
        SET
            content= $1,
            "postId"= $2,
            "userId" = $3,
            "deletedAt"= $5`,
        [ changedItem.content,
          changedItem.postId,
          changedItem.userId,
          changedItem.deletedAt,
        ]);
        return ;




    }
}
