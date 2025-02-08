const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { loadJson, saveJson } = require('../utils/fileManager');
const { generateBracketStructure, generateTournamentBracketImage } = require('../utils/tournamentUtils');
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

        const tournoiId = params[0];
        const teamName = interaction.fields.getTextInputValue('teamName');

        let tournois = loadJson(filePath, []);
        let tournoi = tournois.find(t => t.id === tournoiId);

        if (!tournoi) {
            return interaction.reply({ content: `❌ Ce tournoi n'existe plus.`, ephemeral: true });
        }

        if (tournoi.equipes.length >= tournoi.maxEquipes) {
            return interaction.reply({ content: `❌ Ce tournoi est déjà complet.`, ephemeral: true });
        }

        if (tournoi.equipes.includes(teamName)) {
            return interaction.reply({ content: `❌ L'équipe **${teamName}** existe déjà.`, ephemeral: true });
        }

        // Ajout de l'équipe
        tournoi.equipes.push(teamName);
        saveJson(filePath, tournois);

        // Mise à jour de l'embed avec la nouvelle liste des équipes
        const updatedEmbed = new EmbedBuilder()
            .setTitle(`🏆 Tournoi : ${tournoi.nom}`)
            .setDescription(`🔹 **Équipes inscrites** : ${tournoi.equipes.length}/${tournoi.maxEquipes}\n👤 **Créateur** : <@${tournoi.createur}>`)
            .setColor('#FFD700')
            .setTimestamp();

        // Ajout de la liste des équipes actuelles
        if (tournoi.equipes.length > 0) {
            updatedEmbed.addFields({ name: "📌 Équipes :", value: tournoi.equipes.map(team => `- ${team}`).join("\n") });
        }

        // Vérification si le tournoi est complet
        if (tournoi.equipes.length === tournoi.maxEquipes) {
            generateBracketStructure(tournoiId);
            const bracketPath = await generateTournamentBracketImage(tournoiId);
            const attachment = new AttachmentBuilder(bracketPath);

            return interaction.update({
                content: "✅ Tournoi complet ! Voici le bracket :",
                files: [attachment],
                embeds: [],
                components: []
            });
        }

        return interaction.update({
            content: `✅ Équipe **${teamName}** ajoutée !`,
            embeds: [updatedEmbed]
        });
    }
};
