import { Schema, model } from "mongoose";
import { IBienvenidas } from "../types";

const BienvenidasSchema = new Schema<IBienvenidas>({
	guildID: { type: String, required: true },
	channelID: { type: String, required: true },
});

export const MessagesLogs = model<IBienvenidas>(
	"bienvenidas",
	BienvenidasSchema
);
