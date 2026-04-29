const {
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const config = require('../config/ticketConfig');

module.exports = {
  name: 'interactionCreate',

  async execute(interaction) {

    // =========================
    // 🎫 MENU TICKET
    // =========================
    if (interaction.isStringSelectMenu()) {

      if (interaction.customId === 'ticket_menu') {

        const type = interaction.values[0];
        const user = interaction.user;

        const guild = interaction.guild;

        const channel = await guild.channels.create({
          name: `ticket-${type}-${user.username}`,
          type: ChannelType.GuildText,
          parent: config.CATEGORY_ID,
          permissionOverwrites: [
            {
              id: guild.id,
              deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
              id: user.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory
              ]
            },
            {
              id: config.STAFF_ROLE,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory
              ]
            }
          ]
        });

        const embed = new EmbedBuilder()
          .setTitle(`🎫 Ticket de ${type.toUpperCase()}`)
          .setDescription('Explique seu problema com detalhes.')
          .setColor('#00ffcc');

        const closeBtn = new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('🔒 Fechar Ticket')
          .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(closeBtn);

        await channel.send({
          content: `<@${user.id}> <@&${config.STAFF_ROLE}>`,
          embeds: [embed],
          components: [row]
        });

        // =========================
        // 📊 LOG DE ABERTURA
        // =========================
        const log = interaction.guild.channels.cache.get(config.LOG_CHANNEL_ID);

        if (log) {
          log.send({
            embeds: [
              new EmbedBuilder()
                .setTitle('📊 Ticket Aberto')
                .setDescription(`Usuário: <@${user.id}>\nCategoria: ${type}\nCanal: ${channel}`)
                .setColor('Green')
            ]
          });
        }

        return interaction.reply({
          content: `🎫 Ticket criado: ${channel}`,
          ephemeral: true
        });
      }
    }

    // =========================
    // 🔒 FECHAR TICKET
    // =========================
    if (interaction.isButton()) {

      if (interaction.customId === 'close_ticket') {

        const channel = interaction.channel;

        await interaction.reply({
          content: '🔒 Fechando ticket...'
        });

        const log = interaction.guild.channels.cache.get(config.LOG_CHANNEL_ID);

        if (log) {
          log.send({
            embeds: [
              new EmbedBuilder()
                .setTitle('📕 Ticket Fechado')
                .setDescription(`Canal: ${channel.name}`)
                .setColor('Red')
            ]
          });
        }

        setTimeout(() => {
          channel.delete().catch(() => {});
        }, 4000);
      }
    }
  }
};