# GPT Image-1 Editor

A specialized interface for editing images using OpenAI's GPT Image-1 model with high input fidelity capabilities.

## Features

### ✨ High Fidelity Image Editing
- **High Input Fidelity**: Preserve faces, logos, and fine details
- **Multi-Image Support**: Edit multiple images simultaneously
- **Inpainting**: Use mask images for precise area editing
- **Flexible Input**: Support for file upload, drag-and-drop, and URLs
- **Batch Processing**: Edit multiple images with the same prompt

### 🖼️ Results Management
- **Image Gallery**: Clean, organized display of edited images
- **Zoom & Preview**: Full-screen image viewing with zoom controls
- **Download**: Save edited images in various formats
- **Share**: Built-in sharing capabilities
- **Copy URLs**: Easy URL copying for sharing
- **Metadata Display**: View editing details and token usage

## Technical Specifications

### Supported Formats
- **Input**: PNG, JPEG, WebP, GIF (non-animated)
- **Output**: PNG, JPEG, WebP
- **Max File Size**: 50MB per image
- **Max Images**: 500 per request

### API Integration
- **Model**: GPT Image-1
- **Endpoint**: OpenAI Images API with editing capabilities
- **High Fidelity**: Preserves distinctive features with high accuracy
- **Error Handling**: Comprehensive error management

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd inputFidelityUI
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your OpenAI API key to `.env`:
```
NEXT_PUBLIC_OPENAI_API_KEY=your_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Image Editing
1. Navigate to the "Edit" tab
2. Upload one or more images (drag & drop or file picker)
3. Enter an edit prompt describing desired changes
4. Choose input fidelity:
   - **Low**: Faster processing, general editing
   - **High**: Preserves faces, logos, and fine details
5. Optionally upload a mask image for inpainting
6. Click "Edit Image"

### Best Practices

#### For Face Preservation
- Always use **High Fidelity** mode
- Place the main face in the first image for multi-image editing
- Use quality 'medium' or 'high' for best results

#### For Branding & Logos
- Use **High Fidelity** mode
- Provide clear, high-resolution logo inputs
- Describe branding requirements explicitly in prompts

#### For Product Photography
- Use **High Fidelity** for texture preservation
- Provide detailed product descriptions
- Use masking for precise area editing

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/            # React components
│   ├── ImageGenerationPanel.tsx
│   ├── ImageEditingPanel.tsx
│   └── ResultsPanel.tsx
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── utils/                 # Utility functions
│   ├── openai.ts         # OpenAI API integration
│   └── helpers.ts        # Helper functions
└── styles/               # Global styles
```

## API Integration

The application uses OpenAI's GPT Image 1 model through two main endpoints:

### Responses API (Recommended)
- Better for conversational, editable experiences
- Supports streaming with partial images
- Multi-turn editing capabilities

### Images API
- Direct image generation and editing
- Three endpoints: generations, edits, variations
- Simpler for single operations

## Token Usage

Token consumption varies based on:
- **Quality**: Low (272-400), Medium (1056-1584), High (4160-6240)
- **Size**: Square uses fewer tokens than portrait/landscape
- **Input Fidelity**: High fidelity adds 4096-6144 tokens
- **Partial Images**: Additional 100 tokens per partial image

## Error Handling

The application handles various error scenarios:
- Content policy violations
- File size limits
- Invalid formats
- API rate limits
- Network issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review OpenAI's API documentation
3. Open an issue on the repository