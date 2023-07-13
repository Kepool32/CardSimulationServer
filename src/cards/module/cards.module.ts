import { Module } from '@nestjs/common';
import {CardsController} from "../controller/cards.controller";
import {CardsService} from "../service/card.service";
import {Card, CardSchema} from "../model/card.model";
import {MongooseModule} from "@nestjs/mongoose";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
    ],
    controllers: [CardsController],
    providers: [CardsService],
})
export class CardsModule {}
