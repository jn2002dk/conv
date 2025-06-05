# Image Format Converter

A desktop application built with Electron for converting images between different formats.

## Features

- **Drag & Drop Interface**: Simply drag images into the application or use the file picker
- **Multiple Format Support**: Convert between JPEG, PNG, WebP, AVIF, TIFF, BMP, HEIC, and more
- **Batch Processing**: Convert multiple images at once
- **Quality Control**: Adjust compression quality for supported formats
- **Progress Tracking**: Real-time conversion progress with detailed logs
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Supported Formats

### Input Formats
- JPEG/JPG
- PNG
- GIF
- WebP
- TIFF/TIF
- BMP
- ICO
- SVG
- AVIF
- HEIC/HEIF

### Output Formats
- JPEG
- PNG
- WebP
- AVIF
- TIFF
- BMP

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Build Executable
```bash
npm run build
```

## How to Use

1. **Launch the application**
2. **Add images** by either:
   - Dragging and dropping image files into the drop zone
   - Clicking "Select Files" to browse for images
3. **Choose conversion settings**:
   - Select output format
   - Adjust quality (1-100%)
   - Choose output directory
4. **Click "Convert Images"** to start the conversion process
5. **Monitor progress** in the progress section

## Technical Details

- Built with Electron for cross-platform desktop support
- Uses Sharp library for high-performance image processing
- Supports HEIC/HEIF conversion via heic-convert
- Secure IPC communication between main and renderer processes

## Dependencies

- **Electron**: Desktop application framework
- **Sharp**: High-performance image processing
- **heic-convert**: HEIC/HEIF format support
- **node-libheif**: Additional HEIF support

## License

MIT License - feel free to use and modify as needed.

## Troubleshooting

### Common Issues

1. **HEIC files not converting**: Make sure all dependencies are properly installed
2. **Large files taking too long**: Consider reducing quality or using a different format
3. **Out of memory errors**: Process fewer files at once or restart the application

### Performance Tips

- For batch processing, use moderate quality settings (70-85%)
- WebP and AVIF formats provide excellent compression
- PNG is best for images with transparency
- JPEG is ideal for photographs

## Contributing

Feel free to submit issues and enhancement requests!