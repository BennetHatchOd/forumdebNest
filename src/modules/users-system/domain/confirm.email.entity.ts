import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class ConfirmEmail {
    @Prop({ })
    code: string;

    @Prop({
        type: Date,
    })
    expirationTime: Date;
}

export const ConfirmEmailSchema = SchemaFactory.createForClass(ConfirmEmail);

//регистрирует методы сущности в схеме
ConfirmEmailSchema.loadClass(ConfirmEmail);