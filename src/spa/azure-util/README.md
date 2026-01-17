# Azure Util

A modern Angular single-page application (SPA) designed to provide utility tools for Azure resource management and exploration. Built with Angular 21 and Angular Material for a responsive and intuitive user experience.

## 🚀 Features

- **Model Explorer**: Browse and explore Azure models with filtering and search capabilities
- **Modern UI**: Built with Angular Material and Bootstrap Icons
- **Responsive Design**: Mobile-first responsive layout
- **Azure Static Web App Ready**: Pre-configured for deployment to Azure Static Web Apps
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: User-friendly loading indicators and progress bars

## 🛠️ Tech Stack

- **Framework**: Angular 21.1
- **UI Components**: Angular Material 21.1
- **Icons**: Bootstrap Icons
- **Styling**: Angular Material Theme + Custom SCSS
- **Testing**: Vitest
- **Build Tool**: Angular CLI
- **Package Manager**: npm

## 📋 Prerequisites

- **Node.js**: >= 22.13.0
- **npm**: >= 10.9.2

## 🚀 Getting Started

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd azure-util
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

To start the development server:

```bash
npm start
# or
ng serve
```

The application will be available at `http://localhost:4200/`. The app will automatically reload when you make changes to the source files.

### Building for Production

To build the project for production:

```bash
npm run build
# or
ng build
```

Build artifacts will be stored in the `dist/` directory, optimized for performance and ready for deployment.

### Development Build with Watch Mode

For continuous building during development:

```bash
npm run watch
# or
ng build --watch --configuration development
```

## 🧪 Testing

### Unit Tests

Run unit tests using Vitest:

```bash
npm test
# or
ng test
```

### End-to-End Tests

Angular CLI doesn't include e2e testing by default. You can add your preferred e2e testing framework (Cypress, Playwright, etc.).

## 🏗️ Project Structure

```
src/
├── app/
│   ├── core/                    # Core services and components
│   │   ├── components/          # Reusable UI components
│   │   └── services/            # Application services
│   │       ├── error-handler.service.ts
│   │       ├── http-interceptor.service.ts
│   │       ├── loader.service.ts
│   │       └── snackbar.service.ts
│   ├── layouts/                 # Application layouts
│   │   └── main-layout.ts
│   └── modules/                 # Feature modules
│       └── model-explorer/      # Model explorer feature
│           ├── components/
│           ├── model-explorer.data.service.ts
│           └── model-explorer.routes.ts
├── assets/                      # Static assets
├── environments/                # Environment configurations
└── staticwebapp.config.json     # Azure Static Web App configuration
```

## 🔧 Key Services

- **Error Handler Service**: Global error handling and user notifications
- **HTTP Interceptor Service**: Request/response intercepting and processing
- **Loader Service**: Managing loading states across the application
- **Snackbar Service**: User notifications and feedback

## 🌟 Features Overview

### Model Explorer
The Model Explorer module provides tools for browsing and analyzing Azure models with:
- Advanced filtering capabilities
- Search functionality
- Tabular data presentation
- Real-time data updates

## 🚀 Deployment

This application is configured for deployment to Azure Static Web Apps with the included `staticwebapp.config.json` configuration file.

### Azure Static Web Apps
1. Build the application: `npm run build`
2. Deploy the `dist/` folder contents to Azure Static Web Apps
3. The app will handle routing automatically with the fallback configuration

## 🛠️ Development

### Code Scaffolding

Generate new components:
```bash
ng generate component component-name
```

View all available schematics:
```bash
ng generate --help
```

### Code Style

The project uses Prettier for code formatting with the following configuration:
- Print width: 100 characters
- Single quotes preferred
- Angular HTML parser for templates

## 📖 Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Material Documentation](https://material.angular.io/)
- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)

## 📄 License

This project is private and proprietary.
