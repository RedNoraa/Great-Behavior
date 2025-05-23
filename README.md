# Great-Behavior
First attempt at a repository

Page hosted at https://www.rednoraa.com/best-behavior-game

## Hosting the HTML file

The playable game resides in `index.html`. Open it with your browser or upload
the file along with `styles.css`, `main.js`, `app.js` and `config.js` to any web
server to host it online.

## Configuring API URLs

Edit `config.js` and set `GOOGLE_SHEETS_WEB_APP_URL` to the deployment URL from
your Google Apps Script. You can also change `BACKGROUND_MUSIC_URL` to point to
an MP3 file that should play during the game.

## Deploying the Google Apps Script

1. Create a new project at <https://script.google.com>.
2. Paste the contents of the file `Google App Script` into the project.
3. Insert your spreadsheet ID in the calls to `SpreadsheetApp.openById(...)`.
4. Choose **Deploy** → **New deployment**, select **Web app** and set the access
   permissions you need.
5. Copy the resulting web app URL and set it as the value for
   `GOOGLE_SHEETS_WEB_APP_URL` in `config.js`.

### Roster formatting

Rosters are stored in the `Rosters` sheet of your Google Spreadsheet. Each row
begins with the roster name followed by player names in the remaining columns.

Visit the hosted page at
[https://www.rednoraa.com/best-behavior-game](https://www.rednoraa.com/best-behavior-game)
to see the game in action.
