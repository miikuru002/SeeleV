import { Event } from "../structures";
import { seelev } from "../index";

export default new Event({
	name: "messageDelete",
	execute: async (message) => {
		//valida que el msj no es de un bot
		if (message.author?.bot) return;

		//obtiene los datos
		let snipes = seelev.snipes.get(message.channel.id);

		//sobreescribe los nuevos mensajes
		snipes = {
			message: message,
			image: message.attachments.first()?.proxyURL,
			time: Date.now(),
		};

		//guarda los snipes en la colección
		seelev.snipes.set(message.channel.id, snipes);
	},
});
