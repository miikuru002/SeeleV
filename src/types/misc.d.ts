import { Message, PartialMessage } from "discord.js";

export interface ILocation {
	name: string;
	lat: string;
	long: string;
	timezone: string;
	alert: string;
	degreetype: string;
	imagerelativeurl: string;
}

export interface IClima {
	location: ILocation;
	current: { [key: string]: string };
}

export interface ISnipe {
	message: Message | PartialMessage;
	image?: string;
	time: number;
}
