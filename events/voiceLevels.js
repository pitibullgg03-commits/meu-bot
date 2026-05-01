const fs = require('fs');
const rolesConfig = require('../config/callRoles');

const path = './database/users.json';
const tempoCall = new Map();

function getData() {
  if (!fs.existsSync(path)) return {};
  return JSON.parse(fs.readFileSync(path));
}

function saveData(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = (client) => {

  client.on('voiceStateUpdate', async (oldState, newState) => {

    const userId = newState.id;

    // 🔥 ENTROU NA CALL
    if (!oldState.channelId && newState.channelId) {

      // evita AFK
      if (newState.channel?.name.toLowerCase().includes('afk')) return;

      tempoCall.set(userId, Date.now());
    }

    // 🔥 SAIU DA CALL
    if (oldState.channelId && !newState.channelId) {

      const entrou = tempoCall.get(userId);
      if (!entrou) return;

      const tempo = Date.now() - entrou;

      const data = getData();

      if (!data[userId]) {
        data[userId] = { tempo: 0 };
      }

      data[userId].tempo += tempo;
      saveData(data);

      tempoCall.delete(userId);

      const member = oldState.member;
      if (!member) return;

      const horas = data[userId].tempo / 1000 / 60 / 60;

      let cargoFinal = null;
      let nomeCargo = null;

      for (const role of rolesConfig) {
        if (horas >= role.tempo) {
          cargoFinal = role.cargo;
          nomeCargo = role.nome;
        }
      }

      if (!cargoFinal) return;

      // ✅ já tem o cargo
      if (member.roles.cache.has(cargoFinal)) return;

      try {

        // 🔄 remove todos cargos antigos
        for (const role of rolesConfig) {
          if (member.roles.cache.has(role.cargo)) {
            await member.roles.remove(role.cargo);
          }
        }

        // ➕ adiciona novo
        await member.roles.add(cargoFinal);

        // 🎉 CANAL DE LOG (melhor que systemChannel)
        const canal = oldState.guild.systemChannel;

        if (canal) {
          canal.send({
            content: `🎉 ${member} evoluiu para **${nomeCargo}**! 🏆`
          });
        }

        // 🔔 DM
        await member.send({
          content: `🏆 Você subiu para **${nomeCargo}** na Caverna dos Gamers! Continue evoluindo 🔥`
        }).catch(() => {});

      } catch (err) {
        console.log('Erro ao atualizar cargo:', err);
      }
    }

  });

};