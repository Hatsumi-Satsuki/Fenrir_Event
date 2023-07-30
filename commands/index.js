


const Discord = require("discord.js");

const commands = {
  /**
   * 
   * @param {Discord.CommandInteraction} interaction 
   * @returns 
   */
  
async 匿名の忠告(interaction) {
    const source = {
      injury(name){
        return `index中傷`
      },
      melancholy(name){
        return `index鬱発言` 
      }
    };
    const name = interaction.member.displayName;
    const 注意の内容 = interaction.options.get("注意の内容");
    return interaction.reply(source[注意の内容.value](name));
  }
,

  async ping(interaction) {
    const now = Date.now();
    const msg = [
      "pong!",
      "",
      `gateway: ${interaction.client.ws.ping}ms`,
    ];
    await interaction.reply({ content: msg.join("\n"), ephemeral: true });
    await interaction.editReply([...msg, `往復: ${Date.now() - now}ms`].join("\n"));
    return;
  },
  /**
   * 
   * @param {Discord.CommandInteraction} interaction 
   * @returns 
   */
  async hello(interaction) {
    const source = {
      en(name){
        return `Hello, ${name}!`
      },
      ja(name){
        return `こんにちは、${name}さん。` 
      }
    };
    const name = interaction.member.displayName;
    const lang = interaction.options.get("language");
    return interaction.reply(source[lang.value](name));
  },
  async test(interaction){
  await interaction.reply("test succesed!!")
  }
}; 
//test commands

async function onInteraction(interaction) {
  if (!interaction.isCommand()) {
    return;
  }
  return commands[interaction.commandName](interaction);
}
const client = new Discord.Client({
  intents: 0
});
client.on("interactionCreate", interaction => onInteraction(interaction).catch(err => console.error(err)));
client.login(process.env.DISCORD_BOT_TOKEN).catch(err => {
  console.error(err);
  process.exit(-1);
});