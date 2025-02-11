const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');
const { loadJson, saveJson } = require('./fileManager');

const filePath = path.join(__dirname, '../data/tournois.json'); // Fichier JSON des tournois
const tournoisDir = path.join(__dirname, '../data/tournois'); // Dossier des tournois
const defaultImagePath = path.join(__dirname, '../images/bg.png');

/**
 * Mélange un tableau aléatoirement
 * @param {Array} array - Tableau à mélanger
 * @returns {Array} - Tableau mélangé
 */
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

/**
 * Vérifie si un nombre est une puissance de 2
 * @param {number} num - Nombre d'équipes
 * @returns {boolean} - True si c'est une puissance de 2
 */
function isPowerOf2(num) {
    return (num & (num - 1)) === 0 && num > 0;
}

/**
 * Génère la structure du bracket pour un tournoi (uniquement puissance de 2)
 * @param {string} tournoiId - ID du tournoi
 * @returns {boolean} - Succès de la génération
 */
function generateBracketStructure(tournoiId) {
    let tournois = loadJson(filePath, []);
    let tournoi = tournois.find(t => t.id === tournoiId);

    if (!tournoi) return false;

    let equipes = shuffleArray([...tournoi.equipes]);
    let totalEquipes = equipes.length;

    // Vérifie si le nombre d'équipes est une puissance de 2
    if (!isPowerOf2(totalEquipes)) {
        console.log(`❌ Nombre d'équipes invalide (${totalEquipes}). Doit être une puissance de 2.`);
        return false;
    }

    let rounds = [];
    let currentRound = [];

    // Création du premier tour
    for (let i = 0; i < totalEquipes; i += 2) {
        currentRound.push({ team1: equipes[i], team2: equipes[i + 1], winner: null });
    }
    rounds.push(currentRound);

    // Génération des tours suivants
    while (currentRound.length > 1) {
        let nextRound = [];
        for (let i = 0; i < currentRound.length; i += 2) {
            nextRound.push({ team1: {"id": null, "name": null, "logo": null}, team2: {"id": null, "name": null, "logo": null}, winner: null }); // Placeholders pour les vainqueurs
        }
        rounds.push(nextRound);
        currentRound = nextRound;
    }

    tournoi.bracket = rounds;
    saveJson(filePath, tournois);

    return true;
}

/**
 * Génère une image du bracket d’un tournoi avec une finale au centre et les rounds alignés
 * @param {string} tournoiId - ID du tournoi
 * @returns {string|null} - Chemin de l’image générée ou null si erreur
 */
async function generateTournamentBracketImage(tournoiId) {
    let tournois = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let tournoi = tournois.find(t => t.id === tournoiId);

    if (!tournoi || !tournoi.bracket) return null;

    const totalTeams = tournoi.equipes.length;
    const canvasWidth = 1200;
    const canvasHeight = 800;

    let boxWidth;
    if (totalTeams <= 4) {
        boxWidth = 200;
    } else if (totalTeams <= 8) {
        boxWidth = 180;
    } else if (totalTeams <= 16) {
        boxWidth = 130;
    } else {
        boxWidth = 100;
    }

    const finalRoundSpacing = boxWidth / 2 + 10;
    const roundSpacing = boxWidth + 20;
    const boxHeight = 30;
    const boxWinnerHeight = 90;

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Charger l'image de fond
    let bgImagePath = tournoi.fondImagePath || defaultImagePath;
    try {
        const bgImage = await loadImage(bgImagePath);
        ctx.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight);
    } catch (error) {
        console.error("Erreur lors du chargement de l'image de fond:", error);
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    // Style néon
    ctx.strokeStyle = tournoi.couleurNeon;
    ctx.lineWidth = 4;
    ctx.shadowBlur = 10;
    ctx.shadowColor = tournoi.couleurNeon;
    ctx.font = '20px Arial';
    ctx.fillStyle = tournoi.couleurNomsEquipes;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 📌 **1ère étape : Ajouter le titre du tournoi**
    ctx.font = '40px Arial'; // Taille plus grande pour le titre
    ctx.fillStyle = tournoi.couleurTitre; // Couleur du titre
    ctx.fillText(tournoi.nom.toUpperCase(), canvasWidth / 2, 50); // Centrage horizontal

    // Retour au style de texte par défaut
    ctx.font = '20px Arial';
    ctx.fillStyle = tournoi.couleurNomsEquipes;

    // 📌 **2ème étape : Générer la finale unique au centre haut**
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    // On récupère le match final (dernier round du JSON)
    const finalRoundIndex = tournoi.bracket.length - 1;
    const finalMatch = tournoi.bracket[finalRoundIndex] && tournoi.bracket[finalRoundIndex][0];

    // Encadré du gagnant (on affiche le nom du gagnant s'il n'est pas null, sinon l'emoji trophée)
    ctx.strokeRect(centerX - boxWidth / 2, centerY - boxHeight / 2 - boxWinnerHeight, boxWidth, boxHeight + 20);
    ctx.fillText(finalMatch && finalMatch.winner ? finalMatch.winner.name : "🏆", centerX, centerY - boxWinnerHeight + 10);

    // 📌 **3ème étape : Générer les 2 encadrés des équipes finalistes**
    const leftX = centerX - finalRoundSpacing;
    const rightX = centerX + finalRoundSpacing;

    ctx.strokeRect(leftX - boxWidth / 2, centerY - boxHeight / 2, boxWidth, boxHeight);
    ctx.fillText(finalMatch && finalMatch.team1 ? finalMatch.team1.name : "???", leftX, centerY);

    const team1LogoPath = finalMatch.team1.logo;
    if (team1LogoPath) {
        const team1Logo = await loadImage(team1LogoPath);
        ctx.drawImage(team1Logo, leftX - boxWidth / 2, centerY - boxHeight / 2, boxHeight, boxHeight);
    }

    ctx.strokeRect(rightX - boxWidth / 2, centerY - boxHeight / 2, boxWidth, boxHeight);
    ctx.fillText(finalMatch && finalMatch.team2 ? finalMatch.team2.name : "???", rightX, centerY);

    const team2LogoPath = finalMatch.team2.logo;
    if (team2LogoPath) {
        const team2Logo = await loadImage(team2LogoPath);
        ctx.drawImage(team2Logo, rightX - boxWidth / 2, centerY - boxHeight / 2, boxHeight, boxHeight);
    }

    // 📌 **4ème étape : Connecter les finalistes à l'encadré du gagnant**
    ctx.beginPath();
    ctx.lineTo(leftX + boxWidth / 2, centerY - boxHeight / 2 + boxHeight / 2);
    ctx.lineTo(rightX - boxWidth / 2, centerY - boxHeight / 2 + boxHeight / 2);
    ctx.lineTo(centerX, centerY);
    ctx.lineTo(centerX, centerY + boxHeight - boxWinnerHeight + 5);
    ctx.stroke();

    // 📌 **5ème étape : Préparer les rounds précédents**
    // Les rounds vont être dessinés depuis le round final vers le premier tour.
    let roundsLeft = [[{ x: leftX, y: centerY }]];
    let roundsRight = [[{ x: rightX, y: centerY }]];

    let currentTeams = 2;
    let currentXLeft = leftX - roundSpacing;
    let currentXRight = rightX + roundSpacing;

    let roundNumber = 1; // 1ère itération => round juste avant le final

    while (currentTeams < totalTeams) {
        // Selon le round, on choisit un espacement vertical
        let ySpacing;
        if (roundNumber === 4) {
            ySpacing = canvasHeight / 20;
        } else if (roundNumber === 3) {
            ySpacing = canvasHeight / 12;
        } else if (roundNumber === 2) {
            ySpacing = canvasHeight / 7;
        } else {
            ySpacing = canvasHeight / 3.75;
        }

        // Pour retrouver dans le JSON le round correspondant,
        // on part du final (dernier round) et on remonte
        const jsonRoundIndex = tournoi.bracket.length - 1 - roundNumber;
        const roundMatches = tournoi.bracket[jsonRoundIndex] || [];

        let newRoundLeft = [];
        let newRoundRight = [];

        // Pour la partie gauche, on récupère la première moitié des matchs de ce round
        let leftCounter = 0;
        roundsLeft[roundsLeft.length - 1].forEach(async pos => {
            const y1 = pos.y - ySpacing + boxHeight / 2;
            const y2 = pos.y + ySpacing - boxHeight / 2;
            const x = currentXLeft;

            // Récupération du match pour la paire courante
            const match = roundMatches[leftCounter] || {};
            ctx.strokeRect(x - boxWidth / 2, y1 - boxHeight / 2, boxWidth, boxHeight);
            ctx.fillText(match.team1 ? match.team1.name : "???", x, y1);

            const team1LogoPath = match.team1.logo;
            if (team1LogoPath) {
                const team1Logo = await loadImage(team1LogoPath);
                ctx.drawImage(team1Logo, x - boxWidth / 2, y1 - boxHeight / 2, boxHeight, boxHeight);
            }

            ctx.strokeRect(x - boxWidth / 2, y2 - boxHeight / 2, boxWidth, boxHeight);
            ctx.fillText(match.team2 ? match.team2.name : "???", x, y2);

            const team2LogoPath = match.team2.logo;
            if (team2LogoPath) {
                const team2Logo = await loadImage(team2LogoPath);
                ctx.drawImage(team2Logo, x - boxWidth / 2, y2 - boxHeight / 2, boxHeight, boxHeight);
            }

            // Tracer les lignes reliant les encadrés au round suivant
            ctx.beginPath();
            ctx.moveTo(pos.x - boxWidth / 2, pos.y);
            ctx.lineTo(pos.x - roundSpacing / 2, pos.y);
            ctx.lineTo(pos.x - roundSpacing / 2, y1);
            ctx.lineTo(x + boxWidth / 2, y1);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(pos.x - boxWidth / 2, pos.y);
            ctx.lineTo(pos.x - roundSpacing / 2, pos.y);
            ctx.lineTo(pos.x - roundSpacing / 2, y2);
            ctx.lineTo(x + boxWidth / 2, y2);
            ctx.stroke();

            newRoundLeft.push({ x, y: y1 });
            newRoundLeft.push({ x, y: y2 });
            leftCounter++; // Un match par paire (2 boîtes)
        });

        // Pour la partie droite, on récupère la deuxième moitié des matchs du round
        // On commence à l'index égal à la moitié de la longueur
        let rightCounter = Math.floor(roundMatches.length / 2);
        roundsRight[roundsRight.length - 1].forEach(async pos => {
            const y1 = pos.y - ySpacing + boxHeight / 2;
            const y2 = pos.y + ySpacing - boxHeight / 2;
            const x = currentXRight;

            const match = roundMatches[rightCounter] || {};
            ctx.strokeRect(x - boxWidth / 2, y1 - boxHeight / 2, boxWidth, boxHeight);
            ctx.fillText(match.team1 ? match.team1.name : "???", x, y1);

            const team1LogoPath = match.team1.logo;
            if (team1LogoPath) {
                const team1Logo = await loadImage(team1LogoPath);
                ctx.drawImage(team1Logo, x - boxWidth / 2, y1 - boxHeight / 2, boxHeight, boxHeight);
            }

            ctx.strokeRect(x - boxWidth / 2, y2 - boxHeight / 2, boxWidth, boxHeight);
            ctx.fillText(match.team2 ? match.team2.name : "???", x, y2);

            const team2LogoPath = match.team2.logo;
            if (team2LogoPath) {
                const team2Logo = await loadImage(team2LogoPath);
                ctx.drawImage(team2Logo, x - boxWidth / 2, y2 - boxHeight / 2, boxHeight, boxHeight);
            }

            ctx.beginPath();
            ctx.moveTo(pos.x + boxWidth / 2, pos.y);
            ctx.lineTo(pos.x + roundSpacing / 2, pos.y);
            ctx.lineTo(pos.x + roundSpacing / 2, y1);
            ctx.lineTo(x - boxWidth / 2, y1);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(pos.x + boxWidth / 2, pos.y);
            ctx.lineTo(pos.x + roundSpacing / 2, pos.y);
            ctx.lineTo(pos.x + roundSpacing / 2, y2);
            ctx.lineTo(x - boxWidth / 2, y2);
            ctx.stroke();

            newRoundRight.push({ x, y: y1 });
            newRoundRight.push({ x, y: y2 });
            rightCounter++;
        });

        roundsLeft.push(newRoundLeft);
        roundsRight.push(newRoundRight);

        roundNumber++;
        currentTeams *= 2;
        currentXLeft -= roundSpacing;
        currentXRight += roundSpacing;
    }

    return canvas.toBuffer('image/png');
}

/**
 * Récupère les matchs pour le StringSelectMenu
 * @param {string} tournoiId - ID du tournoi
 * @returns {Array} - Liste des options pour le StringSelectMenu
 */
function getMatchesForSelectMenu(tournoiId) {
    let tournois = loadJson(filePath, []);
    let tournoi = tournois.find(t => t.id === tournoiId);

    if (!tournoi || !tournoi.bracket) {
        return [];
    }

    let matches = [];
    let matchId = 0;

    // Parcourir tous les rounds
    for (let roundIndex = 0; roundIndex < tournoi.bracket.length; roundIndex++) {
        const round = tournoi.bracket[roundIndex];
        for (let match of round) {
            if (match.team1 && match.team2 && !match.winner) {
                const team1Name = match.team1.name;
                const team2Name = match.team2.name;
                matches.push({
                    label: `${team1Name} vs ${team2Name}`,
                    value: `${matchId}`
                });
            }
            matchId++;
        }
        matchId = 0;
    }

    return matches;
}


/**
 * Supprime un tournoi du fichier JSON et son dossier correspondant.
 * @param {string} tournoiId - ID du tournoi à supprimer
 * @returns {boolean} - True si le tournoi a été supprimé avec succès, sinon False
 */
function supprimerUnTournoi(tournoiId) {
    let tournois = loadJson(filePath, []);
    const index = tournois.findIndex(t => t.id === tournoiId);

    if (index === -1) {
        console.error(`Tournoi avec l'ID ${tournoiId} non trouvé.`);
        return false;
    }

    // Supprimer le tournoi du fichier JSON
    tournois.splice(index, 1);
    saveJson(filePath, tournois);

    // Supprimer le dossier du tournoi
    const tournoiDir = path.join(tournoisDir, tournoiId);
    if (fs.existsSync(tournoiDir)) {
        fs.rmdirSync(tournoiDir, { recursive: true });
    } else {
        console.error(`Dossier du tournoi avec l'ID ${tournoiId} non trouvé.`);
        return false;
    }

    return true;
}

/**
 * Récupère les équipes pour le StringSelectMenu
 * @param {Object} tournoi - Objet tournoi contenant les équipes
 * @returns {Array} - Liste des options pour le StringSelectMenu
 */
function getTeamsForSelectMenu(tournoi) {
    if (!tournoi.equipes || !Array.isArray(tournoi.equipes)) {
        return [];
    }

    return tournoi.equipes.map(team => ({
        label: `Équipe ${team.name}`, // Utiliser le nom de l'équipe pour le label
        value: team.id // Utiliser l'ID de l'équipe pour la valeur
    }));
}

/**
 * Crée un menu déroulant pour sélectionner une équipe dans un tournoi
 * @param {Object} tournoi - Objet tournoi contenant les équipes
 * @returns {ActionRowBuilder} - Composant ActionRowBuilder avec le menu déroulant
 */
function getTeamSelectMenu(tournoi) {
    const teams = getTeamsForSelectMenu(tournoi);

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`selectTeamLogo:${tournoi.id}`)
        .setPlaceholder('Sélectionnez l\'équipe')
        .addOptions(teams);

    const row = new ActionRowBuilder().addComponents(selectMenu);
    return row;
}

module.exports = {
    generateBracketStructure,
    generateTournamentBracketImage,
    getMatchesForSelectMenu,
    supprimerUnTournoi,
    getTeamsForSelectMenu,
    getTeamSelectMenu
};
