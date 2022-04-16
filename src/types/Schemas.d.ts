/**
 * Tipado para crear los esquemas en MongoDB
 */
import { Document } from "mongoose";

export interface IBienvenidas extends Document {
	guildID: string;
	channelID: string;
	imageURL: string;
}
