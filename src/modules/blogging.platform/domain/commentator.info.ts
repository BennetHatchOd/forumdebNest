import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({id: false,
    })
export class CommentatorInfo {
    @Prop({ required: true, })
    userId: string;

    @Prop({ required: true, })
    userLogin: string;
}

export const CommentatorInfoSchema = SchemaFactory.createForClass(CommentatorInfo);

CommentatorInfoSchema.loadClass(CommentatorInfo);
