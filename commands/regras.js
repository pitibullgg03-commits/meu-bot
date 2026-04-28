const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('regras')
    .setDescription('Mostra as regras do servidor'),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setTitle('📜 REGRAS DO SERVIDOR')
      .setColor('#ff0000')
      .setDescription(`
🔥 CAVERNA DOS GAMERS

1️⃣ Respeite todos os membros  
2️⃣ Proibido spam ou flood  
3️⃣ Proibido conteúdo NSFW  
4️⃣ Sem divulgação sem permissão  
5️⃣ Respeite a staff  

⚠️ Quebrar regras = punição
      `)
      .setFooter({ text: 'Leia antes de jogar!' });

    return interaction.reply({
      embeds: [embed]
    });
  }
};