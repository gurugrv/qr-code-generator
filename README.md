# QR Code Generator

A full-stack QR code generator application with a React frontend and Express.js backend.

## Table of Contents
- [Features](#features)
- [Supported QR Code Types](#supported-qr-code-types)
- [Technology Stack](#technology-stack)
- [Environment Requirements](#environment-requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Development Workflow](#development-workflow)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [CI/CD Pipeline](#cicd-pipeline)
- [Deployment](#deployment)
- [Error Handling](#error-handling)
- [Performance Considerations](#performance-considerations)
- [Security Best Practices](#security-best-practices)
- [Internationalization](#internationalization)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- Generate QR codes from text, URLs, or other data
- Customizable QR code appearance:
  - Color customization (dark/light colors)
  - Logo upload
  - Error correction level selection
  - QR code type selection (URL, text, email, etc.)
- Dark mode support
- Responsive design
- Comprehensive error handling and reporting
- Rate-limited API for security
- Health check endpoint
- Comprehensive form validation
- Real-time QR code preview
- Redux Toolkit for state management
- Error boundary for React components
- Performance monitoring
- Toast notifications
- Comprehensive error handling with custom error classes
- Redux Toolkit state management with multiple feature slices
- Storybook component development environment
- Performance monitoring system
- Form validation utilities
- API service implementation with error reporting

## Supported QR Code Types

The application supports generating the following types of QR codes:

### URL QR Codes
- Generates QR codes that open websites when scanned
- Supports full URLs including http:// and https://
- Example: https://example.com

### Text QR Codes
- Generates QR codes containing plain text
- Useful for sharing messages, notes, or information
- Supports up to 4296 alphanumeric characters
- Example: "This is a sample text message"

### Email QR Codes
- Generates QR codes that create pre-filled emails when scanned
- Includes recipient, subject, and body fields
- Opens the user's default email client
- Example: mailto:example@domain.com?subject=Hello&body=This%20is%20a%20test

### Phone QR Codes
- Generates QR codes that initiate phone calls when scanned
- Includes country code and phone number
- Opens the user's phone dialer with the number pre-filled
- Example: tel:+15551234567

### SMS QR Codes
- Generates QR codes that create pre-filled SMS messages when scanned
- Includes phone number and message body
- Opens the user's messaging app with the number and message pre-filled
- Example: sms:+15551234567?body=Hello%20there

## Technology Stack

### Frontend
- React 18.2.0 with TypeScript 4.9.5
- Redux Toolkit 2.5.0 for state management
  - Redux Persist for state persistence
  - Redux State Sync for cross-tab state synchronization
  - Redux Logger for development debugging
- Tailwind CSS 3.3.2 with plugins:
  - @tailwindcss/forms
  - @tailwindcss/typography
  - @tailwindcss/aspect-ratio
- Sentry 8.50.0 for error tracking and performance monitoring
- Jest 29.7.0 and React Testing Library for testing
- Storybook 8.5.0 for component development and documentation
- QRCode 1.5.4 for QR code generation
- Web Vitals for performance monitoring

### Backend
- Express.js 4.18.2 with TypeScript 5.2.2
- QRCode 1.5.4 for QR code generation
- Express Rate Limit 7.5.0 for API protection
- Winston 3.17.0 with daily rotate file for logging
- CORS 2.8.5 for cross-origin resource sharing
- Body Parser for request parsing
- Jest 29.7.0 for testing
- Nodemon 3.1.9 for development

## Environment Requirements

- Node.js v18.x or higher
- npm v9.x or higher
- Git 2.x or higher
- Recommended IDE: Visual Studio Code with the following extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features
  - Jest Runner
  - Error Lens
  - GitLens
  - Storybook Snippets

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
```env
PORT=3001
NODE_ENV=development
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=15*60*1000
RATE_LIMIT_MAX=100
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
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

4. Start Storybook for component development:
```bash
cd frontend
npm run storybook
```

### Testing

Run tests for both frontend and backend:

```bash
# Frontend tests
cd frontend
npm run test           # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Backend tests
cd backend
npm run test           # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Production

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Build the backend:
```bash
cd backend
npm run build
```

3. Start the production server:
```bash
cd backend
npm start
```

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

**Success Response:**
```json
{
  "qrCode": "data:image/png;base64,..."
}
```

**Error Responses:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "data": ["Required"],
      "options.color.dark": ["Invalid hex color"]
    }
  }
}
```

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later"
  }
}
```

### Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `QR_GENERATION_ERROR`: Failed to generate QR code
- `INTERNAL_SERVER_ERROR`: Unexpected server error
- `INVALID_LOGO`: Invalid logo image format or size
- `UNSUPPORTED_TYPE`: Unsupported QR code type

### GET /api/health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-19T03:37:11.000Z"
}
```

### GET /api/metrics
Application metrics endpoint

**Response:**
```json
{
  "uptime": 12345,
  "memoryUsage": {
    "rss": 12345678,
    "heapTotal": 1234567,
    "heapUsed": 123456,
    "external": 12345
  },
  "responseTimes": {
    "average": 123,
    "max": 456
  },
  "requests": {
    "total": 1234,
    "perSecond": 12.34
  }
}
```

## Project Structure

```
qr-code-generator/
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
├── backend/
│   ├── jest.config.js
│   ├── logs/
│   │   ├── access-2025-01-18.log
│   │   ├── access-2025-01-19.log
│   │   ├── error-2025-01-18.log
│   │   ├── error-2025-01-19.log
│   ├── package-lock.json
│   ├── package.json
│   ├── src/
│   │   ├── __tests__/
│   │   │   ├── qrController.test.ts
│   │   │   ├── qrService.test.ts
│   │   ├── config/
│   │   ├── controllers/
│   │   │   ├── qrController.ts
│   │   ├── errors/
│   │   │   ├── errorCodes.ts
│   │   │   ├── errorTypes.ts
│   │   │   ├── HttpError.ts
│   │   │   ├── index.ts
│   │   │   ├── QRGenerationError.ts
│   │   │   ├── ValidationError.ts
│   │   ├── index.ts
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts
│   │   ├── services/
│   │   │   ├── qrService.ts
│   │   ├── shared/
│   │   │   ├── types/
│   │   │   │   ├── index.ts
│   │   ├── utils/
│   │   │   ├── logger.ts
│   │   ├── validators.ts
│   ├── tsconfig.json
├── frontend/
│   ├── .gitignore
│   ├── jest.config.js
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   ├── robots.txt
│   ├── src/
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── ColorPicker.tsx
│   │   │   ├── CustomizationPanel.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── InputField.tsx
│   │   │   ├── LogoUploader.tsx
│   │   │   ├── MainContent.tsx
│   │   │   ├── QRCodeGenerator.tsx
│   │   │   ├── QRForm.tsx
│   │   │   ├── QRFormConfig.ts
│   │   │   ├── QRPreview.tsx
│   │   │   ├── QRTypeSelector.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Toasts.tsx
│   │   │   ├── __tests__/
│   │   │   │   ├── QRCodeGenerator.test.tsx
│   │   ├── context/
│   │   │   ├── QRCodeContext.tsx
│   │   ├── features/
│   │   │   ├── appSettings/
│   │   │   │   ├── appSettingsSlice.ts
│   │   │   ├── error/
│   │   │   │   ├── errorSlice.ts
│   │   │   ├── qrConfig/
│   │   │   │   ├── qrConfigSlice.ts
│   │   │   ├── toast/
│   │   │   │   ├── toastSlice.ts
│   │   │   ├── userPreferences/
│   │   │   │   ├── userPreferencesSlice.ts
│   │   ├── hooks/
│   │   │   ├── useDebounce.ts
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── logo.svg
│   │   ├── reportWebVitals.ts
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── errorReporting.ts
│   │   ├── setupTests.ts
│   │   ├── shared/
│   │   │   ├── types/
│   │   │   │   ├── index.ts
│   │   ├── store/
│   │   │   ├── errorMiddleware.ts
│   │   │   ├── errorTracker.ts
│   │   │   ├── performanceMonitor.ts
│   │   │   ├── store.ts
│   │   ├── stories/
│   │   │   ├── button.css
│   │   │   ├── Button.stories.ts
│   │   │   ├── Button.tsx
│   │   │   ├── Configure.mdx
│   │   │   ├── header.css
│   │   │   ├── Header.stories.ts
│   │   │   ├── Header.tsx
│   │   │   ├── page.css
│   │   │   ├── Page.stories.ts
│   │   │   ├── Page.tsx
│   │   │   ├── assets/
│   │   │   │   ├── accessibility.png
│   │   │   │   ├── accessibility.svg
│   │   │   │   ├── addon-library.png
│   │   │   │   ├── assets.png
│   │   │   │   ├── avif-test-image.avif
│   │   │   │   ├── context.png
│   │   │   │   ├── discord.svg
│   │   │   │   ├── docs.png
│   │   │   │   ├── figma-plugin.png
│   │   │   │   ├── github.svg
│   │   │   │   ├── share.png
│   │   │   │   ├── styling.png
│   │   │   │   ├── testing.png
│   │   │   │   ├── theming.png
│   │   │   │   ├── tutorials.svg
│   │   │   │   ├── youtube.svg
│   │   ├── types/
│   │   │   ├── index.ts
│   │   ├── utils/
│   │   │   ├── validation.ts
├── shared/
```

## Error Handling

The application implements comprehensive error handling:

### Frontend
- Error boundary for React components
- Redux error handling middleware
- Toast notifications for user feedback
- Sentry integration for error tracking and monitoring
  - Automatic error capturing
  - Performance monitoring
  - Release tracking
  - User feedback collection
- Form validation errors
- Cross-tab error synchronization

### Backend
- Custom error classes (HttpError, ValidationError, QRGenerationError)
- Error handling middleware
- Rate limiting
- Request validation
- Winston logging with daily rotation
- Structured error responses

### Error Handling Examples

**Frontend Error Handling:**
```typescript
// ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logErrorToService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

**Backend Error Handling:**
```typescript
// errorHandler.ts
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details: err.details
      }
    });
  }
  
  if (err instanceof RateLimitError) {
    return res.status(429).json({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests, please try again later'
      }
    });
  }

  // Log unexpected errors
  logger.error('Unexpected error:', err);
  
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  });
};
```

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
- Follow Redux Toolkit patterns
- Use async/await for asynchronous code
- Prefer functional programming patterns

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Adding or modifying tests
- chore: Maintenance tasks

**Example:**
```
feat(qr-generator): add color customization options

- Added color picker component
- Integrated color selection with QR generation
- Added validation for color inputs

Closes #123
```

## License

MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted...

## Development Workflow

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch for features
- `feature/*`: Feature branches
- `hotfix/*`: Critical bug fixes
- `release/*`: Release preparation branches

### Workflow Steps
1. Create a new branch from `develop`
2. Implement your feature/bugfix
3. Write tests for your changes
4. Run linter and tests
5. Create a pull request to `develop`
6. After code review and CI pipeline success, merge to `develop`
7. When ready for release, create a release branch from `develop`

## Code Quality

The project uses the following tools to maintain code quality:

- **ESLint**: JavaScript/TypeScript linter with custom rules
- **Prettier**: Code formatter with consistent style
- **Husky**: Git hooks for pre-commit linting
- **Lint-staged**: Run linters on staged files
- **Commitlint**: Conventional commit message validation

To set up code quality tools:

```bash
# Install dependencies
npm install -g eslint prettier

# Run linter
npm run lint

# Run formatter
npm run format

# Set up Git hooks
npm run prepare
```

## CI/CD Pipeline

The project includes a GitHub Actions workflow for CI/CD:

- **Linting**: Runs ESLint on all TypeScript files
- **Testing**: Runs Jest tests with coverage
- **Build**: Verifies production build
- **Security**: Runs npm audit and dependency checks
- **Deployment**: Automated deployment to staging/production

## Deployment

### Deployment Options

1. **Docker**
   ```bash
   docker build -t qr-code-generator .
   docker run -p 3000:3000 qr-code-generator
   ```

2. **PM2**
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.js
   ```

3. **Kubernetes**
   ```yaml
   # Example deployment.yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: qr-code-generator
   spec:
     replicas: 3
     template:
       spec:
         containers:
         - name: qr-code-generator
           image: qr-code-generator:latest
           ports:
           - containerPort: 3000
   ```

### Required Environment Variables

**Backend:**
```env
PORT=3001
NODE_ENV=production
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=15*60*1000
RATE_LIMIT_MAX=100
CORS_ORIGIN=https://your-domain.com
JWT_SECRET=your-secret-key
REDIS_URL=redis://your-redis-url:6379
```

**Frontend:**
```env
REACT_APP_API_URL=https://api.your-domain.com
REACT_APP_SENTRY_DSN=your-sentry-dsn
REACT_APP_GA_TRACKING_ID=your-ga-tracking-id
```

## Performance Considerations

- **Frontend:**
  - Code splitting with React.lazy()
  - Memoization with React.memo() and useMemo()
  - Debounced API calls
  - Optimized image loading
  - Tree-shaking with Webpack

- **Backend:**
  - Rate limiting
  - Caching with Redis
  - Connection pooling
  - Compression middleware
  - Load balancing

## Security Best Practices

- **Frontend:**
  - Content Security Policy (CSP)
  - XSS protection
  - CSRF tokens
  - Secure cookie settings
  - HTTPS enforcement

- **Backend:**
  - Helmet middleware
  - Rate limiting
  - Input validation
  - Secure headers
  - JWT authentication
  - Role-based access control

## Internationalization

The application supports multiple languages using i18next:

1. Add new translations in `src/locales/`
2. Create language-specific JSON files
3. Use the `useTranslation` hook in components
4. Configure language detection

Example:
```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <div>{t('welcome_message')}</div>;
}
```

## Troubleshooting

### Common Issues

1. **Dependency conflicts**
   - Delete node_modules and package-lock.json
   - Run `npm cache clean --force`
   - Reinstall dependencies with `npm install`

2. **TypeScript errors**
   - Check tsconfig.json settings
   - Verify type definitions
   - Run type checking with `npm run type-check`

3. **API connection issues**
   - Verify backend is running
   - Check CORS configuration
   - Verify environment variables

4. **Build failures**
   - Check Node.js version
   - Verify TypeScript version
   - Check for circular dependencies
