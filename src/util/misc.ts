import { exec } from "child_process";
import Logger from "./Logger";

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
 * Obtiene el branch actual que ejecuta el bot
 * @returns El branch
 * @source https://stackoverflow.com/questions/62225567/get-current-git-branch-with-node-js
 */
export const getBranch = () =>
	new Promise((resolve, reject) => {
		exec("git branch --show-current", (err, stdout, stderr) => {
			if (err) {
				Logger.error(`getBranch Error: ${err}`);
				reject(`getBranch Error: ${err}`);
			}

			if (typeof stdout === "string") {
				resolve(stdout);
			}
		});
	});