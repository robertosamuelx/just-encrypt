const dotenv = require('dotenv');
dotenv.config();
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

function renderWindow(){
    let window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        resizable: true,
        icon: url.format({
            pathname: path.join(__dirname, '../img/icon.png')
        }) 
    });

    window.loadFile("src/index.html");
}

app.on('ready', () => {
    renderWindow();
});

app.on('window-all-closed', () => {
    app.quit();
});