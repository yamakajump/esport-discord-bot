const { EmbedBuilder, MessageFlags } = require('discord.js');
const { loadJson } = require('../../utils/fileManager');
const path = require('path');

const filePath = path.join(__dirname, '../../data/tournois.json');

module.exports = {
    async execute(interaction) {
        const utilisateur = interaction.options.getUser('utilisateur'); // Option utilisateur

        let tournois = loadJson(filePath, []);

        // Filtrage des tournois par créateur si un utilisateur est précisé
        if (utilisateur) {
            tournois = tournois.filter(t => t.createur === utilisateur.id);
        }

        if (tournois.length === 0) {
            return interaction.reply({
                content: utilisateur
                    ? `📭 Aucun tournoi trouvé pour **${utilisateur.username}**.`
                    : "📭 Aucun tournoi créé pour le moment.",
                    flags: MessageFlags.Ephemeral
            });
        }

        // Création de l'embed de réponse
        const embed = new EmbedBuilder()
            .setTitle(`📋 Liste des tournois`)
            .setColor('#3498db')
            .setTimestamp();

        // Ajout des tournois à l'embed
        tournois.forEach((tournoi, index) => {
            embed.addFields({
                name: `#${index + 1} - ${tournoi.nom}`,
                value: `👤 **Créateur** : <@${tournoi.createur}>\n📋 **Équipes inscrites** : ${tournoi.equipes.length}/${tournoi.maxEquipes}`,
                inline: false
            });
        });

        return interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }
};
