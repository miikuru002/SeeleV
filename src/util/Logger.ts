import chalk from "chalk";
import moment from "moment";
import { ram } from "./misc";

/**
 * Clase que se encargar de mostrar por consola mensajes sobre la actividad del bot
 */
class Logger {
	private logHistory: string[]; //array para guardar los últimos 20 logs

	constructor() {
		this.logHistory = [];
	}

	/**
	 * Obtiene la fecha actual
	 * @returns La fecha en tipo string
	 */
	private getTimestamp(): string {
		return `[${moment().format("MM/DD/YYYY HH:mm:ss")}]`;
	}

	/**
	 * Guarda el mensaje en el historial
	 * @param log El mensaje
	 */
	private pushToLogHistory(log: string): void {
		if (this.logHistory.length > 25) { //si el array tiene + de 25 logs
			this.logHistory.shift(); //eliminar el 1er log de este
		}

		this.logHistory.push(log); //guarda un nuevo log
	}

	/**
	 * Obtiene el historial de logs
	 * @returns El historial
	 */
	public getLogHistory(): string[] {
		return this.logHistory;
	}

	/**
	 * Imprime y registra un mensaje de tipo "LOG"
	 * @param message El mensaje
	 */
	public log<T>(message: T): void {
		this.pushToLogHistory(`${this.getTimestamp()} LOG\t${message} -- [${ram} MB]`);
		console.log(`${this.getTimestamp()} ${chalk.bold("LOG")}\t${message}`);
	}

	/**
	 * Imprime y registra un mensaje de tipo "INFO"
	 * @param message El mensaje
	 */
	public info<T>(message: T): void {
		this.pushToLogHistory(`${this.getTimestamp()} INFO\t${message} -- [${ram} MB]`);
		console.log(`${this.getTimestamp()} ${chalk.bold.blue("INFO")}\t${chalk.blue(message)}`);
	}

	/**
	 * Imprime y registra un mensaje de tipo "WARNING"
	 * @param message El mensaje
	 */
	public warn<T>(message: T): void {
		this.pushToLogHistory(`${this.getTimestamp()} WARNING\t${message} -- [${ram} MB]`);
		console.log(`${this.getTimestamp()} ${chalk.bold.yellow("WARNING")}\t${chalk.yellow(message)}`);
	}

	/**
	 * Imprime y registra un mensaje de tipo "ERROR"
	 * @param message El mensaje
	 */
	public error<T>(message: T): void {
		this.pushToLogHistory(`${this.getTimestamp()} ERROR\t${message} -- [${ram} MB]`);
		console.log(`${this.getTimestamp()} ${chalk.bold.red("ERROR")}\t${chalk.red(message)}`);
	}

	/**
	 * Imprime y registra un mensaje de tipo "SUCCESS"
	 * @param message El mensaje
	 */
	public success<T>(message: T): void {
		this.pushToLogHistory(`${this.getTimestamp()} SUCCESS\t${message} -- [${ram} MB]`);
		console.log(`${this.getTimestamp()} ${chalk.bold.green("SUCCESS")}\t${chalk.green(message)}`);
	}
}

export default new Logger();
