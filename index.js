require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  EmbedBuilder
} = require('discord.js');

// 👇 CLIENT CORRIGIDO (incluindo GuildMembers que você já usa no código)
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers, // ⚠️ necessário pro memberAdd e roles
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// IDs dos cargos
const CARGO_VERIFICADO = '1498403428982853692';
const CARGO_NAO_VERIFICADO = '1498702244734832650';
const CARGO_EXTRA = '1364330556434944091';

// Bot online
client.once('ready', () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
});


// 👤 Quando alguém entra no servidor
client.on(Events.GuildMemberAdd, async member => {
  try {
    await member.roles.add(CARGO_NAO_VERIFICADO);
  } catch (err) {
    console.log('Erro ao adicionar cargo:', err);
  }
});


// 📩 Painel de verificação
client.on(Events.MessageCreate, async message => {
  if (message.author.bot) return;

  if (message.content === '!painel') {

    const embed = new EmbedBuilder()
      .setTitle('🔥 SISTEMA DE VERIFICAÇÃO 🔥')
      .setDescription(
        '🛡️ **Bem-vindo ao servidor!**\n\n' +
        'Para liberar o acesso completo, clique no botão abaixo.\n\n' +
        '⚠️ Apenas usuários verificados podem acessar os canais.'
      )
      .setColor('#ff0000')
      .setThumbnail('https://i.postimg.cc/D0KR4xV5/Chat-GPT-Image-28-de-abr-de-2026-10-38-43.png')
      .setImage('https://i.postimg.cc/8CYScdPd/Chat-GPT-Image-28-de-abr-de-2026-12-36-40.png')
      .setFooter({ text: '🇧🇷 CAVERNA DOS GAMERS 🇧🇷 • Segurança ativa 🔒' });

    const button = new ButtonBuilder()
      .setCustomId('verificar')
      .setLabel('🚀 Verificar-se')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(button);

    await message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
});


// 🔥 Clique no botão de verificação
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'verificar') {

    const member = interaction.member;

    try {
      await member.roles.add(CARGO_VERIFICADO);
      await member.roles.add(CARGO_EXTRA);
      await member.roles.remove(CARGO_NAO_VERIFICADO);

      await interaction.reply({
        content: '🔥 Você foi verificado com sucesso!',
        ephemeral: true
      });

    } catch (err) {
      console.log('Erro ao verificar usuário:', err);

      await interaction.reply({
        content: '❌ Erro ao aplicar cargos.',
        ephemeral: true
      });
    }
  }
});

// 🔐 LOGIN (Render usa variável de ambiente)
client.login(process.env.TOKEN);
/*eu amo minha mulher*/
