# Great-Behavior
First attempt at a repository
Page hosted at https://www.rednoraa.com/best-behavior-game

## Configuration
Edit `config.js` with your own Google Apps Script Web App URL and the ID of the spreadsheet the script should write to. Example:

```javascript
const CONFIG = {
  GOOGLE_SHEETS_WEB_APP_URL: 'YOUR_WEB_APP_URL',
  SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID'
};
```

Include this file in your webpage before loading `app.js`:

```html
<script src="config.js"></script>
<script src="app.js"></script>
```

The same file can be added to your Google Apps Script project so the script
and the webpage share the same constants. Simply create a new file named
`config.js` in the Apps Script editor and paste the contents of the repository's
`config.js` file.
