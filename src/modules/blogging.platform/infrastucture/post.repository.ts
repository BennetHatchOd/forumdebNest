import { Inject, Injectable } from '@nestjs/common';
import { Post} from '../domain/post.entity';
import { BaseRepository } from '@core/infrastucture/base.repository';
import { DATA_SOURCE } from '@core/constans/data.source';
import { DataSource } from 'typeorm';

@Injectable()
export class PostRepository extends BaseRepository{
    constructor(@Inject(DATA_SOURCE) protected dataSource: DataSource) {
        super(dataSource);
    }
    async findById(id: number): Promise<Post | null> {

        return this.findEntityById<Post>(id, 'posts', Post);
    }

    async save(savedItem: Post): Promise<void> {

        if(!savedItem.id){
            const result = await this.dataSource.query(`
                    INSERT INTO public.posts(
                                             title,                                         
                                             "shortDescription", 
                                             content, 
                                             "blogId" 
                                            )
                    VALUES($1, $2, $3, $4)
                RETURNING id;`,
                [   savedItem.title,
                    savedItem.shortDescription,
                    savedItem.content,
                    savedItem.blogId,

                ])
            savedItem.id = result[0].id;
            return ;
        }
        await this.dataSource.query(`
            UPDATE public.posts SET
            title= $1,
            "shortDescription"= $2,
            content = $3,
            "blogId" = $4,
            "deletedAt"= $5`,
            [   savedItem.title,
                savedItem.shortDescription,
                savedItem.content,
                savedItem.blogId,
                savedItem.deletedAt
            ]);
        return ;
    }

}
