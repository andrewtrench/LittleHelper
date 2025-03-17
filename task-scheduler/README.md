# Task Scheduler

A client-side web application to help students manage tasks, deadlines, and study schedules. This application is designed to work on GitHub Pages and syncs data across devices using browser localStorage with import/export functionality.

## Features

- Task management (create, read, update, delete)
- Automatic scheduling of study time
- Progress tracking for tasks
- Seven-day scheduling view with 14 and 30-day options
- Data persistence using localStorage
- Import/export functionality to share data across devices
- Offline support via Service Worker
- Responsive UI for desktop and mobile
- Quick tips for productivity

## Demo

You can try out the application at: [Task Scheduler Demo](https://your-github-username.github.io/task-scheduler/)

## Setup

### Local Development

1. Clone this repository or download the source code:
   ```
   git clone https://github.com/your-github-username/task-scheduler.git
   ```

2. Navigate to the project directory:
   ```
   cd task-scheduler
   ```

3. Open `index.html` in your browser or use a local development server:
   ```
   python -m http.server 8000
   ```
   Then open your browser to `http://localhost:8000`

### Deploy to GitHub Pages

1. Create a new repository on GitHub

2. Initialize the project as a Git repository (if not already):
   ```
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. Link to your GitHub repository:
   ```
   git remote add origin https://github.com/your-github-username/task-scheduler.git
   ```

4. Push to GitHub:
   ```
   git push -u origin main
   ```

5. Go to repository Settings > Pages, and select the `main` branch as the source.

## Usage

1. **Dashboard**: View all your tasks and today's schedule.
2. **Add New Task**: Create a new task with a title, description, due date, and estimated hours.
3. **Log Progress**: Record the time spent on each task.
4. **Schedule**: View your automated study schedule.
5. **Settings**: Import/export data to sync across devices.

## Data Persistence

This application uses browser localStorage to store your tasks and progress logs. To use the application across different devices:

1. On your first device, go to Settings > Export Data to download your data as a JSON file.
2. On your second device, go to Settings > Import Data and paste the contents of the JSON file.

## Offline Support

The application includes a Service Worker for offline functionality. Once you've visited the application with an internet connection, many features will continue to work even when offline.

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 15+

## License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## Acknowledgments

- Bootstrap 5 for the UI components
- Font Awesome for icons