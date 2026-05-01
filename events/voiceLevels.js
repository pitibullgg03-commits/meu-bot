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

    // entrou na call
    if (!oldState.channelId && newState.channelId) {
      tempoCall.set(userId, Date.now());
    }

    // saiu da call
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

      // se já tem o cargo final, não faz nada
      if (member.roles.cache.has(cargoFinal)) return;

      try {
        // remove antigos
        for (const role of rolesConfig) {
          if (member.roles.cache.has(role.cargo)) {
            await member.roles.remove(role.cargo);
          }
        }

        // adiciona novo
        await member.roles.add(cargoFinal);

        // 🎉 MENSAGEM NO SERVIDOR
        const canal = oldState.guild.systemChannel;
        if (canal) {
          canal.send(`🎉 ${member} subiu de nível e agora é **${nomeCargo}**!`);
        }

        // 🔔 DM PRO USUÁRIO
        await member.send(
          `🏆 Parabéns! Você subiu para **${nomeCargo}** na Caverna dos Gamers!`
        ).catch(() => {});

      } catch (err) {
        console.log('Erro ao atualizar cargo:', err);
      }
    }

  });

};