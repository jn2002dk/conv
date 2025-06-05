const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const heicConvert = require('heic-convert');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    show: false
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for file operations
ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      {
        name: 'Images',
        extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'tiff', 'tif', 'bmp', 'ico', 'svg', 'avif', 'heic', 'heif']
      }
    ]
  });
  
  return result.filePaths;
});

ipcMain.handle('select-output-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  return result.filePaths[0];
});

ipcMain.handle('convert-image', async (event, { inputPath, outputPath, format, quality }) => {
  try {
    const inputBuffer = fs.readFileSync(inputPath);
    const inputExt = path.extname(inputPath).toLowerCase();
    
    let processedBuffer;
    
    // Handle HEIC/HEIF files
    if (inputExt === '.heic' || inputExt === '.heif') {
      processedBuffer = await heicConvert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: quality / 100
      });
    } else {
      processedBuffer = inputBuffer;
    }
    
    // Use Sharp for conversion
    let sharpInstance = sharp(processedBuffer);
    
    // Apply format-specific options
    switch (format.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        sharpInstance = sharpInstance.jpeg({ quality: quality });
        break;
      case 'png':
        sharpInstance = sharpInstance.png({ 
          quality: quality,
          compressionLevel: Math.floor((100 - quality) / 10)
        });
        break;
      case 'webp':
        sharpInstance = sharpInstance.webp({ quality: quality });
        break;
      case 'avif':
        sharpInstance = sharpInstance.avif({ quality: quality });
        break;
      case 'tiff':
      case 'tif':
        sharpInstance = sharpInstance.tiff({ quality: quality });
        break;
      case 'bmp':
        sharpInstance = sharpInstance.bmp();
        break;
      case 'gif':
        // Sharp doesn't support GIF output, convert to PNG instead
        sharpInstance = sharpInstance.png({ quality: quality });
        break;
      default:
        throw new Error(`Unsupported output format: ${format}`);
    }
    
    const outputBuffer = await sharpInstance.toBuffer();
    fs.writeFileSync(outputPath, outputBuffer);
    
    return { success: true };
  } catch (error) {
    console.error('Conversion error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-image-info', async (event, filePath) => {
  try {
    const stats = fs.statSync(filePath);
    let metadata;
    
    try {
      metadata = await sharp(filePath).metadata();
    } catch (sharpError) {
      // Fallback for formats Sharp can't read
      console.log(`Sharp couldn't read ${filePath}, using fallback`);
      return {
        name: path.basename(filePath),
        size: stats.size,
        width: 'Unknown',
        height: 'Unknown',
        format: path.extname(filePath).slice(1).toUpperCase() || 'Unknown',
        path: filePath
      };
    }
    
    return {
      name: path.basename(filePath),
      size: stats.size,
      width: metadata.width || 'Unknown',
      height: metadata.height || 'Unknown',
      format: metadata.format ? metadata.format.toUpperCase() : path.extname(filePath).slice(1).toUpperCase(),
      path: filePath
    };
  } catch (error) {
    console.error('Error getting image info:', error);
    throw error;
  }
});