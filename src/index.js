const { app, BrowserWindow } = require('electron');

function renderWindow(){
    let window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        resizable: true
    });

    window.loadFile("src/index.html");
}

app.on('ready', () => {
    renderWindow();
});

app.on('window-all-closed', () => {
    app.quit();
});