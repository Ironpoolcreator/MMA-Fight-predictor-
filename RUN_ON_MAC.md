# UFC Fight Prediction Platform - Mac Setup Guide

This guide will help you run the UFC Fight Prediction application on Visual Studio Code on a Mac.

## Prerequisites

1. Node.js and npm installed on your Mac
   - Check if you have them: `node -v` and `npm -v`
   - If not, install from [nodejs.org](https://nodejs.org/)

2. Visual Studio Code installed
   - Download from [code.visualstudio.com](https://code.visualstudio.com/)

3. Git installed (optional, for cloning)
   - Check if installed: `git --version`
   - If not, install from [git-scm.com](https://git-scm.com/)

## Setup Instructions

### 1. Get the Code

Either clone the repository or download and extract the ZIP file to your desired location.

Using Git:
```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Open the Project in VS Code

```bash
code .
```

Or manually:
1. Open VS Code
2. Go to File > Open Folder
3. Navigate to and select the project folder

### 3. Install Dependencies

Open a terminal in VS Code (Terminal > New Terminal) and run:

```bash
npm install
```

This will install all required packages defined in package.json.

### 4. Start the Application

Run the development server:

```bash
npm run dev
```

The application should start and be available at:
- http://localhost:8080

If you see a "port already in use" error, try these solutions:

1. Kill the process using the port:
   ```bash
   kill $(lsof -t -i:8080)
   ```

2. Or change the port in `server/index.ts` to another number (e.g., 3000, 9000)

## Using the Application

1. The application runs without requiring any API keys since it uses a statistical model for predictions.
2. Navigate to http://localhost:8080 in your browser to access the application.
3. You can:
   - Compare fighters
   - Generate fight predictions
   - View fighter statistics
   - Explore fight cards

## Troubleshooting

If you encounter any issues:

1. **Module not found errors**: Make sure you've run `npm install` completely.

2. **Port conflicts**: Follow the instructions above to change the port.

3. **Database errors**: The application uses an in-memory database by default, so no setup is required.

4. **Browser cache issues**: Try hard refreshing (Cmd+Shift+R) or opening in an incognito window.

5. **TypeScript errors**: These shouldn't prevent the application from running, but if they do, try running `npm run build` first.

## Shutdown

To stop the application, press `Ctrl+C` in the terminal where it's running.