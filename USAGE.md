# Image Format Converter - Usage Guide

## Quick Start

1. **Install Dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Run the Application**:
   ```bash
   npm start
   ```
   Or double-click `start.bat` on Windows

3. **For Development** (with DevTools):
   ```bash
   npm run dev
   ```
   Or double-click `start-dev.bat` on Windows

## How to Use the Application

### Step 1: Add Images
- **Drag & Drop**: Drag image files directly into the drop zone
- **File Picker**: Click "Select Files" to browse and select images
- **Supported Input Formats**: JPEG, PNG, GIF, WebP, TIFF, BMP, ICO, SVG, AVIF, HEIC, HEIF

### Step 2: Configure Settings
- **Output Format**: Choose from JPEG, PNG, WebP, AVIF, TIFF, BMP
- **Quality**: Adjust compression quality (1-100%)
  - Higher values = better quality, larger file size
  - Lower values = smaller file size, reduced quality
- **Output Directory**: Select where converted images will be saved

### Step 3: Convert
- Click "Convert Images" to start the process
- Monitor progress in real-time
- Check the log for detailed conversion results

## Format Recommendations

### JPEG
- **Best for**: Photographs, images with many colors
- **Quality**: 70-85% for web, 90-95% for print
- **File Size**: Small to medium

### PNG
- **Best for**: Images with transparency, graphics, screenshots
- **Quality**: Lossless compression
- **File Size**: Medium to large

### WebP
- **Best for**: Web images, modern browsers
- **Quality**: 70-85% provides excellent compression
- **File Size**: Very small

### AVIF
- **Best for**: Next-generation web images
- **Quality**: 60-80% provides superior compression
- **File Size**: Smallest

### TIFF
- **Best for**: Professional photography, archival
- **Quality**: High quality, lossless options
- **File Size**: Large

### BMP
- **Best for**: Simple graphics, compatibility
- **Quality**: Uncompressed
- **File Size**: Very large

## Tips for Best Results

1. **Batch Processing**: Process similar images together with the same settings
2. **Quality Settings**: 
   - Use 85% for general web use
   - Use 95% for high-quality prints
   - Use 70% for thumbnails or previews
3. **Format Selection**:
   - JPEG for photos
   - PNG for graphics with transparency
   - WebP for modern web applications
   - AVIF for cutting-edge compression

## Troubleshooting

### Common Issues

**Application won't start**:
- Make sure Node.js is installed
- Run `npm install` to install dependencies
- Check that all files are in the correct locations

**Images not converting**:
- Verify the input file is a valid image
- Check that you have write permissions to the output directory
- Ensure sufficient disk space

**HEIC files not working**:
- HEIC support depends on system libraries
- Try converting HEIC to JPEG first using another tool

**Performance issues**:
- Process fewer images at once
- Use lower quality settings for large batches
- Close other applications to free up memory

### Error Messages

**"No valid image files found"**: 
- Check that your files have supported extensions
- Verify files are not corrupted

**"Error selecting output directory"**:
- Choose a directory you have write access to
- Avoid system directories

**"Conversion failed"**:
- Check the detailed log for specific error information
- Try converting one file at a time to isolate issues

## Building for Distribution

To create an executable for distribution:

```bash
npm run build
```

This will create platform-specific installers in the `dist` folder.

## System Requirements

- **Operating System**: Windows 10+, macOS 10.14+, or Linux
- **Memory**: 4GB RAM minimum, 8GB recommended for large images
- **Disk Space**: 500MB for application + space for converted images
- **Node.js**: Version 16 or higher

## Support

For issues or questions:
1. Check this usage guide
2. Review the README.md file
3. Check the application logs in the progress section
4. Ensure all dependencies are properly installed