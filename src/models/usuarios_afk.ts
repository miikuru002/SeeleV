import { Schema, model } from "mongoose";
import { IAfk } from "../types";

const AfkSchema = new Schema<IAfk>({
	userID: {
		type: String,
		required: true,
	},
	reason: {
		type: String,
		required: true,
	},
	time: {
		//tiempo que está AFK (en ms)
		type: Number,
		required: true,
	},
});

export const AFK = model<IAfk>("usuarios_afk", AfkSchema);
