/**
 * Tipado para crear los esquemas en MongoDB
 */
import { Document } from "mongoose";

export interface IMessagesLogs extends Document {
	guildID: string;
	channelID: string;
}
