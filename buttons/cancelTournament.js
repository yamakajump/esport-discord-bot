const { MessageFlags } = require('discord.js');
const { loadJson, saveJson } = require('../utils/fileManager');
const path = require('path');

const filePath = path.join(__dirname, '../data/tournois.json');

module.exports = {
    async execute(interaction, params) {
        if (!params || params.length === 0) {
            return interaction.reply({
                content: "❌ Erreur interne : ID du tournoi manquant.",
                flags: MessageFlags.Ephemeral
            });
        }

        const tournoiId = params[0]; // Récupération de l'ID

        let tournois = loadJson(filePath, []);
        const tournoiIndex = tournois.findIndex(t => t.id === tournoiId);

        if (tournoiIndex === -1) {
            return interaction.reply({
                content: `❌ Tournoi introuvable.`,
                flags: MessageFlags.Ephemeral
            });
        }

        if (tournois[tournoiIndex].createur !== interaction.user.id) {
            return interaction.reply({
                content: "❌ Vous ne pouvez supprimer que les tournois que vous avez créés.",
                flags: MessageFlags.Ephemeral
            });
        }

        tournois.splice(tournoiIndex, 1);
        saveJson(filePath, tournois);

        return interaction.update({
            content: `❌ Le tournoi a été annulé.`,
            embeds: [],
            components: []
        });
    }
};
