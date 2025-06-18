import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsBlogIdConstraint } from '@core/decorators/is.blog.id.constraint';

export function IsBlogId(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsBlogId',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsBlogIdConstraint,
        });
    };
}
