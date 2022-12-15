import { EmbedBuilder } from "discord.js";
import { embed_color } from "../../../config";
import { IClima, IExecuteParams } from "../../../types";
import { getTimeFromTimezone } from "../../../util";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const weather = require("weather-js");

export const clima = async ({ interaction, args }: IExecuteParams) => {
	const ciudad = args.getString("ciudad");
	const unidad = args.getString("unidad");
	const temp_embed = new EmbedBuilder();

	await interaction.deferReply(); //BOT PENSANDO//

	weather.find(
		{ search: ciudad, degreeType: unidad || "C", lang: "es-mx" },
		async (err: unknown, result: IClima[]) => {
			if (err || typeof result[0] === "undefined") {
				const err_embed = new EmbedBuilder()
					.setTitle(":white_sun_small_cloud: Clima:")
					.setDescription("No pude encontrar esa ciudad...")
					.setColor(embed_color);

				return await interaction.editReply({ embeds: [err_embed] });
			}

			const current = result[0].current;
			const location = result[0].location;

			temp_embed
				.setTitle(":white_sun_small_cloud: Clima:")
				.setDescription(
					`El clima en ${current.observationpoint}: \`${current.skytext}\``
				)
				.setThumbnail(current.imageUrl)
				.setColor(embed_color)
				.addFields(
					{ name: "Zona Horaria:", value: `GMT${location.timezone}`, inline: true },
					{ name: "Temperatura:", value: `${current.temperature} °${location.degreetype}`, inline: true },
					{ name: "Viento:", value: current.windspeed, inline: true },
					{ name: "Humedad:", value: `${current.humidity}%`, inline: true },
					{ name: "Sensación T:", value: `${current.feelslike} °${location.degreetype}`, inline: true },
					{ 
						name: "Fecha y hora:",
						value: `${current.shortday} ${getTimeFromTimezone(Number(location.timezone))}`,
						inline: true 
					},
				);
			return await interaction.editReply({ embeds: [temp_embed] });
		}
	);
};