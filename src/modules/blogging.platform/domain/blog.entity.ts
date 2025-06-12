import { BlogInputDto } from '../dto/input/blog.input.dto';
import { BlogEditDto } from '@modules/blogging.platform/dto/edit/blog.edit.dto';

export class Blog {
    id?: number;
    name: string;
    description: string;
    createdAt: Date;
    isMembership: boolean;
    websiteUrl: string;
    deletedAt:  Date | null;

    delete() {
        if (this.deletedAt !== null) {
            throw new Error('Blog already deleted');
        }
        this.deletedAt = new Date();
    }

    update(change: BlogEditDto) {
        this.name = change.name;
        this.description = change.description;
        this.websiteUrl = change.websiteUrl;
    }


    static createInstance(dto: BlogInputDto): Blog {
        const blog = new this();
        blog.name = dto.name;
        blog.description = dto.description;
        blog.websiteUrl = dto.websiteUrl;
        blog.isMembership = true;
        blog.deletedAt = null;
        blog.createdAt = new Date();

        return blog;
      }
}