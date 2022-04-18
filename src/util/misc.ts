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
