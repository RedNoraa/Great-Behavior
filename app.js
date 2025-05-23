import { CONFIG } from './config.js';

async function loadRosters() {
    try {
        const response = await fetch(`${CONFIG.GOOGLE_SHEETS_WEB_APP_URL}?action=getRosters`);
        if (!response.ok) {
            throw new Error('Failed to fetch roster data');
        }
        const data = await response.json();
        Object.keys(data).forEach(name => {
            rosters[name] = data[name];
        });
        updateRosterOptions();
    } catch (error) {
        console.error('Error loading rosters:', error);
        if (error instanceof TypeError) {
            displayErrorMessage('Network error while loading rosters.');
        } else {
            displayErrorMessage('Failed to load roster data.');
        }
    }
}

document.addEventListener('DOMContentLoaded', loadRosters);
