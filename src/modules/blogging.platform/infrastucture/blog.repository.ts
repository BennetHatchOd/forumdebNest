import { Inject, Injectable } from '@nestjs/common';
import { Blog } from '../domain/blog.entity';
import { DATA_SOURCE } from '@core/constans/data.source';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@core/infrastucture/base.repository';
import console from 'node:console';

@Injectable()
export class BlogRepository extends BaseRepository{
    constructor(@Inject(DATA_SOURCE) protected dataSource: DataSource) {
        super(dataSource);
    }

    async findById(id: number): Promise<Blog | null> {

        return this.findEntityById<Blog>(id, 'blogs', Blog);
    }

    async save(savedItem: Blog): Promise<void> {

        if(!savedItem.id){

             const result = await this.dataSource.query(`
                    INSERT INTO public."blogs"(
                        name, description, "isMembership", "websiteUrl")
                    VALUES($1, $2, $3, $4)
                RETURNING id;`,
                [   savedItem.name,
                    savedItem.description,
                    savedItem.isMembership,
                    savedItem.websiteUrl,
                ])
            savedItem.id = result[0].id;
            return ;
        }
        await this.dataSource.query(`
            UPDATE public.blogs
            SET
                name= $1,
                description= $2,
                "isMembership" = $3,
                "websiteUrl" = $4,
                "deletedAt"= $5`,
            [
                savedItem.name,
                savedItem.description,
                savedItem.isMembership,
                savedItem.websiteUrl,
                savedItem.deletedAt
            ]);
        return ;
    }
}
