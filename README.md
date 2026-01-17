# Azure Util

A utility tool that lists Azure regions and explores available AI models, deployment types, and quotas.

## Overview

Azure Util is a full-stack web application that provides an easy-to-use interface for querying Azure services. It calls Azure REST APIs to retrieve information about:

- **Azure Regions**: List all available Azure locations and their details
- **AI Models**: Explore AI models available in different regions
- **Model Information**: View deployment types, capabilities, SKUs, and quotas

The application consists of a .NET Web API backend that handles Azure service integration and an Angular frontend that provides a modern, responsive user interface.

## Live Sample
[https://polite-wave-072b12400.4.azurestaticapps.net](Azure AI Model Explorer) 
![Available AI Models](https://stzlblog.blob.core.windows.net/app-images/az_explorer_1.png)
![RPM / Quota Calculator](https://stzlblog.blob.core.windows.net/app-images/az_explorer_2.png)


## Architecture

### Backend (.NET 10.0 Web API)
- **Framework**: ASP.NET Core Web API

### Frontend (Angular SPA)
- **Framework**: Angular 21.1.0
- **UI**: Angular Material Design


## Prerequisites

### Development Environment
- .NET 10.0 SDK
- Node.js 22.13.0 or higher
- npm 10.9.2 or higher
- Git

### Azure Setup
- **Azure Subscription**: Active Azure subscription
- **Microsoft Entra ID Application**: Register your client application with Microsoft Entra ID
  - Most Azure services require valid credentials before calling their APIs
  - Note: This includes Azure Resource Manager providers and classic deployment models
- **Permissions**: Ensure your application has "Reader" permission on your Azure subscription
- **Azure Key Vault**: Set up a Key Vault instance for secure secrets management

### Authentication
The application uses Azure Default Credential for authentication. Configure your development environment with one of:
- Azure CLI: `az login`
- Visual Studio: Sign in with your Azure account
- Environment variables for service principal authentication


## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd src/backend/AzureUtil.API
   ```

2. Configure Azure Key Vault in `appsettings.json`:
   ```json
   {
     "Azure": {
       "KeyVault": "your-keyvault-name"
     }
   }
   ```

3. Restore NuGet packages:
   ```bash
   dotnet restore
   ```

4. Run the API:
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:7000` (or the port specified in `launchSettings.json`).

### Frontend Setup

1. Navigate to the Angular application directory:
   ```bash
   cd src/spa/azure-util
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

The Angular app will be available at `http://localhost:4200`.

## Development

### Running Tests


### Building for Production


## Project Structure

```
├── README.md
└── src/
    ├── backend/
    │   ├── AzureUtil.API/          # Main Web API project
    │   │   ├── Controllers/        # API controllers
    │   │   ├── Models/            # Data models
    │   │   ├── Services/          # Business logic services
    │   │   └── Config/            # Configuration classes
    │   └── AzureUtil.Tests/       # Unit tests
    └── spa/
        └── azure-util/            # Angular SPA
            ├── src/
            │   ├── app/           # Angular application
            │   ├── assets/        # Static assets
            │   └── environments/ # Environment configurations
            └── public/            # Public assets
```

5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues, please:
- Open an issue in the GitHub repository
- Check existing issues for similar problems
- Provide detailed information about your environment and the issue
