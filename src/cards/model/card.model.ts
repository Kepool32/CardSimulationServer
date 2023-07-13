import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Card extends Document {
    @Prop({ required: true })
    cardNumber: string;

    @Prop({ required: true })
    cvc: string;

    @Prop({ required: true })
    cardHolder: string;

    @Prop()
    cardType: string;

    @Prop({ required: true })
    expirationDate: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ default: false })
    isConfirmed: boolean;

    @Prop()
    confirmationCode: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);