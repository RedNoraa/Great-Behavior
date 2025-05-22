# Great-Behavior
First attempt at a repository

Page hosted at https://www.rednoraa.com/best-behavior-game

## Hosting the HTML file

The playable game resides in the file `Game Code HTML`. Rename this file to
`index.html` and open it with your browser. You can also upload it to any web
server to host it online.

## Setting `GOOGLE_SHEETS_WEB_APP_URL`

Inside the HTML file search for the line that defines `GOOGLE_SHEETS_WEB_APP_URL`
(around line 156). Replace the URL shown there with the deployment URL from your
Google Apps Script.

## Deploying the Google Apps Script

1. Create a new project at <https://script.google.com>.
2. Paste the contents of the file `Google App Script` into the project.
3. Insert your spreadsheet ID in the calls to `SpreadsheetApp.openById(...)`.
4. Choose **Deploy** → **New deployment**, select **Web app** and set the access
   permissions you need.
5. Copy the resulting web app URL and set it as the value for
   `GOOGLE_SHEETS_WEB_APP_URL` in the HTML file.

Visit the hosted page at
[https://www.rednoraa.com/best-behavior-game](https://www.rednoraa.com/best-behavior-game)
to see the game in action.
