const { loadJson, saveJson } = require('../utils/fileManager');
const path = require('path');

const filePath = path.join(__dirname, '../data/tournois.json');

module.exports = {
    async execute(interaction, params) {
        const tournoiId = params[0]; // Récupère l'ID du tournoi

        let tournois = loadJson(filePath, []);
        const tournoiIndex = tournois.findIndex(t => t.id === tournoiId);

        if (tournoiIndex === -1) {
            return interaction.reply({
                content: `❌ Ce tournoi n'existe plus.`,
                ephemeral: true
            });
        }

        if (tournois[tournoiIndex].createur !== interaction.user.id) {
            return interaction.reply({
                content: "❌ Vous ne pouvez supprimer que vos propres tournois.",
                ephemeral: true
            });
        }

        tournois.splice(tournoiIndex, 1);
        saveJson(filePath, tournois);

        return interaction.update({
            content: `✅ Tournoi supprimé avec succès.`,
            embeds: [],
            components: []
        });
    }
};
