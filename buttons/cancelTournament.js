const { loadJson, saveJson } = require('../utils/fileManager');
const path = require('path');

const filePath = path.join(__dirname, '../data/tournois.json');

module.exports = {
    async execute(interaction, params) {
        if (!params || params.length === 0) {
            return interaction.reply({
                content: "❌ Erreur interne : ID du tournoi manquant.",
                ephemeral: true
            });
        }

        const tournoiId = params[0]; // Récupération de l'ID

        let tournois = loadJson(filePath, []);
        const tournoiIndex = tournois.findIndex(t => t.id === tournoiId);

        if (tournoiIndex === -1) {
            return interaction.reply({
                content: `❌ Tournoi introuvable.`,
                ephemeral: true
            });
        }

        if (tournois[tournoiIndex].createur !== interaction.user.id) {
            return interaction.reply({
                content: "❌ Vous ne pouvez supprimer que les tournois que vous avez créés.",
                ephemeral: true
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
