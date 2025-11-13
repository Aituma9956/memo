# Azure DevOps Deployment Guide

## Overview
This guide explains how to deploy your React app using Azure DevOps with GitHub integration.

## Prerequisites
- Azure DevOps account
- GitHub repository
- Azure subscription (for hosting)

## Setup Steps

### 1. Connect GitHub to Azure DevOps
1. Go to your Azure DevOps project
2. Navigate to Pipelines > Pipelines
3. Click "Create Pipeline"
4. Select "GitHub" as your code source
5. Authorize Azure DevOps to access your GitHub repository

### 2. Choose Pipeline Configuration
You have two main options for Azure deployment:

#### Option A: Azure Static Web Apps (Recommended)
- Use `azure-pipelines.yml`
- Best for React SPAs
- Automatic global CDN
- Free tier available

#### Option B: Azure App Service
- Use `azure-pipelines-simple.yml`
- More traditional web hosting
- Better for apps with backend APIs

### 3. Required Variables
Set these variables in your Azure DevOps pipeline:

**For Static Web Apps:**
- `AZURE_STATIC_WEB_APPS_API_TOKEN`: Get this from Azure portal when creating Static Web App

**For App Service:**
- `AZURE_SUBSCRIPTION`: Your Azure subscription ID
- `AZURE_WEBAPP_NAME`: Name of your Azure Web App

### 4. Pipeline Files

**Main Pipeline (`azure-pipelines.yml`)**
- Full deployment pipeline with build and deploy stages
- Uses Node.js 18
- Sets CI=false to avoid treating warnings as errors
- Publishes to Azure Static Web Apps

**Simple Pipeline (`azure-pipelines-simple.yml`)**
- Simplified pipeline for Azure App Service
- Creates a zip file for deployment
- Good for traditional hosting scenarios

### 5. Build Configuration

The project includes several build commands:
- `npm run build`: Standard build
- `npm run build:azure`: Optimized for Azure (no source maps)
- `npm run serve`: Local testing of production build

### 6. Azure-Specific Files

**web.config** (in public folder)
- Handles React Router routing on Azure App Service
- Ensures all routes redirect to index.html

**Environment Variables**
- CI=false: Prevents build failure on linting warnings
- GENERATE_SOURCEMAP=false: Reduces build size

## Troubleshooting

### Common Issues:

1. **Build Fails with ESLint Errors**
   - Solution: CI is set to false to treat warnings as warnings, not errors

2. **Routing Issues**
   - Solution: web.config file handles SPA routing on Azure

3. **Build Takes Too Long**
   - Solution: Source maps disabled for faster builds

### Build Verification
Run locally to test:
```bash
npm run build:azure
npm run serve
```

Then visit http://localhost:3000 to verify the build works correctly.

## Deployment Process

1. Push code to GitHub main branch
2. Azure DevOps automatically triggers pipeline
3. Pipeline builds the React app
4. Artifacts are deployed to Azure
5. App is available at your Azure URL

## Files Created for Azure DevOps:
- `azure-pipelines.yml` - Main pipeline configuration
- `azure-pipelines-simple.yml` - Alternative pipeline
- `public/web.config` - Azure App Service routing configuration
- `.env.production` - Production environment variables