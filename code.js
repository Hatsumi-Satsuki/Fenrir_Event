const discord = require("discord.js");
const { EmbedBuilder, InteractionType ,ActionRowBuilder, ButtonBuilder, ButtonStyle, Events} = require("discord.js");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const options = { intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES","GUILD_VOICE_STATES",] };

const client = new Client(
  {
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel],
  },
  options
);
//Voice
 const { joinVoiceChannel, entersState, VoiceConnectionStatus, createAudioResource, StreamType, createAudioPlayer, AudioPlayerStatus, NoSubscriberBehavior, generateDependencyReport } = require("@discordjs/voice"); console.log(generateDependencyReport());

const Keyv = require("keyv");
//const guild_id = client.guilds.fetch("848889471226085376");
const cron = require("node-cron");
//const talk = new Keyv('sqlite://db.sqlite', { table: 'talk' })
const { Level } = require("level");
const vault = new Level("example", { valueEncoding: "json" });

const CoolDown = new Keyv("sqlite://db.sqlite", {
  table: "CoolDown",
});

client.on("ready", async (ready) => {
  console.log("bot準備完了！");
  let status_arr_ready = ["学園祭\n"];
  let status_weight_ready = [10];
  lotteryByWeightNotSend(status_arr_ready, status_weight_ready);
});

const Vote = new Keyv("sqlite://db.sqlite", {
  table: "Vote",
});

//webhookのキャッシュ
const cacheWebhooks = new Map();

//アイコン類
const nullN="."
const nullI="https://cdn.glitch.global/f07fb903-52cb-4077-b26c-f478bb1a6af1/nullIcon.png?v=1655365491689"

//ここから


//ステータスメッセージ
/*/
cron.schedule("0 15 * * *", () => {
  let status_arr_0 = [
    "──\n",
    "──",
  ];
  let status_weight_0 = [10, 10];
  lotteryByWeightNotSend(status_arr_0, status_weight_0);
});

/*/


/*/

学園祭イベント

/*/
client.on("messageCreate", async (message) => {
  if (message.channel == client.channels.cache.get("917373937879486474")) {
    if (message.author.bot) {
    return;
    }
    if (message.content === "test"){
  console.log("tes")
   play(message)
    };
  }
});





/*/

functions

/*/

//play
async function play(interaction) {
  const guild = interaction.guild;
  const member = await guild.members.fetch(interaction.member.id);
  const memberVC = member.voice.channel;
  if (!memberVC) {
    return interaction.reply({
      content: "接続先のVCが見つかりません。",
      ephemeral: true,
    });
  }
  if (!memberVC.joinable) {
    return interaction.reply({
      content: "VCに接続できません。",
      ephemeral: true,
    });
  }
  if (!memberVC.speakable) {
    return interaction.reply({
      content: "VCで音声を再生する権限がありません。",
      ephemeral: true,
    });
  }
  const status = ["●Loading Sounds...", `●Connecting to ${memberVC}...`];
  const p = interaction.reply(status.join("\n"));
  const connection = joinVoiceChannel({
    guildId: guild.id,
    channelId: memberVC.id,
    adapterCreator: guild.voiceAdapterCreator,
    selfMute: false,
  });
  const resource = createAudioResource("https://cdn.discordapp.com/attachments/1134827444457705472/1134827535713185822/ea395c571f34f7d0.wav",
  {
    inputType: StreamType.Arbitrary,
  });
  const player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Pause,
    },
  });
  player.play(resource);
  const promises = [];
  promises.push(entersState(player, AudioPlayerStatus.AutoPaused, 1000 * 10).then(() => status[0] += "Done!"));
  promises.push(entersState(connection, VoiceConnectionStatus.Ready, 1000 * 10).then(() => status[1] += "Done!"));
  await Promise.race(promises);
  await p;
  connection.subscribe(player);
  console.log("3")
  await entersState(player, AudioPlayerStatus.Playing, 100);

console.log("4")
  await console.log("Playing");
  await entersState(player, AudioPlayerStatus.Idle, 2 ** 31 - 1);
  await console.log("End");
  connection.destroy();
}


async function getWebhookInChannel(channel) {
  //webhookのキャッシュを自前で保持し速度向上
  const webhook = cacheWebhooks.get(channel.id) ?? (await getWebhook(channel));
  return webhook;
}

async function getWebhook(channel) {
  //チャンネル内のWebhookを全て取得
  const webhooks = await channel.fetchWebhooks();
  //tokenがある（＝webhook製作者がbot自身）Webhookを取得、なければ作成する
  const webhook =
    webhooks?.find((v) => v.token) ??
    (await channel.createWebhook("Event Webhook"));
  //キャッシュに入れて次回以降使い回す
  if (webhook) cacheWebhooks.set(channel.id, webhook);
  return webhook;
}

//webhookで送信
async function sendMessageWebhook(message, name, icon) {
  //メッセージ発信者の名前とアバターURL
  const nickname = name;
  const avatarURL = icon;
  //Webhookの取得（なければ作成する）
  const webhook = await getWebhookInChannel(
    client.channels.cache.get(`997749272650989688`)
  );
  //メッセージ送信（今回は受け取ったものをそのまま送信）
  //usernameとavatarURLをメッセージ発信者のものに指定するのがミソ
  const webhookmessage = await webhook
    .send({
      content: message,
      username: nickname,
      avatarURL: avatarURL,
    })
    .catch((e) => console.error(e));
}

async function sendFilesWebhook(file, name, icon) {
  //メッセージ発信者の名前とアバターURL
  const nickname = name;
  const avatarURL = icon;
  //Webhookの取得（なければ作成する）
  const webhook = await getWebhookInChannel(
    client.channels.cache.get(`997749272650989688`)
  );
  //メッセージ送信（今回は受け取ったものをそのまま送信）
  //usernameとavatarURLをメッセージ発信者のものに指定するのがミソ
  const webhookmessage = await webhook
    .send({
      files: [file],
      username: nickname,
      avatarURL: avatarURL,
    })
    .catch((e) => console.error(e));
}

async function sendMessageWebhookInChat(message, name, icon) {
  //メッセージ発信者の名前とアバターURL
  const nickname = name;
  const avatarURL = icon;
  //Webhookの取得（なければ作成する）
  const webhook = await getWebhookInChannel(
    client.channels.cache.get(`970635600954793994`)
  );
  //メッセージ送信（今回は受け取ったものをそのまま送信）
  //usernameとavatarURLをメッセージ発信者のものに指定するのがミソ
  const webhookmessage = await webhook
    .send({
      content: message,
      username: nickname,
      avatarURL: avatarURL,
    })
    .catch((e) => console.error(e));
}

function sendMsg(channelId, text, option = {}) {
  client.channels
    .get(channelId)
    .send(text, option)
    .then(console.log("メッセージ送信: " + text + JSON.stringify(option)))
    .catch(console.error);
}

function lotteryByWeight(channelId, arr, weight) {
  let totalWeight = 0;
  for (var i = 0; i < weight.length; i++) {
    totalWeight += weight[i];
  }
  let random = Math.floor(Math.random() * totalWeight);
  for (var i = 0; i < weight.length; i++) {
    if (random < weight[i]) {
      client.channels.cache.get(channelId).send(arr[i]).then(console.log("ok"));
      return arr[i];
    } else {
      random -= weight[i];
    }
  }
  console.log("lottery error");
}

function lotteryByWeight_getarr(arr, weight) {
  let totalWeight = 0;
  for (var i = 0; i < weight.length; i++) {
    totalWeight += weight[i];
  }
  let random = Math.floor(Math.random() * totalWeight);
  for (var i = 0; i < weight.length; i++) {
    if (random < weight[i]) {
      return arr[i];
    } else {
      random -= weight[i];
    }
  }
  console.log("lottery error");
}

//ステータスメッセージ用
function lotteryByWeightNotSend(arr, weight) {
  let totalWeight = 0;
  for (var i = 0; i < weight.length; i++) {
    totalWeight += weight[i];
  }
  let random = Math.floor(Math.random() * totalWeight);
  for (var i = 0; i < weight.length; i++) {
    if (random < weight[i]) {
      client.user.setActivity(arr[i], { type: "LISTENING" });
      console.log(`ステータスメッセージを${arr[i]}に設定！`);
      return;
    } else {
      random -= weight[i];
    }
  }
  console.log("NSlottery error");
}

function lotteryByWeightcommands(channelId, arr, weight) {
  let totalWeight = 0;
  for (var i = 0; i < weight.length; i++) {
    totalWeight += weight[i];
  }
  let random = Math.floor(Math.random() * totalWeight);
  for (var i = 0; i < weight.length; i++) {
    if (random < weight[i]) {
      let commandresult = arr[i];
      return;
    }
  }
}

async function act(message, name, icon, time) {
  setTimeout(() => {
    sendMessageWebhook(message, name, icon).catch((err) => {
      console.error(err);
      process.exit(-1);
    });
  }, time*0.1);
  let T = time*0.1;
  return time;
}


async function file(file,time) {
  setTimeout(() => {
    sendFilesWebhook(file ,nullN,nullI).catch((err) => {
      console.error(err);
      process.exit(-1);
    });
  }, time*0.1);
  let T = time*0.1;
  return time;
}



async function actInChat(message, name, icon, time) {
  setTimeout(() => {
    sendMessageWebhookInChat(message, name, icon).catch((err) => {
      console.error(err);
      process.exit(-1);
    });
  }, time*0.1);
  let T = time*0.1;
  return time;
}


function textMessage(text, channelId) {
  client.channels.cache.get(channelId).send(text);
}

async function bookmark(time){
           await  file(`https://media.discordapp.net/attachments/970237992415399956/994758238723653732/243.png`,time)
}
/**/
//ここまで
client.login(process.env.DISCORD_BOT_TOKEN);
