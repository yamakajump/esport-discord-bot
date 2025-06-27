# Discord Tournament Bot

## Overview

This project is a powerful Discord bot designed to manage and organize tournaments within a Discord server. It allows users to create, list, and delete tournaments, add teams, assign team logos, and automatically generate and update tournament brackets with a visually appealing image. The bot is built using [discord.js](https://discord.js.org/), and leverages several utility libraries for file management, image generation, and more.

---

## Features

- **Tournament Creation:** Create tournaments with customizable names, team counts, colors, and background images.
- **Team Management:** Add teams to tournaments, assign unique names, and upload custom logos.
- **Bracket Generation:** Automatically generate and update tournament brackets as teams are added and matches are played.
- **Interactive UI:** Use Discord buttons, select menus, and modals for a seamless user experience.
- **Persistent Storage:** All tournament data is stored in JSON files for persistence.
- **Admin Controls:** Only tournament creators can delete or modify their tournaments.
- **Visual Bracket Images:** Brackets are rendered as images and updated in real-time.

---

## Project Structure

```
esport-discord-bot/
│
├── index.js                # Main entry point, bot initialization
├── commands/               # Slash command definitions and handlers
│   └── tournoi/            # Tournament-related subcommands
├── buttons/                # Button interaction handlers
├── selectMenus/            # Select menu interaction handlers
├── modals/                 # Modal (form) interaction handlers
├── utils/                  # Utility functions (file management, tournament logic)
├── data/                   # Persistent data (tournaments, config)
├── images/                 # Default and uploaded images
├── events/                 # Discord event handlers
├── package.json            # Project dependencies and scripts
└── .env                    # Environment variables (not included in repo)
```

---

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd esport-discord-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file at the root with:
   ```
   TOKEN=your_discord_bot_token
   ID=your_discord_application_id
   ```

4. **Run the bot:**
   ```bash
   node index.js
   ```

---

## Main Files and Their Roles

### `index.js`
- **Purpose:** Entry point of the bot. Loads commands and events, registers slash commands with Discord, and starts the bot.
- **Key Actions:**
  - Loads all commands from `commands/`.
  - Loads all event handlers from `events/`.
  - Registers commands with Discord using the REST API.
  - Logs in the bot using the token from `.env`.

---

## Commands

### `/tournoi` (Main Tournament Command)
- **Subcommands:**
  - `/tournoi setup` — Create a new tournament with options for name, team count, date, colors, and background image.
  - `/tournoi list` — List all tournaments, optionally filtered by user.
  - `/tournoi delete` — Delete a tournament you created.
  - `/tournoi logo` — Add a logo to a team in your tournament.

#### Subcommand Files

- **`setup.js`**: Handles tournament creation, including validation, color/image customization, and initial message with action buttons.
- **`list.js`**: Lists all tournaments, with optional filtering by creator.
- **`delete.js`**: Allows a user to delete one of their tournaments, with confirmation.
- **`logo.js`**: Handles uploading and assigning a logo to a team.

---

## Buttons

- **`addTeam.js`**: Opens a modal to add a new team to a tournament.
- **`setWinner.js`**: Lets users select the winner of a match, updates the bracket, and regenerates the bracket image.
- **`confirmDelete.js`**: Confirms and executes the deletion of a tournament.
- **`cancelDelete.js`**: Cancels the tournament deletion process.
- **`cancelTournament.js`**: Cancels the creation of a tournament.
- **`returnToSelection.js`**: Returns to the match selection menu after viewing or updating a match.

---

## Select Menus

- **`matchSelect.js`**: Lets users select a match to update or view, then presents winner selection buttons.
- **`selectDeleteTournament.js`**: Lets users select which tournament to delete if they have multiple.
- **`selectTeamLogo.js`**: Lets users select which team to assign a logo to.
- **`selectTournamentLogo.js`**: Lets users select which tournament to assign a team logo in, if they have multiple tournaments.

---

## Modals

- **`teamModal.js`**: Modal form for adding a new team to a tournament, including validation for unique names and max team count.

---

## Utilities

### `utils/fileManager.js`
- **`loadJson(filePath, defaultValue)`**: Loads a JSON file, or initializes it with a default value if it doesn't exist.
- **`saveJson(filePath, data)`**: Saves data to a JSON file, creating directories as needed.

### `utils/tournamentUtils.js`
- **Tournament Data Management:**
  - `getTeamById`, `getTeamNameById`, `getTeamLogoById`: Retrieve team info from tournament data.
  - `generateBracketStructure`: Generates the bracket structure for a tournament (supports only powers of 2).
  - `generateTournamentBracketImage`: Creates a visual image of the tournament bracket.
  - `getMatchesForSelectMenu`: Returns a list of ongoing matches for selection.
  - `getTeamsForSelectMenu`, `getTeamSelectMenu`: Helpers for select menus.
  - `supprimerUnTournoi`: Deletes a tournament and its associated data.

---

## Data Storage

- **`data/tournois.json`**: Stores all tournament data, including teams, matches, and bracket structure.
- **`data/config.json`**: Stores bot configuration (if needed).

---

## How It Works

1. **Creating a Tournament:**  
   Use `/tournoi setup` to create a tournament. The bot validates your input, creates the tournament, and posts an interactive message with buttons to add teams or cancel.

2. **Adding Teams:**  
   Click "Add Team" to open a modal. Enter a unique team name. When the max number of teams is reached, the bracket is generated.

3. **Assigning Logos:**  
   Use `/tournoi logo` to upload a logo for a team. The bot guides you through selecting the tournament and team.

4. **Managing Matches:**  
   As the tournament progresses, use the match select menu to pick a match and set the winner. The bracket image updates automatically.

5. **Deleting a Tournament:**  
   Use `/tournoi delete` to remove a tournament you created. The bot confirms your choice before deletion.

---

## Dependencies

- [discord.js](https://discord.js.org/) — Discord API library
- [dotenv](https://www.npmjs.com/package/dotenv) — Loads environment variables
- [canvas](https://www.npmjs.com/package/canvas) — For bracket image generation
- [axios](https://www.npmjs.com/package/axios) — For downloading images
- [uuid](https://www.npmjs.com/package/uuid) — For unique IDs

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Contributing

Feel free to open issues or pull requests to improve the bot!

---

## FAQ

**Q: Can I use this bot for any type of tournament?**  
A: Yes! As long as the number of teams is a power of 2 (2, 4, 8, 16, 32), you can use it for any competition.

**Q: Where are images and data stored?**  
A: All data is stored in the `data/` directory. Uploaded images are stored in subfolders by tournament.

**Q: How do I reset or remove all tournaments?**  
A: Delete or clear the `data/tournois.json` file.

---

## File/Function Reference

Below is a summary of the main files and their functions:

| File/Folder                | Purpose/Functions                                                                 |
|----------------------------|----------------------------------------------------------------------------------|
| `index.js`                 | Bot entry point, loads commands/events, registers with Discord, starts the bot   |
| `commands/tournoi/`        | Tournament commands: setup, list, delete, logo                                   |
| `buttons/`                 | Button handlers: add team, set winner, confirm/cancel delete, etc.               |
| `selectMenus/`             | Select menu handlers: match selection, team/logo selection, tournament deletion   |
| `modals/`                  | Modal handlers: add team form                                                    |
| `utils/fileManager.js`     | JSON file load/save utilities                                                    |
| `utils/tournamentUtils.js` | Tournament logic: bracket generation, team/match helpers, image generation        |
| `data/`                    | Persistent storage for tournaments and config                                    |
| `images/`                  | Default and uploaded images                                                      |

---

If you need more details on any specific function or file, let me know!

---

## Key Functions: Detailed Usage & Examples

### utils/fileManager.js

#### `loadJson(filePath, defaultValue)`
- **Description:** Loads a JSON file from disk. If the file does not exist, it creates it with the provided default value.
- **Usage Example:**
  ```js
  const tournois = loadJson('./data/tournois.json', []);
  ```
  This ensures that the tournament list is always available, even if the file is missing.

#### `saveJson(filePath, data)`
- **Description:** Saves a JavaScript object as JSON to the specified file. Creates directories if needed.
- **Usage Example:**
  ```js
  saveJson('./data/tournois.json', tournois);
  ```
  This persists the current state of tournaments to disk.

---

### utils/tournamentUtils.js

#### `generateBracketStructure(tournoiId)`
- **Description:** Generates the bracket structure for a tournament, ensuring the number of teams is a power of 2. Updates the tournament data with the bracket.
- **Usage Example:**
  ```js
  generateBracketStructure('some-tournament-id');
  ```
  Called when the last team is added to a tournament, to prepare the matches.

#### `generateTournamentBracketImage(tournoiId)`
- **Description:** Creates a PNG image of the tournament bracket, including team names and logos, and saves it to disk.
- **Usage Example:**
  ```js
  const imagePath = await generateTournamentBracketImage('some-tournament-id');
  ```
  Used to visually display the bracket in Discord after each update.

#### `getTeamById(tournoiId, teamId)`
- **Description:** Retrieves a team object from a tournament by its ID.
- **Usage Example:**
  ```js
  const team = getTeamById('tournament-id', 'team-id');
  ```
  Used throughout the code to fetch team details for display or updates.

#### `getMatchesForSelectMenu(tournoiId)`
- **Description:** Returns a list of ongoing matches (not yet completed) for a tournament, formatted for Discord select menus.
- **Usage Example:**
  ```js
  const matches = getMatchesForSelectMenu('tournament-id');
  ```
  Used to let users pick which match to update or view.

#### `supprimerUnTournoi(tournoiId)`
- **Description:** Deletes a tournament and its associated data from storage.
- **Usage Example:**
  ```js
  const success = supprimerUnTournoi('tournament-id');
  ```
  Used when a user confirms tournament deletion.

---

### Example: Adding a Team

1. User clicks the "Add Team" button.
2. The bot opens a modal (form) for the team name.
3. On submission, the bot:
   - Validates the name is unique and the tournament is not full.
   - Adds the team to the tournament data using `saveJson`.
   - If the tournament is now full, calls `generateBracketStructure` and `generateTournamentBracketImage`.
   - Updates the Discord message with the new bracket image.

---

### Example: Setting a Match Winner

1. User selects a match from the select menu.
2. The bot displays buttons for each team.
3. User clicks the button for the winning team.
4. The bot:
   - Updates the bracket with the winner.
   - Advances the winner to the next round using bracket logic.
   - Calls `generateTournamentBracketImage` to update the visual.
   - Updates the Discord message with the new bracket image and available matches.

---

## Conclusion

This Discord Tournament Bot project is a comprehensive and modular solution for managing e-sport or gaming tournaments within a Discord community. It demonstrates a wide range of technical and organizational skills, including:

- **Full-Stack JavaScript Development:** Leveraging Node.js, Discord.js, and various libraries for file and image management.
- **Event-Driven Architecture:** Using Discord's event system to create a responsive and interactive user experience.
- **Data Persistence:** Implementing robust data storage and retrieval using JSON files, ensuring that tournament data is never lost.
- **User Experience Design:** Creating intuitive workflows with buttons, select menus, and modals for seamless interaction.
- **Image Processing:** Dynamically generating tournament brackets as images, combining logic and visual design.
- **Security and Permissions:** Ensuring only tournament creators can modify or delete their tournaments, protecting user data.

### Educational Value
This project is ideal for demonstrating:
- Real-world application of asynchronous programming in JavaScript.
- Integration of third-party APIs (Discord, Canvas, Axios).
- Modular code organization and separation of concerns.
- Handling user input and validation in a multi-user environment.
- Practical use of version control and environment configuration.

### Possible Improvements & Extensions
- **Database Integration:** Migrate from JSON files to a database (e.g., MongoDB, PostgreSQL) for scalability.
- **Web Dashboard:** Add a web interface for managing tournaments outside Discord.
- **More Tournament Formats:** Support for round-robin, double elimination, or custom formats.
- **Localization:** Add multi-language support for broader accessibility.
- **Notifications & Scheduling:** Integrate reminders and match scheduling features.
- **Statistics & History:** Track team performance and tournament history over time.

### Final Thoughts
This bot is not only a functional tool for Discord communities but also a strong portfolio piece, showcasing your ability to design, implement, and document a complete software solution. It can be adapted for various use cases, extended with new features, and serves as a solid foundation for more ambitious projects in the future.

If you have any questions, want to contribute, or need help deploying or extending the bot, feel free to reach out!

---

## Architecture Overview

The bot follows a modular, event-driven architecture:
- **index.js** initializes the bot, loads commands and events, and starts the Discord client.
- **commands/** contains all slash command logic, organized by feature.
- **buttons/**, **selectMenus/**, **modals/** handle interactive Discord UI elements.
- **utils/** provides reusable logic for file management and tournament operations.
- **data/** stores persistent tournament and configuration data.
- **events/** contains handlers for Discord events (e.g., bot ready, interaction create).

All user actions are processed asynchronously, and the bot updates Discord messages in real time based on user input.

---

## Troubleshooting Guide

**Common Issues & Solutions:**
- **Bot does not start:**
  - Check that your `.env` file is present and contains a valid Discord bot token and application ID.
  - Ensure all dependencies are installed (`npm install`).
- **Commands not appearing in Discord:**
  - Make sure the bot has permission to register slash commands in your server.
  - Try restarting the bot to re-register commands.
- **Bracket image not generated:**
  - Ensure the `canvas` library is installed and your system has the required dependencies (see [canvas installation guide](https://www.npmjs.com/package/canvas)).
- **File permission errors:**
  - Make sure the bot has write access to the `data/` and `images/` directories.
- **Bot crashes on interaction:**
  - Check the logs for error messages and ensure all required files exist.

---

## Glossary

- **Bracket:** The visual representation of tournament rounds and matches.
- **Slash Command:** A Discord command starting with `/`, registered by the bot.
- **Modal:** A pop-up form in Discord for user input.
- **Select Menu:** A dropdown menu in Discord for choosing options.
- **Button:** An interactive UI element in Discord messages.
- **Guild:** A Discord server.
- **Embed:** A rich content message in Discord, often used for displaying tournament info.

---

## Testing the Bot

1. **Unit Testing:**
   - You can write tests for utility functions in `utils/` using a framework like Jest or Mocha.
2. **Manual Testing:**
   - Run the bot in a test Discord server.
   - Try all commands: create, list, delete tournaments, add teams, assign logos, and set match winners.
   - Test edge cases: duplicate team names, max teams reached, deleting non-existent tournaments, etc.
3. **Error Handling:**
   - Intentionally trigger errors (e.g., missing fields, invalid input) to verify user feedback and error messages.

---

## Security & Privacy

- **Token Security:** Never share your Discord bot token or commit it to version control.
- **User Data:** Tournament and team data is stored locally in JSON files. No personal data is shared externally.
- **Permissions:** The bot only requires permissions necessary for managing messages and interactions.
- **File Uploads:** Uploaded images are stored in the `data/` directory and are not accessible outside the server.

---

## Error Handling & Logging

- All major actions are wrapped in try/catch blocks to prevent crashes.
- Errors are logged to the console for debugging.
- User-facing errors are displayed as ephemeral messages in Discord, so only the user sees them.
- You can extend logging by integrating with services like Sentry or by writing logs to a file.

---

## Acknowledgements

- Thanks to the maintainers of [discord.js](https://discord.js.org/), [canvas](https://www.npmjs.com/package/canvas), and [axios](https://www.npmjs.com/package/axios) for their excellent libraries.
- Special thanks to classmates, teachers, and the open-source community for support and inspiration.
- Project inspired by the need for easy, interactive tournament management in Discord communities.

---

## Contact

For questions, suggestions, or contributions, please open an issue or contact the project maintainer.

**Contact:** gabriel.rouchon@epitech.eu  
**Role:** Admin of the Hive Project

--- 