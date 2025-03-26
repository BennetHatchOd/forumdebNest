import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogRepository } from '../infrastucture/blog.repository';
import { Blog, BlogDocument, BlogModelType } from '../domain/blog.entity';
import { InjectModel } from '@nestjs/mongoose';
import { BlogInputDto } from '../dto/input/blog.input.dto';

@Injectable()
export class BlogService {
    constructor(
        private blogRepository: BlogRepository,
        @InjectModel(Blog.name) private BlogModel: BlogModelType,
    ) {}

    async create(inputItem: BlogInputDto): Promise<string> {
        const newBlog: BlogDocument = this.BlogModel.createInstance(inputItem);
        await this.blogRepository.save(newBlog);
        return newBlog._id.toString();
    }

    async edit(id: string, editData: BlogInputDto): Promise<void> {

        const blog: BlogDocument | null = await this.blogRepository.findById(id);

        if (!blog)
            throw new NotFoundException(`blog with ${id} not found`);
        blog.update(editData);
        this.blogRepository.save(blog);
        return;
    }

    async delete(id: string): Promise<void> {
        const blog: BlogDocument | null = await this.blogRepository.findById(id);

        if (!blog)
            throw new NotFoundException(`blog with id-${id} not found`);
        blog.delete();
        this.blogRepository.save(blog);
        return;

    }

    async clear(): Promise<void> {
        await this.blogRepository.clear();
    }
}
