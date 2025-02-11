const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/tournois.json');
const tempLogoPath = path.join(__dirname, '../data/logos');

module.exports = {
    async execute(interaction) {
        const [menuName, selectedTournoiId] = interaction.customId.split(':');
        const selectedTeamId = interaction.values[0];
        let tournois = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const selectedTournoi = tournois.find(t => t.id === selectedTournoiId);

        if (!selectedTournoi) {
            return interaction.reply({
                content: "❌ Tournoi non trouvé.",
                ephemeral: true
            });
        }

        const selectedTeamIndex = selectedTournoi.equipes.findIndex(team => team.id === selectedTeamId);

        if (selectedTeamIndex === -1) {
            return interaction.reply({
                content: "❌ Équipe non trouvée.",
                ephemeral: true
            });
        }

        const userId = interaction.user.id;
        const tempLogoFilePath = path.join(tempLogoPath, `${userId}.png`);

        // Déplacer et renommer le logo
        const logoDir = path.join(__dirname, '../data/tournois', selectedTournoiId);
        if (!fs.existsSync(logoDir)) {
            fs.mkdirSync(logoDir, { recursive: true });
        }
        const logoFileName = `${selectedTeamId}.png`;
        const logoFilePath = path.join(logoDir, logoFileName);
        fs.copyFileSync(tempLogoFilePath, logoFilePath);

        // Mettre à jour le JSON des tournois
        selectedTournoi.equipes[selectedTeamIndex].logo = logoFilePath;
        fs.writeFileSync(filePath, JSON.stringify(tournois, null, 2), 'utf8');

        await interaction.update({
            content: `Logo de l'équipe "${selectedTournoi.equipes[selectedTeamIndex].name}" ajouté avec succès!`,
            components: [],
            ephemeral: true
        });

        // Supprimer le logo temporaire
        fs.unlinkSync(tempLogoFilePath);
    }
};
