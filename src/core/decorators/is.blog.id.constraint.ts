// is-blog-id.constraint.ts
import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogRepository } from '@modules/blogging.platform/infrastucture/blog.repository';
import { convertToId } from '@core/infrastucture/convert.to.id';

@ValidatorConstraint({ name: 'IsBlogId', async: true })
@Injectable()
export class IsBlogIdConstraint implements ValidatorConstraintInterface {
    constructor(private readonly blogRepository: BlogRepository) {}

    async validate(blogId: string, _args: ValidationArguments): Promise<boolean> {
        const numericId = convertToId(blogId);
        if (!numericId) return false;

        const exists = await this.blogRepository.findById(numericId);
        return !!exists;
    }

    defaultMessage(args: ValidationArguments): string {
        return `Blog with id=${args.value} not found`;
    }
}
