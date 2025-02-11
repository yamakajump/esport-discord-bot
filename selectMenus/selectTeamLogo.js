const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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

        const selectedTeamIndex = selectedTournoi.equipes.indexOf(selectedTeamId);

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
        const logoFileName = `${uuidv4()}.png`;
        const logoFilePath = path.join(logoDir, logoFileName);
        fs.copyFileSync(tempLogoFilePath, logoFilePath);

        // Mettre à jour le JSON des tournois
        selectedTournoi.equipes[selectedTeamIndex] = {
            name: selectedTeamId,
            logo: logoFilePath
        };
        fs.writeFileSync(filePath, JSON.stringify(tournois, null, 2), 'utf8');

        await interaction.update({
            content: `Logo de l'équipe "${selectedTeamId}" ajouté avec succès!`,
            components: [],
            ephemeral: true
        });

        // Supprimer le logo temporaire
        fs.unlinkSync(tempLogoFilePath);
    }
};
