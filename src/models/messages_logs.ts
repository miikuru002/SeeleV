import { Schema, Model, model } from "mongoose";
import { IMessagesLogs } from "../types";

const MessagesLogsSchema: Schema<IMessagesLogs> = new Schema({
	guildID: { type: String },
	channelID: { type: String },
});

export const Leaves: Model<IMessagesLogs> = model(
	"logs_messages",
	MessagesLogsSchema
);
