/**
 * Data Manager for the Task Scheduler application
 * Handles all data operations including persistence to localStorage
 */

class DataManager {
    constructor() {
        this.tasks = [];
        this.taskLogs = [];
        this.loadData();
    }

    // Save all data to localStorage
    saveData() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks.map(task => task.toJSON())));
        localStorage.setItem('taskLogs', JSON.stringify(this.taskLogs.map(log => log.toJSON())));
    }

    // Load data from localStorage
    loadData() {
        try {
            const tasksData = localStorage.getItem('tasks');
            const taskLogsData = localStorage.getItem('taskLogs');

            if (tasksData) {
                this.tasks = JSON.parse(tasksData).map(taskData => Task.fromJSON(taskData));
            }

            if (taskLogsData) {
                this.taskLogs = JSON.parse(taskLogsData).map(logData => TaskLog.fromJSON(logData));
            }
        } catch (error) {
            console.error('Error loading data from localStorage:', error);
            this.tasks = [];
            this.taskLogs = [];
        }
    }

    // Clear all data from localStorage
    clearAllData() {
        this.tasks = [];
        this.taskLogs = [];
        localStorage.removeItem('tasks');
        localStorage.removeItem('taskLogs');
        // Display flash message and reload
        uiController.showFlashMessage('All data has been reset.', 'success');
        router.navigateTo('dashboard');
    }

    // Export data as JSON
    exportData() {
        const data = {
            tasks: this.tasks.map(task => task.toJSON()),
            taskLogs: this.taskLogs.map(log => log.toJSON()),
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        // Create download link
        const exportFileDefaultName = 'task-scheduler-data.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    // Import data from JSON
    importData() {
        const importDataText = document.getElementById('importDataModal').querySelector('#importDataText').value;

        try {
            const data = JSON.parse(importDataText);

            if (data.tasks && Array.isArray(data.tasks)) {
                this.tasks = data.tasks.map(taskData => Task.fromJSON(taskData));
            }

            if (data.taskLogs && Array.isArray(data.taskLogs)) {
                this.taskLogs = data.taskLogs.map(logData => TaskLog.fromJSON(logData));
            }

            this.saveData();

            // Close modal and show success message
            const modal = bootstrap.Modal.getInstance(document.getElementById('importDataModal'));
            modal.hide();

            uiController.showFlashMessage('Data imported successfully!', 'success');
            router.navigateTo('dashboard');
        } catch (error) {
            console.error('Error importing data:', error);
            uiController.showFlashMessage('Error importing data. Please check the format and try again.', 'danger');
        }
    }

    // Task operations
    getAllTasks() {
        return this.tasks;
    }

    getPendingTasks() {
        return this.tasks.filter(task => task.status === 'pending');
    }

    getTaskById(taskId) {
        return this.tasks.find(task => task.id == taskId);
    }

    addTask(taskData) {
        const task = new Task(taskData);
        this.tasks.push(task);
        this.saveData();
        return task;
    }

    updateTask(taskId, updatedData) {
        const index = this.tasks.findIndex(task => task.id == taskId);
        if (index !== -1) {
            // Merge existing task with updated data
            const updatedTask = new Task({
                ...this.tasks[index].toJSON(),
                ...updatedData
            });

            this.tasks[index] = updatedTask;
            this.saveData();
            return updatedTask;
        }
        return null;
    }

    deleteTask(taskId) {
        const index = this.tasks.findIndex(task => task.id == taskId);
        if (index !== -1) {
            // Remove the task
            this.tasks.splice(index, 1);

            // Also remove all logs for this task
            this.taskLogs = this.taskLogs.filter(log => log.task_id != taskId);

            this.saveData();
            return true;
        }
        return false;
    }

    // Task Log operations
    getLogsForTask(taskId) {
        return this.taskLogs.filter(log => log.task_id == taskId);
    }

    addTaskLog(taskId, logData) {
        const taskLog = new TaskLog({
            task_id: taskId,
            ...logData
        });

        this.taskLogs.push(taskLog);

        // Update task hours_completed
        const task = this.getTaskById(taskId);
        if (task) {
            const taskLogs = this.getLogsForTask(taskId);
            const totalHours = taskLogs.reduce((sum, log) => sum + log.hours, 0);

            // Update task with new hours_completed
            this.updateTask(taskId, {
                hours_completed: totalHours,
                // If task is complete, update status
                status: totalHours >= task.estimated_hours ? 'completed' : task.status
            });
        }

        this.saveData();
        return taskLog;
    }

    // Schedule calculation
    calculateSchedule(daysAhead = 7) {
        const schedule = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Initialize schedule with empty arrays for each day
        for (let i = 0; i < daysAhead; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
            const dateStr = this._formatDate(currentDate);
            schedule[dateStr] = [];
        }

        // Get pending tasks
        const pendingTasks = this.getPendingTasks();

        // For each task, calculate remaining work and distribute across days
        for (const task of pendingTasks) {
            // Calculate remaining hours
            const remainingHours = task.getRemainingHours();
            if (remainingHours <= 0) continue;

            // Calculate days until due date
            const dueDate = new Date(task.due_date);
            dueDate.setHours(0, 0, 0, 0);

            const daysUntilDue = Math.max(
                Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24)),
                1 // At least 1 day even if due date has passed
            );

            // If due date is today or has passed, schedule all remaining work today
            if (daysUntilDue <= 1) {
                const todayStr = this._formatDate(today);
                if (schedule[todayStr]) {
                    schedule[todayStr].push({
                        task_id: task.id,
                        title: task.title,
                        hours: this._roundToNearestHalf(remainingHours)
                    });
                }
                continue;
            }

            // If due date is within our planning horizon
            const daysToSchedule = Math.min(daysUntilDue, daysAhead);

            // Distribute hours evenly
            let dailyHours = remainingHours / daysToSchedule;

            // Round to nearest 0.5 hour, minimum 0.5 hour
            dailyHours = Math.max(0.5, this._roundToNearestHalf(dailyHours));

            // Ensure we don't allocate more hours than remaining
            let totalAllocated = 0;

            for (let i = 0; i < daysToSchedule; i++) {
                const currentDate = new Date(today);
                currentDate.setDate(today.getDate() + i);
                const dateStr = this._formatDate(currentDate);

                // Skip if we've already allocated all hours
                if (totalAllocated >= remainingHours) break;

                // Adjust for weekends (reduce weekend work by 20% if possible)
                let adjustedHours = dailyHours;
                if (currentDate.getDay() === 0 || currentDate.getDay() === 6) { // Weekend (0 = Sunday, 6 = Saturday)
                    adjustedHours = Math.max(0.5, this._roundToNearestHalf(dailyHours * 0.8));
                }

                // Don't exceed remaining hours
                const hoursToday = Math.min(adjustedHours, remainingHours - totalAllocated);

                // Round to nearest 0.5 hour
                const roundedHoursToday = this._roundToNearestHalf(hoursToday);

                // Add to schedule
                if (roundedHoursToday > 0 && schedule[dateStr]) {
                    schedule[dateStr].push({
                        task_id: task.id,
                        title: task.title,
                        hours: roundedHoursToday
                    });
                    totalAllocated += roundedHoursToday;
                }
            }
        }

        // Balance workload (limit to 5 hours per day, prioritizing tasks with earlier due dates)
        for (const dateStr in schedule) {
            const dayTasks = schedule[dateStr];
            let totalHours = dayTasks.reduce((sum, task) => sum + task.hours, 0);

            // If a day has more than 5 hours, redistribute
            if (totalHours > 5) {
                // Sort tasks by due date (earliest first)
                dayTasks.sort((a, b) => {
                    const taskA = this.getTaskById(a.task_id);
                    const taskB = this.getTaskById(b.task_id);
                    return new Date(taskA.due_date) - new Date(taskB.due_date);
                });

                // Reset hours allocation
                let totalAllocated = 0;
                for (const task of dayTasks) {
                    // Allocate at most 5 hours per day, prioritizing tasks with earlier due dates
                    const remaining = 5 - totalAllocated;
                    if (remaining <= 0) {
                        task.hours = 0;
                    } else {
                        task.hours = Math.min(task.hours, remaining);
                        task.hours = this._roundToNearestHalf(task.hours);
                        totalAllocated += task.hours;
                    }
                }
            }
        }

        return schedule;
    }

    // Helper function to format dates consistently
    _formatDate(date) {
        return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    }

    // Helper function to round to nearest 0.5
    _roundToNearestHalf(value) {
        return Math.round(value * 2) / 2;
    }
}

// Initialize the data manager
const dataManager = new DataManager();// data-manager.js for Task Scheduler
