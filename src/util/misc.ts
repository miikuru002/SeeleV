import trans from "@vitalets/google-translate-api";
import Logger from "./Logger";
import humanizeDuration from "humanize-duration";
import { createCanvas, loadImage } from "canvas";
import { GuildMember } from "discord.js";

/**
 * Obtiene la cantidad de memoria usada
 */
export const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

/**
 * Obtiene la fecha y hora a partir de la zona horaria
 * @param timezone La zona horaria
 * @returns La fecha y hora de esa zona h.
 * @source https://stackoverflow.com/questions/10087819/convert-date-to-another-timezone-in-javascript
 */
export const getTimeFromTimezone = (timezone: number): string => {
	const d = new Date(); //crea un objeto de tipo Date para para la ubicación actual

	// convert to msec
	// subtract local time zone offset
	// get UTC time in msec
	const utc = d.getTime() + d.getTimezoneOffset() * 60000;

	// create new Date object for different city
	// using supplied offset
	const nd = new Date(utc + 3600000 * timezone);

	return nd.toLocaleString(); //retorna la fecha y hora como string
};

/**
 * Valida si la URL brindada corresponde a una imagen
 * @param url La URL a evaluar
 * @returns Si es válido o no
 * @source https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
 */
export const isImage = (url: string): boolean => {
	const expr = /(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|gif|png|webp))/;
	const regex = new RegExp(expr);

	if (url.match(regex)) {
		return true;
	}

	return false;
};

/**
 * Traduce un texto de cualquier idioma hacia otro
 * @param message El mensaje a traducir
 * @param lang El idioma al que se quiere traducir
 * @returns Mensaje traducido
 */
export const translate = async (message: string, lang: string) => {
	try {
		const res = await trans(message, { to: lang });
		return res.text;

	} catch (error) {
		Logger.error(error);
	}
};

/**
 * Obtiene el tiempo AFK transcurrido en un formato legible
 * @param time Momento en el que el usuario usó el comando AFK
 * @returns El tiempo que estuvo AFK
 */
export const getElapsedTime = (time: number): string => {
	//al tiempo actual (en ms) se le resta el momento donde el usuario establece su estado AFK
	const elapsed_time = humanizeDuration(Date.now() - time, {
		language: "es",
		maxDecimalPoints: 1,
		largest: 2,
		conjunction: " y ",
		serialComma: false,
	});

	return elapsed_time;
};

/**
 * Crea el mensaje falso con Canvas
 * @param member El usuario que aparecerá en la imagen
 * @param message El mensaje que dirá el usuario
 * @returns La imagen creada
 * @source https://portalmybot.com/code/lXIDb012Wj
 */
export const getCanvasFakeMessage = async (member: GuildMember, message: string) => {
	const canvas = createCanvas(400, 69);
	const ctx = canvas.getContext("2d");

	//fondo
	ctx.fillStyle = "#363940";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//circulo para cortar el avatar
	const x = 11,
		y = 13,
		radius = 20;
	ctx.save();
	ctx.beginPath();
	ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();

	//Avatar
	const url = member.displayAvatarURL({
		format: "png",
		dynamic: false,
		size: 1024,
	});
	const image = await loadImage(url);
	ctx.drawImage(image, x, y, radius * 2, radius * 2);
	ctx.restore();

	//nickname
	ctx.lineWidth = 0.3;
	ctx.font = "14px sans-serif";
	ctx.fillStyle = member.displayHexColor || "#ffff";
	ctx.strokeStyle = member.displayHexColor || "#ffff";
	ctx.strokeText(member.nickname || member.user.username, 66, 27);
	ctx.fillText(member.nickname || member.user.username, 66, 27);

	//hora del mensaje (aleatorio)
	const largo = ctx.measureText(member.nickname || member.user.username).width;
	ctx.font = "11.2px sans-serif";
	ctx.fillStyle = "#72767d";

	let hour: number | string = Math.floor(Math.random() * 12);
	let min: number | string = Math.floor(Math.random() * 60);
	const t = ["AM", "PM"];
	const tt = t[Math.floor(Math.random() * t.length)];

	hour = (hour < 10 ? "0" : "") + hour;
	min = (min < 10 ? "0" : "") + min;

	ctx.fillText(`Hoy a las ${hour}:${min} ${tt}`, 66 + largo + 8, 27);

	//Mensaje
	ctx.lineWidth = 0.1;
	ctx.font = "14.5px sans-serif";
	ctx.fillStyle = "#dcddde";
	ctx.strokeStyle = "#dcddde";
	const w =
		ctx.measureText(message).width - Math.floor(ctx.measureText(message).width * 0.08);
	ctx.strokeText(message, 66, 50, w);
	ctx.fillText(message, 66, 50, w);

	return canvas.toBuffer();
};
