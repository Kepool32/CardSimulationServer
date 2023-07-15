import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { Card } from '../model/card.model';



@Injectable()
export class CardsService {
    constructor(
        @InjectModel(Card.name) private cardModel: Model<Card>,
    ) {}

    async create(card: Card): Promise<Card> {

        const createdCard = new this.cardModel(card);
        await createdCard.save();
        return createdCard.toObject();
    }

    async findAll(): Promise<Card[]> {
        const cards = await this.cardModel.find().exec();
        return cards.map((card) => card.toObject());
    }

    async findOne(id: string): Promise<Card | null> {
        const card = await this.cardModel.findById(id).exec();
        return card ? card.toObject() as Card : null;
    }

    async update(id: string, card: Card): Promise<Card | null> {
        const updatedCard = await this.cardModel.findByIdAndUpdate(
            id,
            card,
            { new: true }
        ).exec();
        return updatedCard ? updatedCard.toObject() as Card : null;
    }

    async remove(id: string): Promise<Card | null> {
        const deletedCard = await this.cardModel.findByIdAndRemove(id).exec();
        return deletedCard ? deletedCard.toObject() as Card : null;
    }

    async findOneByEmail(email: string): Promise<Card | null> {
        const card = await this.cardModel.findOne({ email }).exec();
        return card ? card.toObject() as Card : null;
    }


    async findAllByEmail(email: string): Promise<Card[]> {
        return this.cardModel.find({ email }).exec();
    }
}
