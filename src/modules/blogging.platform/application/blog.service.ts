import { Injectable } from '@nestjs/common';
import { BlogRepository } from '../infrastucture/blog.repository';
import { Blog } from '../domain/blog.entity';
import { BlogInputDto } from '../dto/input/blog.input.dto';
import { DomainException } from '@core/exceptions/domain.exception';
import { DomainExceptionCode } from '@core/exceptions/domain.exception.code';

@Injectable()
export class BlogService {
    constructor(
        private blogRepository: BlogRepository,
    ) {}

     async delete(id: string): Promise<void> {
        const blog: Blog | null = await this.blogRepository.findById(id);

        if (!blog)
            throw new DomainException({
                message: 'blog with id-${id} not found',
                code: DomainExceptionCode.NotFound});
        blog.delete();
        this.blogRepository.saveBlog(blog);
        return;
    }
}
