/**
 * HTML Templates for the Task Scheduler application
 */

const templates = {
    // Dashboard template
    dashboard: function(tasks, todaySchedule) {
        return `
        <div class="row">
            <div class="col-md-8">
                <div class="card mb-4 shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h4 class="my-0 fw-normal">
                            <i class="fas fa-clipboard-list me-2"></i>My Tasks
                        </h4>
                    </div>
                    <div class="card-body">
                        ${tasks.length > 0 ? `
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Due Date</th>
                                            <th>Progress</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${tasks.map(task => `
                                            <tr class="${task.status === 'completed' ? 'table-success' : (task.isOverdue() ? 'table-danger' : '')}">
                                                <td>
                                                    ${task.title}
                                                    ${task.status === 'completed' ? '<span class="badge bg-success ms-2">Completed</span>' : ''}
                                                </td>
                                                <td>${new Date(task.due_date).toLocaleDateString()}</td>
                                                <td>
                                                    ${this.progressBar(task)}
                                                    <small class="text-muted">${task.hours_completed} / ${task.estimated_hours} hours</small>
                                                </td>
                                                <td>
                                                    <div class="btn-group btn-group-sm">
                                                        <a href="#" onclick="router.navigateTo('log-progress', {taskId: ${task.id}}); return false;" class="btn btn-outline-primary">
                                                            <i class="fas fa-clock"></i> Log
                                                        </a>
                                                        <a href="#" onclick="router.navigateTo('edit-task', {taskId: ${task.id}}); return false;" class="btn btn-outline-secondary">
                                                            <i class="fas fa-edit"></i> Edit
                                                        </a>
                                                        <button type="button" class="btn btn-outline-danger delete-btn"
                                                                data-task-id="${task.id}"
                                                                data-task-title="${task.title}">
                                                            <i class="fas fa-trash"></i> Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        ` : `
                            <div class="alert alert-info mb-0">
                                <i class="fas fa-info-circle me-2"></i>You don't have any tasks yet. <a href="#" onclick="router.navigateTo('create-task'); return false;" class="alert-link">Create a new task</a> to get started!
                            </div>
                        `}
                    </div>
                    <div class="card-footer">
                        <a href="#" onclick="router.navigateTo('create-task'); return false;" class="btn btn-primary">
                            <i class="fas fa-plus me-1"></i>Add New Task
                        </a>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="card mb-4 shadow-sm">
                    <div class="card-header bg-success text-white">
                        <h4 class="my-0 fw-normal">
                            <i class="fas fa-calendar-day me-2"></i>Today's Schedule
                        </h4>
                    </div>
                    <div class="card-body">
                        ${todaySchedule.length > 0 ? `
                            <ul class="list-group">
                                ${todaySchedule.map(taskInfo => `
                                    <li class="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>${taskInfo.title}</strong>
                                            <div class="text-muted">${taskInfo.hours} hours</div>
                                        </div>
                                        <a href="#" onclick="router.navigateTo('log-progress', {taskId: ${taskInfo.task_id}}); return false;" class="btn btn-sm btn-outline-success">
                                            <i class="fas fa-check me-1"></i>Log Progress
                                        </a>
                                    </li>
                                `).join('')}
                            </ul>

                            <div class="alert alert-info mt-3">
                                <i class="fas fa-info-circle me-1"></i>Total planned hours today: <strong>${todaySchedule.reduce((total, task) => total + task.hours, 0)}</strong>
                            </div>
                        ` : `
                            <div class="alert alert-success mb-0">
                                <i class="fas fa-check-circle me-2"></i>No tasks scheduled for today. Enjoy your free time!
                            </div>
                        `}
                    </div>
                    <div class="card-footer">
                        <a href="#" onclick="router.navigateTo('schedule'); return false;" class="btn btn-success">
                            <i class="fas fa-calendar-alt me-1"></i>View Full Schedule
                        </a>
                    </div>
                </div>

                <div class="card shadow-sm">
                    <div class="card-header bg-info text-white">
                        <h4 class="my-0 fw-normal">
                            <i class="fas fa-lightbulb me-2"></i>Quick Tips
                        </h4>
                    </div>
                    <div class="card-body">
                        <div class="list-group">
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between">
                                    <h5 class="mb-1">Schedule Daily</h5>
                                    <small><i class="fas fa-clock"></i></small>
                                </div>
                                <p class="mb-1">Log your progress daily to keep track of your study habits.</p>
                            </div>
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between">
                                    <h5 class="mb-1">Stay Focused</h5>
                                    <small><i class="fas fa-bullseye"></i></small>
                                </div>
                                <p class="mb-1">Work on one task at a time for better productivity.</p>
                            </div>
                            <div class="list-group-item list-group-item-action">
                                <div class="d-flex w-100 justify-content-between">
                                    <h5 class="mb-1">Take Breaks</h5>
                                    <small><i class="fas fa-coffee"></i></small>
                                </div>
                                <p class="mb-1">Remember to take 5-minute breaks every 25 minutes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    // Progress bar component
    progressBar: function(task) {
        const progress = task.getProgressPercentage();
        let bgClass = 'bg-danger';
        if (progress >= 75) {
            bgClass = 'bg-success';
        } else if (progress >= 25) {
            bgClass = 'bg-warning';
        }

        return `
        <div class="progress">
            <div class="progress-bar ${bgClass}"
                 role="progressbar"
                 style="width: ${progress}%"
                 aria-valuenow="${progress}"
                 aria-valuemin="0"
                 aria-valuemax="100">
                ${progress}%
            </div>
        </div>
        `;
    },

    // Task form template for create/edit
    taskForm: function(task) {
        const isEdit = !!task;
        const today = new Date().toISOString().split('T')[0];

        return `
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow">
                    <div class="card-header bg-primary text-white">
                        <h4 class="my-0 fw-normal">
                            ${isEdit ? '<i class="fas fa-edit me-2"></i>Edit Task' : '<i class="fas fa-plus me-2"></i>New Task'}
                        </h4>
                    </div>
                    <div class="card-body">
                        <form id="task-form">
                            <div class="mb-3">
                                <label for="title" class="form-label">Task Title <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="title" name="title"
                                       value="${isEdit ? task.title : ''}" required>
                                <div class="form-text">A short descriptive title for your task (e.g., "Math Assignment 1")</div>
                            </div>

                            <div class="mb-3">
                                <label for="description" class="form-label">Description</label>
                                <textarea class="form-control" id="description" name="description" rows="3">${isEdit ? task.description : ''}</textarea>
                                <div class="form-text">Optional notes or details about the task</div>
                            </div>

                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="due_date" class="form-label">Due Date <span class="text-danger">*</span></label>
                                    <input type="date" class="form-control" id="due_date" name="due_date"
                                           value="${isEdit ? task.due_date : today}" required>
                                    <div class="form-text">When is this task due?</div>
                                </div>

                                <div class="col-md-6">
                                    <label for="estimated_hours" class="form-label">Estimated Hours <span class="text-danger">*</span></label>
                                    <input type="number" class="form-control" id="estimated_hours" name="estimated_hours"
                                           value="${isEdit ? task.estimated_hours : ''}" min="0.5" step="0.5" required>
                                    <div class="form-text">How many hours will this task take? (0.5 hour increments)</div>
                                </div>
                            </div>

                            ${isEdit ? `
                                <div class="mb-3">
                                    <label for="status" class="form-label">Status</label>
                                    <select class="form-select" id="status" name="status">
                                        <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                                        <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                                    </select>
                                </div>
                            ` : ''}

                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button type="button" onclick="router.navigateTo('dashboard')" class="btn btn-secondary">
                                    <i class="fas fa-times me-1"></i>Cancel
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save me-1"></i>
                                    ${isEdit ? 'Update Task' : 'Create Task'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    // Log progress form template
    logProgressForm: function(task, logs) {
        const today = new Date().toISOString().split('T')[0];
        const progress = task.getProgressPercentage();

        let progressClass = 'bg-danger';
        if (progress >= 75) {
            progressClass = 'bg-success';
        } else if (progress >= 25) {
            progressClass = 'bg-warning';
        }

        return `
        <div class="row">
            <div class="col-md-8">
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-primary text-white">
                        <h4 class="my-0 fw-normal">
                            <i class="fas fa-clock me-2"></i>Log Progress for "${task.title}"
                        </h4>
                    </div>
                    <div class="card-body">
                        <div class="mb-4">
                            <h5>Task Details</h5>
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Due Date:</strong> ${new Date(task.due_date).toLocaleDateString()}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Status:</strong>
                                        <span class="badge ${task.status === 'completed' ? 'bg-success' : 'bg-warning'}">
                                            ${task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Estimated Hours:</strong> ${task.estimated_hours}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Hours Completed:</strong> ${task.hours_completed}</p>
                                </div>
                            </div>

                            <div class="progress mb-3">
                                <div class="progress-bar ${progressClass}"
                                     role="progressbar"
                                     style="width: ${progress}%"
                                     aria-valuenow="${progress}"
                                     aria-valuemin="0"
                                     aria-valuemax="100">
                                    ${progress}%
                                </div>
                            </div>
                        </div>

                        <form id="log-form">
                            <div class="row g-3 mb-3">
                                <div class="col-md-6">
                                    <label for="log_date" class="form-label">Date</label>
                                    <input type="date" class="form-control" id="log_date" name="log_date" value="${today}" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="hours" class="form-label">Hours Spent <span class="text-danger">*</span></label>
                                    <select class="form-select" id="hours" name="hours" required>
                                        <option value="">Select hours</option>
                                        <option value="0.5">0.5 hours (30 minutes)</option>
                                        <option value="1.0">1.0 hour</option>
                                        <option value="1.5">1.5 hours</option>
                                        <option value="2.0">2.0 hours</option>
                                        <option value="2.5">2.5 hours</option>
                                        <option value="3.0">3.0 hours</option>
                                        <option value="3.5">3.5 hours</option>
                                        <option value="4.0">4.0 hours</option>
                                        <option value="4.5">4.5 hours</option>
                                        <option value="5.0">5.0 hours</option>
                                    </select>
                                    <div class="form-text">How many hours did you spend on this task?</div>
                                </div>
                            </div>

                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button type="button" onclick="router.navigateTo('dashboard')" class="btn btn-secondary">
                                    <i class="fas fa-arrow-left me-1"></i>Back
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="fas fa-save me-1"></i>Log Progress
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                ${logs && logs.length > 0 ? `
                <div class="card shadow-sm">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0">
                            <i class="fas fa-history me-2"></i>Previous Logs
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Hours</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${logs.map(log => `
                                    <tr>
                                        <td>${new Date(log.log_date).toLocaleDateString()}</td>
                                        <td>${log.hours}</td>
                                    </tr>
                                    `).join('')}
                                </tbody>
                                <tfoot>
                                    <tr class="table-active">
                                        <th>Total</th>
                                        <th>${logs.reduce((sum, log) => sum + log.hours, 0)}</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>

            <div class="col-md-4">
                <div class="card shadow-sm">
                    <div class="card-header bg-success text-white">
                        <h5 class="mb-0">
                            <i class="fas fa-lightbulb me-2"></i>Productivity Tips
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="list-group">
                            <div class="list-group-item list-group-item-action">
                                <h5 class="mb-1">Track Accurately</h5>
                                <p class="mb-1">Log your progress as soon as you finish working to ensure accuracy.</p>
                            </div>
                            <div class="list-group-item list-group-item-action">
                                <h5 class="mb-1">Be Realistic</h5>
                                <p class="mb-1">Don't overestimate your work hours - honest tracking helps with future planning.</p>
                            </div>
                            <div class="list-group-item list-group-item-action">
                                <h5 class="mb-1">Stay Consistent</h5>
                                <p class="mb-1">Regular, shorter study sessions are often more effective than cramming.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    // Schedule view template
    schedule: function(schedule, dates) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return `
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-primary text-white">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="my-0 fw-normal">
                        <i class="fas fa-calendar-alt me-2"></i>Study Schedule
                    </h4>
                    <div>
                        <div class="btn-group">
                            <button onclick="uiController.renderSchedule(7)" class="btn btn-outline-light active">7 Days</button>
                            <button onclick="uiController.renderSchedule(14)" class="btn btn-outline-light">14 Days</button>
                            <button onclick="uiController.renderSchedule(30)" class="btn btn-outline-light">30 Days</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>This is your automated study schedule based on task deadlines and estimated hours. Each day shows the recommended tasks and time allocation.
                </div>

                <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    ${dates.map(date => {
                        const dateStr = this.formatDate(date);
                        const dayName = date.toLocaleDateString(undefined, { weekday: 'long' });
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                        const isToday = date.getTime() === today.getTime();
                        const dayTasks = schedule[dateStr] || [];

                        return `
                        <div class="col">
                            <div class="card schedule-card h-100 ${isWeekend ? 'weekend-day' : ''} ${isToday ? 'today-card' : ''}">
                                <div class="card-header ${isToday ? 'bg-primary text-white' : ''}">
                                    <h5 class="card-title mb-0">
                                        ${isToday ? '<span class="badge bg-danger me-1">Today</span>' : ''}
                                        ${date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </h5>
                                </div>
                                <div class="card-body">
                                    ${dayTasks.length > 0 ? `
                                        <ul class="list-group list-group-flush">
                                            ${dayTasks.map(taskInfo => {
                                                if (taskInfo.hours <= 0) return '';
                                                return `
                                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <strong>${taskInfo.title}</strong>
                                                        <div class="text-muted">${taskInfo.hours} hours</div>
                                                    </div>
                                                    ${isToday ? `
                                                        <a href="#" onclick="router.navigateTo('log-progress', {taskId: ${taskInfo.task_id}}); return false;" class="btn btn-sm btn-outline-primary">
                                                            <i class="fas fa-check me-1"></i>Log
                                                        </a>
                                                    ` : ''}
                                                </li>
                                                `;
                                            }).join('')}
                                        </ul>

                                        ${(() => {
                                            const totalHours = dayTasks.reduce((sum, task) => sum + task.hours, 0);
                                            return `
                                            <div class="alert ${totalHours > 4 ? 'alert-warning' : 'alert-success'} mt-3 mb-0">
                                                <i class="fas fa-clock me-1"></i>Total: <strong>${totalHours} hours</strong>
                                                ${totalHours > 4 ? `
                                                    <div class="small">This is a heavy workday! Consider adjusting if possible.</div>
                                                ` : ''}
                                            </div>
                                            `;
                                        })()}
                                    ` : `
                                        <div class="alert alert-success mb-0">
                                            <i class="fas fa-check-circle me-2"></i>No tasks scheduled for this day.
                                        </div>
                                    `}
                                </div>
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6">
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0">
                            <i class="fas fa-info-circle me-2"></i>How This Schedule Works
                        </h5>
                    </div>
                    <div class="card-body">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                                <i class="fas fa-calculator me-2 text-primary"></i>
                                <strong>Automatic Distribution:</strong> Tasks are spread evenly across available days until the due date.
                            </li>
                            <li class="list-group-item">
                                <i class="fas fa-balance-scale me-2 text-primary"></i>
                                <strong>Balanced Workload:</strong> The system tries to balance your workload, limiting daily hours.
                            </li>
                            <li class="list-group-item">
                                <i class="fas fa-calendar-week me-2 text-primary"></i>
                                <strong>Weekend Adjustment:</strong> Slightly reduced hours on weekends when possible.
                            </li>
                            <li class="list-group-item">
                                <i class="fas fa-sort-amount-down me-2 text-primary"></i>
                                <strong>Prioritization:</strong> Tasks with closer deadlines get higher priority.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="card shadow-sm mb-4">
                    <div class="card-header bg-success text-white">
                        <h5 class="mb-0">
                            <i class="fas fa-lightbulb me-2"></i>Tips for Effective Studying
                        </h5>
                    </div>
                    <div class="card-body">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                                <i class="fas fa-clock me-2 text-success"></i>
                                <strong>Follow the Pomodoro Technique:</strong> Study for 25 minutes, then take a 5-minute break.
                            </li>
                            <li class="list-group-item">
                                <i class="fas fa-water me-2 text-success"></i>
                                <strong>Stay Hydrated:</strong> Keep water nearby during study sessions.
                            </li>
                            <li class="list-group-item">
                                <i class="fas fa-mobile-alt me-2 text-success"></i>
                                <strong>Minimize Distractions:</strong> Put your phone on silent mode while studying.
                            </li>
                            <li class="list-group-item">
                                <i class="fas fa-book me-2 text-success"></i>
                                <strong>Active Learning:</strong> Take notes, create summaries, and quiz yourself.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    // Not found template
    notFound: function() {
        return `
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow-sm">
                    <div class="card-header bg-danger text-white">
                        <h4 class="my-0 fw-normal">
                            <i class="fas fa-exclamation-triangle me-2"></i>Error
                        </h4>
                    </div>
                    <div class="card-body text-center py-5">
                        <h1 class="display-1 text-danger">404</h1>
                        <h2 class="mb-4">Page Not Found</h2>
                        <p class="lead">The page you are looking for does not exist or has been moved.</p>
                        <div class="mt-5">
                            <a href="#" onclick="router.navigateTo('dashboard'); return false;" class="btn btn-primary">
                                <i class="fas fa-home me-2"></i>Return to Dashboard
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    },

    // Flash message template
    flashMessage: function(message, type = 'info') {
        return `
        <div class="alert alert-${type} alert-dismissible fade show">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
        `;
    },

    // Helper method to format date as YYYY-MM-DD
    formatDate: function(date) {
        return date.toISOString().split('T')[0];
    }
};