const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, MessageFlags } = require('discord.js');
const { loadJson, saveJson } = require('../../utils/fileManager');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid'); // Génère un identifiant unique

const filePath = path.join(__dirname, '../../data/tournois.json');
const tournoisDir = path.join(__dirname, '../../data/tournois');
const defaultImagePath = path.join(__dirname, '../../images/bg.jpg');

// Mapping des couleurs aux valeurs HEX
const colorMap = {
    'blanc': '#FFFFFF',
    'noir': '#000000',
    'rouge': '#FF0000',
    'bleu': '#0000FF',
    'marron': '#8B4513',
    'violette': '#800080',
    'vert': '#00FF00',
    'jaune': '#FFFF00',
    'orange': '#FF8C00'
};

module.exports = {
    async execute(interaction) {
        const nom = interaction.options.getString('nom');
        const maxEquipes = interaction.options.getInteger('equipes');
        const date = interaction.options.getString('date');
        const couleurNeon = interaction.options.getString('couleur_neon');
        const couleurNeonHex = interaction.options.getString('couleur_neon_hex');
        const couleurNomsEquipes = interaction.options.getString('couleur_noms_equipes');
        const couleurNomsEquipesHex = interaction.options.getString('couleur_noms_equipes_hex');
        const couleurTitre = interaction.options.getString('couleur_titre');
        const couleurTitreHex = interaction.options.getString('couleur_titre_hex');
        const imageFond = interaction.options.getAttachment('image_fond');

        // Liste des nombres d’équipes autorisés
        const allowedTeamSizes = [2, 4, 8, 16, 32];

        // Vérification si le nombre d’équipes est valide
        if (!allowedTeamSizes.includes(maxEquipes)) {
            return interaction.reply({
                content: `❌ Le nombre d'équipes doit être **2, 4, 8, 16 ou 32**. Vous avez entré **${maxEquipes}**.`,
                flags: MessageFlags.Ephemeral
            });
        }

        let tournois = loadJson(filePath, []);

        // Vérification si un tournoi avec le même nom existe déjà
        if (tournois.some(t => t.nom === nom)) {
            return interaction.reply({
                content: `❌ Un tournoi avec le nom \`${nom}\` existe déjà.`,
                flags: MessageFlags.Ephemeral
            });
        }

        const tournoiId = uuidv4(); // Génération de l'ID unique

        // Créer le dossier pour le tournoi
        const tournoiDir = path.join(tournoisDir, tournoiId);
        if (!fs.existsSync(tournoiDir)) {
            fs.mkdirSync(tournoiDir, { recursive: true });
        }

        // Enregistrer l'image de fond si elle est fournie, sinon utiliser l'image par défaut
        let fondImagePath = null;
        if (imageFond) {
            const fondFilePath = path.join(tournoiDir, 'background.png');
            const writer = fs.createWriteStream(fondFilePath);
            const response = await axios({
                url: imageFond.url,
                method: 'GET',
                responseType: 'stream'
            });
            response.data.pipe(writer);
            fondImagePath = fondFilePath;
        } else {
            const defaultFilePath = path.join(tournoiDir, 'background.png');
            fs.copyFileSync(defaultImagePath, defaultFilePath);
            fondImagePath = defaultFilePath;
        }

        // Déterminer la couleur des néons
        let neonColorHex = colorMap[couleurNeon] || couleurNeonHex || colorMap['orange'];

        // Déterminer la couleur des noms des équipes
        let equipeColorHex = colorMap[couleurNomsEquipes] || couleurNomsEquipesHex || colorMap['orange'];

        // Déterminer la couleur du titre
        let titreColorHex = colorMap[couleurTitre] || couleurTitreHex || colorMap['orange'];

        const nouveauTournoi = {
            id: tournoiId,
            nom,
            maxEquipes,
            equipes: [],
            createur: interaction.user.id,
            dateTournoi: date || null,
            dateCreation: new Date().toISOString(),
            couleurNeon: neonColorHex,
            couleurNomsEquipes: equipeColorHex,
            couleurTitre: titreColorHex,
            fondImagePath
        };

        tournois.push(nouveauTournoi);
        saveJson(filePath, tournois);

        const embed = new EmbedBuilder()
            .setTitle(`🏆 Tournoi : ${nom}`)
            .setDescription(`🔹 **Équipes inscrites** : 0/${maxEquipes}\n👤 **Créateur** : <@${interaction.user.id}>`)
            .setColor('#FFD700')
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`addTeam:${tournoiId}`)
                    .setLabel('Ajouter une équipe')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`confirmDelete:${tournoiId}`)
                    .setLabel('Abandonner la création')
                    .setStyle(ButtonStyle.Danger)
            );

        return interaction.reply({ embeds: [embed], components: [row] });
    }
};
