/**
 * Models for the Task Scheduler application
 */

// Task model
class Task {
    constructor(data = {}) {
        this.id = data.id || this._generateId();
        this.title = data.title || '';
        this.description = data.description || '';
        this.due_date = data.due_date || '';
        this.estimated_hours = data.estimated_hours || 0;
        this.hours_completed = data.hours_completed || 0;
        this.status = data.status || 'pending';
        this.created_at = data.created_at || new Date().toISOString();
    }

    _generateId() {
        return Date.now() + Math.floor(Math.random() * 10000);
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            due_date: this.due_date,
            estimated_hours: this.estimated_hours,
            hours_completed: this.hours_completed,
            status: this.status,
            created_at: this.created_at
        };
    }

    static fromJSON(json) {
        return new Task(json);
    }

    // Get progress as a percentage
    getProgressPercentage() {
        if (this.estimated_hours <= 0) return 0;
        const percentage = (this.hours_completed / this.estimated_hours) * 100;
        return Math.min(Math.round(percentage), 100);
    }

    // Check if task is overdue
    isOverdue() {
        if (this.status === 'completed') return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dueDate = new Date(this.due_date);
        dueDate.setHours(0, 0, 0, 0);

        return dueDate < today;
    }

    // Get remaining hours for the task
    getRemainingHours() {
        return Math.max(this.estimated_hours - this.hours_completed, 0);
    }
}

// TaskLog model for logging progress
class TaskLog {
    constructor(data = {}) {
        this.id = data.id || this._generateId();
        this.task_id = data.task_id || null;
        this.log_date = data.log_date || '';
        this.hours = data.hours || 0;
        this.created_at = data.created_at || new Date().toISOString();
    }

    _generateId() {
        return Date.now() + Math.floor(Math.random() * 10000);
    }

    toJSON() {
        return {
            id: this.id,
            task_id: this.task_id,
            log_date: this.log_date,
            hours: this.hours,
            created_at: this.created_at
        };
    }

    static fromJSON(json) {
        return new TaskLog(json);
    }
}// models.js for Task Scheduler
