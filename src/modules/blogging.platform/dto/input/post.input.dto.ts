import { PostByBlogInputDto } from './post.by.blog.input.dto';
import { IsBlogId } from '@core/decorators/is.blog.id';

export class PostInputDto extends PostByBlogInputDto{
    @IsBlogId()
    public blogId: string;
    }