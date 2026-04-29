const embed = new EmbedBuilder()
  .setTitle('📊 LOG DE MODERAÇÃO')
  .setColor('#ff0000')
  .addFields(
    { name: '⚙️ Ação', value: action.toUpperCase(), inline: true },
    { name: '👤 Usuário', value: `${member.user.tag} (${member.id})`, inline: true },
    { name: '👮 Staff', value: `${interaction.user.tag}`, inline: true },
    { name: '📄 Motivo', value: motivo || 'Não informado' }
  )
  .setFooter({ text: 'Caverna dos Gamers' })
  .setTimestamp();

log?.send({ embeds: [embed] });