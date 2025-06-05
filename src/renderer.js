class ImageConverter {
    constructor() {
        this.selectedFiles = [];
        this.outputDirectory = '';
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.dropZone = document.getElementById('dropZone');
        this.selectFilesBtn = document.getElementById('selectFilesBtn');
        this.filesSection = document.getElementById('filesSection');
        this.filesList = document.getElementById('filesList');
        this.settingsSection = document.getElementById('settingsSection');
        this.convertSection = document.getElementById('convertSection');
        this.outputFormat = document.getElementById('outputFormat');
        this.quality = document.getElementById('quality');
        this.qualityValue = document.getElementById('qualityValue');
        this.outputDir = document.getElementById('outputDir');
        this.selectDirBtn = document.getElementById('selectDirBtn');
        this.convertBtn = document.getElementById('convertBtn');
        this.progressSection = document.getElementById('progressSection');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.progressLog = document.getElementById('progressLog');
    }

    bindEvents() {
        // Drag and drop events
        this.dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
        this.dropZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.dropZone.addEventListener('drop', this.handleDrop.bind(this));

        // File selection
        this.selectFilesBtn.addEventListener('click', this.selectFiles.bind(this));

        // Settings
        this.quality.addEventListener('input', this.updateQualityDisplay.bind(this));
        this.selectDirBtn.addEventListener('click', this.selectOutputDirectory.bind(this));

        // Convert button
        this.convertBtn.addEventListener('click', this.convertImages.bind(this));

        // Prevent default drag behaviors on document
        document.addEventListener('dragover', (e) => e.preventDefault());
        document.addEventListener('drop', (e) => e.preventDefault());
    }

    handleDragOver(e) {
        e.preventDefault();
        this.dropZone.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.dropZone.classList.remove('drag-over');
    }

    async handleDrop(e) {
        e.preventDefault();
        this.dropZone.classList.remove('drag-over');

        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => this.isImageFile(file.name));
        
        if (imageFiles.length > 0) {
            await this.processFiles(imageFiles.map(file => file.path));
        } else {
            this.showNotification('No valid image files found', 'error');
        }
    }

    async selectFiles() {
        try {
            const filePaths = await window.electronAPI.selectFiles();
            if (filePaths && filePaths.length > 0) {
                await this.processFiles(filePaths);
            }
        } catch (error) {
            console.error('Error selecting files:', error);
            this.showNotification('Error selecting files', 'error');
        }
    }

    async processFiles(filePaths) {
        this.selectedFiles = [];
        
        for (const filePath of filePaths) {
            try {
                const fileInfo = await window.electronAPI.getImageInfo(filePath);
                this.selectedFiles.push(fileInfo);
            } catch (error) {
                console.error('Error processing file:', filePath, error);
            }
        }

        this.updateFilesDisplay();
        this.showSections();
    }

    updateFilesDisplay() {
        this.filesList.innerHTML = '';
        
        this.selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item fade-in';
            
            fileItem.innerHTML = `
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-details">
                        ${this.formatFileSize(file.size)} • 
                        ${file.width}×${file.height} • 
                        ${file.format}
                    </div>
                </div>
                <button class="file-remove" onclick="imageConverter.removeFile(${index})">Remove</button>
            `;
            
            this.filesList.appendChild(fileItem);
        });
    }

    removeFile(index) {
        this.selectedFiles.splice(index, 1);
        this.updateFilesDisplay();
        
        if (this.selectedFiles.length === 0) {
            this.hideSections();
        }
    }

    showSections() {
        this.filesSection.style.display = 'block';
        this.settingsSection.style.display = 'block';
        this.convertSection.style.display = 'block';
        
        // Add fade-in animation
        [this.filesSection, this.settingsSection, this.convertSection].forEach(section => {
            section.classList.add('fade-in');
        });
    }

    hideSections() {
        this.filesSection.style.display = 'none';
        this.settingsSection.style.display = 'none';
        this.convertSection.style.display = 'none';
        this.progressSection.style.display = 'none';
    }

    updateQualityDisplay() {
        this.qualityValue.textContent = this.quality.value;
    }

    async selectOutputDirectory() {
        try {
            const directory = await window.electronAPI.selectOutputDirectory();
            if (directory) {
                this.outputDirectory = directory;
                this.outputDir.value = directory;
            }
        } catch (error) {
            console.error('Error selecting directory:', error);
            this.showNotification('Error selecting output directory', 'error');
        }
    }

    async convertImages() {
        if (this.selectedFiles.length === 0) {
            this.showNotification('No files selected', 'error');
            return;
        }

        if (!this.outputDirectory) {
            this.showNotification('Please select an output directory', 'error');
            return;
        }

        // Show progress section and hide convert button
        this.progressSection.style.display = 'block';
        this.convertBtn.disabled = true;
        this.convertBtn.querySelector('.btn-text').style.display = 'none';
        this.convertBtn.querySelector('.btn-loader').style.display = 'inline';

        const format = this.outputFormat.value;
        const quality = parseInt(this.quality.value);
        let converted = 0;
        let errors = 0;

        this.progressLog.innerHTML = '';
        this.addLogEntry(`Starting conversion of ${this.selectedFiles.length} files...`, 'info');

        for (let i = 0; i < this.selectedFiles.length; i++) {
            const file = this.selectedFiles[i];
            const outputFileName = this.generateOutputFileName(file.name, format);
            const outputPath = `${this.outputDirectory}/${outputFileName}`;

            try {
                this.addLogEntry(`Converting ${file.name}...`, 'info');
                
                const result = await window.electronAPI.convertImage({
                    inputPath: file.path,
                    outputPath: outputPath,
                    format: format,
                    quality: quality
                });

                if (result.success) {
                    converted++;
                    this.addLogEntry(`✓ ${file.name} → ${outputFileName}`, 'success');
                } else {
                    errors++;
                    this.addLogEntry(`✗ Failed to convert ${file.name}: ${result.error}`, 'error');
                }
            } catch (error) {
                errors++;
                this.addLogEntry(`✗ Error converting ${file.name}: ${error.message}`, 'error');
            }

            // Update progress
            const progress = ((i + 1) / this.selectedFiles.length) * 100;
            this.progressFill.style.width = `${progress}%`;
            this.progressText.textContent = `${i + 1} / ${this.selectedFiles.length} files processed`;
        }

        // Conversion complete
        this.addLogEntry(`Conversion complete! ${converted} successful, ${errors} errors.`, 'info');
        
        // Reset UI
        this.convertBtn.disabled = false;
        this.convertBtn.querySelector('.btn-text').style.display = 'inline';
        this.convertBtn.querySelector('.btn-loader').style.display = 'none';

        if (errors === 0) {
            this.showNotification(`Successfully converted ${converted} images!`, 'success');
        } else {
            this.showNotification(`Converted ${converted} images with ${errors} errors. Check the log for details.`, 'warning');
        }
    }

    generateOutputFileName(originalName, format) {
        const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
        return `${nameWithoutExt}.${format}`;
    }

    addLogEntry(message, type = 'info') {
        const entry = document.createElement('div');
        entry.className = `log-entry log-${type}`;
        entry.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
        this.progressLog.appendChild(entry);
        this.progressLog.scrollTop = this.progressLog.scrollHeight;
    }

    showNotification(message, type = 'info') {
        // Simple notification - you could enhance this with a proper notification system
        console.log(`${type.toUpperCase()}: ${message}`);
        alert(message);
    }

    isImageFile(fileName) {
        const imageExtensions = [
            '.jpg', '.jpeg', '.png', '.gif', '.webp', '.tiff', '.tif', 
            '.bmp', '.ico', '.svg', '.avif', '.heic', '.heif'
        ];
        const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
        return imageExtensions.includes(ext);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Initialize the application
const imageConverter = new ImageConverter();