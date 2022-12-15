import { Command } from "../../structures";
import { ApplicationCommandOptionType } from "discord.js";
import {
	avatar,
	calculadora,
	clima,
	elegir,
	emoji,
	ping,
	random,
	recodatorio,
	serverIcon,
} from "./subcommands";

export default new Command({
	definition: {
		name: "util",
		description: "💡 Colección de diversos subcomandos útiles ",
		options: [
			{
				name: "avatar",
				description: "Muestro la foto de perfil de un usuario",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "usuario",
						description: "El usuario del cual quieres ver su avatar",
						type: ApplicationCommandOptionType.User,
					},
				],
			},
			{
				name: "calculadora",
				description: "Calculo la expresión matemática que me indiques",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "expresión",
						description: "La expresión matemática que quieres calcular",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
				],
			},
			{
				name: "clima",
				description: "Muestro el clima actual de una ciudad del mundo",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "ciudad",
						description: "Nombre de la ciudad",
						type: ApplicationCommandOptionType.String,
						required: true,
					},
					{
						name: "unidad",
						description: "Unidad de la temperatura",
						choices: [
							{
								name: "Celsius",
								value: "C",
							},
							{
								name: "Fahrenheit",
								value: "F",
							},
						],
						type: ApplicationCommandOptionType.String,
					},
				],
			},
			{
				name: "elegir",
				description: "Escojo al azar una opción de un grupo de opciones",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "opciones",
						description:
							"Ingresa las opciones a escojer separadas por una coma (Ejm: rojo, azul, amarillo)",
						required: true,
						type: ApplicationCommandOptionType.String,
					},
				],
			},
			{
				name: "emoji",
				description: "Muestro un emoji personalizado en tamaño grande",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "emoji",
						description: "El emoji a mostrar",
						required: true,
						type: ApplicationCommandOptionType.String,
					},
				],
			},
			{
				name: "ping",
				description: "Muestro mi latencia actual y la del API también",
				type: ApplicationCommandOptionType.Subcommand,
			},
			{
				name: "random",
				description: "Muestro un número aleatorio que esté en el intervalo donde me especifiques",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "desde",
						description: "El límite inferior del intervalo (este también se tomará en cuenta)",
						required: true,
						type: ApplicationCommandOptionType.Integer,
						minValue: 0,
					},
					{
						name: "hasta",
						description: "El límite superior del intervalo (este también se tomará en cuenta)",
						required: true,
						type: ApplicationCommandOptionType.Integer,
						maxValue: 100_000,
					},
				],
			},
			{
				name: "recordatorio",
				description: "Te recordaré algo en el tiempo que me indiques",
				type: ApplicationCommandOptionType.Subcommand,
				options: [
					{
						name: "mensaje",
						description: "Lo que quieres que te recuerde",
						required: true,
						type: ApplicationCommandOptionType.String,
					},
					{
						name: "tiempo",
						description: "En cuanto tiempo te lo recordaré",
						required: true,
						type: ApplicationCommandOptionType.Integer,
					},
					{
						name: "unidad",
						description: "La unidad del tiempo",
						required: true,
						choices: [
							{
								name: "minuto(s)",
								value: "m",
							},
							{
								name: "hora(s)",
								value: "h",
							},
							{
								name: "día(s)",
								value: "d",
							},
						],
						type: ApplicationCommandOptionType.String,
					},
				],
			},
			{
				name: "server_icon",
				description: "Muestro el ícono de este servidor",
				type: ApplicationCommandOptionType.Subcommand,
			},
		],
	},
	cooldown: 10,
	execute: async (params) => {
		switch (params.args.getSubcommand()) {
			case "avatar": {
				avatar(params);
				break;
			}
			case "calculadora": {
				calculadora(params);
				break;
			}
			case "clima": {
				clima(params);
				break;
			}
			case "elegir": {
				elegir(params);
				break;
			}
			case "emoji": {
				emoji(params);
				break;
			}
			case "ping": {
				ping(params);
				break;
			}
			case "random": {
				random(params);
				break;
			}
			case "recordatorio": {
				recodatorio(params);
				break;
			}
			case "server_icon": {
				serverIcon(params);
				break;
			}

			default:
				break;
		}
	},
});
