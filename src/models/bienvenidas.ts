import { Schema, model } from "mongoose";
import { IBienvenidas } from "../types";

const BienvenidasSchema = new Schema<IBienvenidas>({
	guildID: { type: String, required: true },
	channelID: { type: String, required: true },
	imageURL: {type: String }
});

export const Bienvenidas = model<IBienvenidas>(
	"bienvenidas",
	BienvenidasSchema
);
