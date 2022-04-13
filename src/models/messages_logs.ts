import { Schema, model } from "mongoose";
import { IMessagesLogs } from "../types";

const MessagesLogsSchema = new Schema<IMessagesLogs>({
	guildID: { type: String, required: true },
	channelID: { type: String, required: true },
});

export const MessagesLogs = model<IMessagesLogs>(
	"logs_messages",
	MessagesLogsSchema
);
