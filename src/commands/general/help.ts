import { Command } from "../../structures";
import { MessageEmbed } from "discord.js";
import { embed_color } from "../../config";

export default new Command({
	data: {
		name: "help",
		description: "Muestro mis comandos disponibles",
		options: [
			{
				name: "comando",
				description: "Te mostraré la información y ayuda de ese comando",
				type: "STRING",
			},
		],
	},
	example: "/ping",
	execute: async ({ interaction, args, client }) => {
		const com = args.getString("comando");
		//client.commands.forEach(cmd => console.log(cmd.data.name));

		if (!com) { //si no hay argumentos
			return await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(embed_color)
						.setTitle(":information_source: Ayuda de comandos:")
						.setDescription(`**Nota:** Ahora todos los comandos son slash-commands, para usarlos escribe \`/\` y el comando.\
							\nActualmente cuento con \`${client.commands.size} comandos\``
						)
						.addField("Reacciones:", "`próximamente...`")
						.addField("Interacciones:", "`próximamente...`")
						.addField("Diversión:", "`próximamente...`")
						.addField("Herramientas:", "`/avatar`, `/clima`, `/calculadora`, `/emoji`, `/ping`")
						.addField("Moderación:", "`próximamente...`")
						.setFooter({
							text: "Para obtener más información de un comando escribe /help <comando>",
						}),
				],
			});
		}

		//si el usuario indica un comando como argumento
		const cmd = client.commands.get(com);
		if (cmd) {
			return await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setTitle(
							`:information_source: Información del comando: ${cmd.data.name}`
						)
						.setColor(embed_color)
						.setDescription(`**Descripción:** ${cmd.data.description}`)
						.addField("Ejemplo:", `\`${cmd.example}\``, true)
						.addField("Cooldown:", `${cmd.cooldown} segundos`, true)
						.addField(
							"Estado:",
							`__*En mantenimiento:*__ ${
								cmd.enabled ? "No" : "Sí"
							}\n__*Alcance:*__ ${
								cmd.devsOnly ? "Solo desarrolladores" : "Todo el público"
							}`,
							true
						)
						.setFooter({
							text: "Leyenda de argumentos: <> = opcionales, [] = obligatorios",
						}),
				],
			});
		} else {
			return await interaction.reply("Comando no encontrado...");
		}
	},
});
