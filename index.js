require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits
} = require('discord.js');

// 🔐 TOKEN CHECK
if (!process.env.TOKEN) {
  console.error("❌ TOKEN não encontrado no ambiente");
  process.exit(1);
}

// CLIENT
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// =============================
// 🔑 CONFIG
// =============================
const CARGO_VERIFICADO = '1498403428982853692';
const CARGO_NAO_VERIFICADO = '1498702244734832650';
const CARGO_EXTRA = '1364330556434944091';

// 🎫 TICKETS CONFIG
const CATEGORY_TICKET_ID = 'COLOQUE_ID_CATEGORIA';
const LOG_CHANNEL_ID = 'COLOQUE_ID_LOGS';
const STAFF_ROLE_ID = 'COLOQUE_ID_STAFF';

// =============================
// 🤖 BOT ONLINE
// =============================
client.once('ready', () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
});

// =============================
// 👤 ENTRADA MEMBRO
// =============================
client.on(Events.GuildMemberAdd, async member => {
  try {
    await member.roles.add(CARGO_NAO_VERIFICADO);
  } catch (err) {
    console.log(err);
  }
});

// =============================
// 🎯 INTERAÇÕES
// =============================
client.on(Events.InteractionCreate, async interaction => {

  // =============================
  // 🔥 SLASH COMMANDS
  // =============================
  if (interaction.isChatInputCommand()) {

    // =============================
    // 🔐 /painel
    // =============================
    if (interaction.commandName === 'painel') {

      const embed = new EmbedBuilder()
        .setTitle('🔥 SISTEMA DE VERIFICAÇÃO 🔥')
        .setDescription('Clique no botão para se verificar')
        .setColor('#ff0000')
        .setImage('https://i.postimg.cc/8CYScdPd/Chat-GPT-Image-28-de-abr-de-2026-12-36-40.png');

      const button = new ButtonBuilder()
        .setCustomId('verificar')
        .setLabel('🔒 Verificar-se')
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder().addComponents(button);

      return interaction.reply({
        embeds: [embed],
        components: [row]
      });
    }

    // =============================
    // 🎫 /ticket PAINEL
    // =============================
    if (interaction.commandName === 'ticket') {

      const embed = new EmbedBuilder()
        .setTitle('🎫 CENTRAL DE TICKETS')
        .setDescription(`
🛠️ Suporte  
🚨 Denúncia  
🐞 Bug  
        `)
        .setColor('#ffcc00')
        .setImage('https://i.postimg.cc/D0KR4xV5/Chat-GPT-Image-28-de-abr-de-2026-10-38-43.png');

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('ticket_suporte')
          .setLabel('🛠️ Suporte')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId('ticket_denuncia')
          .setLabel('🚨 Denúncia')
          .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
          .setCustomId('ticket_bug')
          .setLabel('🐞 Bug')
          .setStyle(ButtonStyle.Secondary)
      );

      return interaction.reply({
        embeds: [embed],
        components: [row]
      });
    }
  }

  // =============================
  // 🔘 BOTÕES
  // =============================
  if (interaction.isButton()) {

    // =============================
    // 🔐 VERIFICAÇÃO
    // =============================
    if (interaction.customId === 'verificar') {

      const member = interaction.member;

      try {
        await member.roles.add(CARGO_VERIFICADO);
        await member.roles.add(CARGO_EXTRA);
        await member.roles.remove(CARGO_NAO_VERIFICADO);

        return interaction.reply({
          content: '🔥 Verificado com sucesso!',
          ephemeral: true
        });

      } catch (err) {
        console.log(err);
      }
    }

    // =============================
    // 🎫 CRIAR TICKET
    // =============================
    async function criarTicket(tipo) {

      const channel = await interaction.guild.channels.create({
        name: `${tipo}-${interaction.user.username}`,
        type: ChannelType.GuildText,
        parent: CATEGORY_TICKET_ID,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: interaction.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages
            ]
          },
          {
            id: STAFF_ROLE_ID,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages
            ]
          }
        ]
      });

      const closeBtn = new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('🔒 Fechar Ticket')
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder().addComponents(closeBtn);

      await channel.send({
        content: `<@${interaction.user.id}> <@&${STAFF_ROLE_ID}>`,
        embeds: [
          new EmbedBuilder()
            .setTitle(`🎫 Ticket ${tipo}`)
            .setDescription('Explique seu problema aqui.')
            .setColor('#00ff00')
            .setImage('https://i.postimg.cc/8CYScdPd/Chat-GPT-Image-28-de-abr-de-2026-12-36-40.png')
        ],
        components: [row]
      });

      return interaction.reply({
        content: `🎫 Ticket criado: ${channel}`,
        ephemeral: true
      });
    }

    // =============================
    // 🎫 TIPOS DE TICKET
    // =============================
    if (interaction.customId === 'ticket_suporte') return criarTicket('suporte');
    if (interaction.customId === 'ticket_denuncia') return criarTicket('denuncia');
    if (interaction.customId === 'ticket_bug') return criarTicket('bug');

    // =============================
    // 🔒 FECHAR + LOG
    // =============================
    if (interaction.customId === 'close_ticket') {

      const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);

      if (logChannel) {
        const embed = new EmbedBuilder()
          .setTitle('📁 Ticket Fechado')
          .addFields(
            { name: 'Canal', value: interaction.channel.name },
            { name: 'Fechado por', value: interaction.user.tag }
          )
          .setColor('#ff0000')
          .setImage('https://i.postimg.cc/8CYScdPd/Chat-GPT-Image-28-de-abr-de-2026-12-36-40.png');

        logChannel.send({ embeds: [embed] });
      }

      await interaction.reply({
        content: '🔒 Fechando ticket...',
        ephemeral: true
      });

      setTimeout(() => {
        interaction.channel.delete();
      }, 3000);
    }
  }
});

// =============================
// 🔑 LOGIN
// =============================
client.login(process.env.TOKEN)
  .then(() => console.log("🔑 Login realizado com sucesso"))
  .catch(err => console.error("❌ Erro no login:", err));