import { IExecuteParams } from "../../../types";

export const say = async ({ interaction, args }: IExecuteParams) => {
	const msg = args.getString("mensaje", true);

	//si el mensaje contiene un @everyone/here o menciona a un rol
	if (msg.match(/@(everyone|here)/gi) || msg.match(/<@&(\d{17,19})>/gi)) {
		return await interaction.reply({
			content:
				"**:no_entry_sign: | El mensaje no puede tener un everyone/here o mencionar algún rol**",
		});
	}

	//envía el mensaje
	await interaction.channel?.send({ content: msg });

	//envía un mensaje efímero de confirmación (se debe responder al comando, sino sale error)
	return await interaction.reply({
		content: "Mensaje enviado (｡•̀ᴗ-)✧",
		ephemeral: true,
	});
};
