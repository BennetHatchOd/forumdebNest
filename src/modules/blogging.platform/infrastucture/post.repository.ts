import { Inject, Injectable } from '@nestjs/common';
import { Post } from '../domain/post.entity';
import { DATA_SOURCE } from '@core/constans/data.source';
import { DataSource } from 'typeorm';

@Injectable()
export class PostRepository {

    constructor(@Inject(DATA_SOURCE) private dataSource: DataSource) {}
    
    async findByIdWithoutBlog(id: string): Promise<Post | null> {
        const numericId = Number(id);
        if (!Number.isInteger(numericId) || numericId < 1) return null;

        const searchItem: Post[] = await this.dataSource.query(`
                    SELECT *
                    FROM public.posts
                    WHERE id = $1 AND "deletedAt" IS NULL 
                    LIMIT 1`,
            [numericId]
        );
        if (searchItem.length == 0)
            return null;

        const post: Post = Post.copyInstance(searchItem[0]);

        return post;
    }

    async savePost(savedItem: Post): Promise<void> {

        if(!savedItem.id){
            const result = await this.dataSource.query(`
                INSERT INTO public.posts(
                    title, "shortDescription", content, "blogId", "deletedAt")
                VALUES($1, $2, $3, $4, $5)
                RETURNING id, "createdAt";`,
                [   savedItem.title,
                    savedItem.shortDescription,
                    savedItem.content,
                    savedItem.blogId,
                    savedItem.deletedAt,
                ])
            savedItem.id = result[0].id;
            savedItem.createdAt = result[0].createdAt;
            return
        }

        await this.dataSource.query(`UPDATE public.posts
        SET
            title = $1,
            content = $2, 
            "shortDescription" = $3, 
            "deletedAt" = $4
        WHERE id = $5;`,
            [   savedItem.title,
                savedItem.content,
                savedItem.shortDescription,
                savedItem.deletedAt,
                savedItem.id
            ]);
        return ;
    }

}
