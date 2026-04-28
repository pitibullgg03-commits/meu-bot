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
🔥 **CAVERNA DOS GAMERS**

1️⃣ Respeite todos os membros  
2️⃣ Proibido spam ou flood  
3️⃣ Proibido conteúdo NSFW  
4️⃣ Sem divulgação sem permissão  
5️⃣ Não desrespeitar staff  

⚠️ Quebrar regras = punição
      `)
      .setThumbnail('https://i.postimg.cc/D0KR4xV5/Chat-GPT-Image-28-de-abr-de-2026-10-38-43.png')
      .setFooter({ text: 'Leia antes de jogar no servidor' });

    await interaction.reply({
      embeds: [embed]
    });
  }
};