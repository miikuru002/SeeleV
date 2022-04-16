import { Schema, model } from "mongoose";
import { IBienvenidas } from "../types";

const BienvenidasSchema = new Schema<IBienvenidas>({
	guildID: { type: String, required: true },
	channelID: { type: String, required: true },
	imageURL: {type: String, default: "https://media.discordapp.net/attachments/760205312396492810/964010335193432086/seele_vollerei_honkai_and_1_more_drawn_by_qingxiao_kiyokiyo__01d108d0579170ce1d6948ba81480642.jpg?width=671&height=671"}
});

export const Bienvenidas = model<IBienvenidas>(
	"bienvenidas",
	BienvenidasSchema
);
