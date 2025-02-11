const { loadJson, saveJson } = require('../utils/fileManager');
const path = require('path');
const { supprimerUnTournoi } = require('../utils/tournamentUtils'); // Importer la fonction

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

        // Utiliser la fonction pour supprimer le tournoi
        const success = supprimerUnTournoi(tournoiId);

        if (success) {
            return interaction.update({
                content: `✅ Tournoi supprimé avec succès.`,
                embeds: [],
                components: []
            });
        } else {
            return interaction.reply({
                content: `❌ Une erreur est survenue lors de la suppression du tournoi.`,
                ephemeral: true
            });
        }
    }
};
