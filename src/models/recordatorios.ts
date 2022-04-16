import { Schema, model } from "mongoose";
import { IRecordatorios } from "../types";

const RecordatoriosSchema = new Schema<IRecordatorios>({
	channelID: { type: String, required: true },
	userID: { type: String, required: true },
	message: { type: String, required: true },
	time: { type: Number, required: true },
});

export const Recordatorios = model<IRecordatorios>(
	"recordatorios",
	RecordatoriosSchema
);
