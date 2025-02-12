const { MessageFlags } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { getTeamSelectMenu } = require('../utils/tournamentUtils');

const filePath = path.join(__dirname, '../data/tournois.json');

module.exports = {
    async execute(interaction) {
        const selectedTournoiId = interaction.values[0];
        let tournois = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const selectedTournoi = tournois.find(t => t.id === selectedTournoiId);

        if (!selectedTournoi) {
            return interaction.reply({
                content: "❌ Tournoi non trouvé.",
                flags: MessageFlags.Ephemeral
            });
        }

        // Afficher un menu déroulant pour sélectionner l'équipe
        const row = getTeamSelectMenu(selectedTournoi);

        await interaction.update({
            content: `📋 Sélectionnez une équipe pour le tournoi "${selectedTournoi.nom}" :`,
            components: [row],
            flags: MessageFlags.Ephemeral
        });
    }
};
