# QR Code Generator

A full-stack QR code generator application with a React frontend and Express.js backend.

![QR Code Generator Screenshot](https://via.placeholder.com/800x600.png?text=QR+Code+Generator+Screenshot)

## Features

- Generate QR codes from text, URLs, or other data
- Customizable QR code appearance:
  - Color customization (dark/light colors)
  - Logo upload
  - Error correction level selection
  - QR code type selection (URL, text, email, etc.)
- Dark mode support
- Responsive design
- Rate-limited API for security
- Health check endpoint
- Comprehensive form validation
- Real-time QR code preview

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Context API for state management
- Jest and React Testing Library for testing
- Axios for API communication
- React Hook Form for form management

### Backend
- Express.js with TypeScript
- QRCode library for QR generation
- Rate limiting middleware
- CORS support
- Jest for testing
- Zod for request validation

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/qr-code-generator.git
cd qr-code-generator
```

2. Install dependencies for both frontend and backend:
```bash
cd frontend && npm install
cd ../backend && npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=3001
NODE_ENV=development
```

## Usage

### Development

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

3. Open your browser to http://localhost:3000

### Production

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Start the backend server:
```bash
cd backend
npm start
```

## API Documentation

### POST /api/qr-code
Generate a QR code

**Request Body:**
```json
{
  "data": "https://example.com",
  "options": {
    "color": {
      "dark": "#000000",
      "light": "#ffffff"
    },
    "errorCorrectionLevel": "H",
    "logo": "data:image/png;base64,...", // optional
    "type": "url" // url|text|email|phone|sms
  }
}
```

**Response:**
```json
{
  "qrCode": "data:image/png;base64,..."
}
```

### GET /api/health
Health check endpoint

**Response:**
```json
{
  "status": "ok"
}
```

## Project Structure

```
qr-code-generator/
├── backend/
│   ├── src/
│   │   ├── controllers/        # API controllers
│   │   ├── services/           # Business logic
│   │   ├── __tests__/          # Unit tests
│   │   └── index.ts            # Server entry point
├── frontend/
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── ColorPicker.tsx # Color selection component
│   │   │   ├── CustomizationPanel.tsx # Main customization form
│   │   │   ├── InputField.tsx  # Form input component
│   │   │   ├── LogoUploader.tsx # Logo upload component
│   │   │   ├── QRCodeGenerator.tsx # Main QR code generation logic
│   │   │   ├── QRPreview.tsx   # QR code preview component
│   │   │   ├── QRTypeSelector.tsx # QR type selection
│   │   │   └── Sidebar.tsx     # Navigation sidebar
│   │   ├── context/            # React context
│   │   ├── services/           # API services
│   │   └── App.tsx             # Main application
```

## Testing

Run tests for both frontend and backend:

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

### Testing Strategy

- **Frontend:**
  - Component rendering tests
  - Form validation tests
  - Context API tests
  - Integration tests for API calls
  - Snapshot testing for UI components

- **Backend:**
  - API endpoint tests
  - QR code generation tests
  - Validation tests
  - Error handling tests

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

Please follow the existing code style and include tests for new features.

### Code Style Guidelines

- Use TypeScript types consistently
- Follow React best practices (functional components, hooks)
- Use Tailwind utility classes for styling
- Keep components small and focused
- Write meaningful commit messages
- Include JSDoc comments for complex functions