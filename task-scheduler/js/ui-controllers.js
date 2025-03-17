/**
 * UI Controllers for the Task Scheduler application
 * Handles rendering of UI components and event handling
 */

class UIController {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.flashMessagesElement = document.getElementById('flash-messages');

        // Setup delete task modal event
        document.getElementById('confirmDeleteBtn').addEventListener('click', this.handleDeleteTask.bind(this));
    }

    // Render the dashboard view
    renderDashboard() {
        // Get all tasks
        const tasks = dataManager.getAllTasks();

        // Calculate today's schedule
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = templates.formatDate(today);
        const schedule = dataManager.calculateSchedule();
        const todaySchedule = schedule[todayStr] || [];

        // Render the dashboard
        this.contentElement.innerHTML = templates.dashboard(tasks, todaySchedule);

        // Setup delete buttons
        this.setupDeleteButtons();
    }

    // Render the task form (create or edit)
    renderTaskForm(taskId = null) {
        let task = null;
        if (taskId) {
            task = dataManager.getTaskById(taskId);
            if (!task) {
                this.renderNotFound();
                return;
            }
        }

        this.contentElement.innerHTML = templates.taskForm(task);

        // Setup form submission
        const form = document.getElementById('task-form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleTaskFormSubmit(form, taskId);
        });
    }

    // Render the log progress form
    renderLogProgressForm(taskId) {
        const task = dataManager.getTaskById(taskId);
        if (!task) {
            this.renderNotFound();
            return;
        }

        const logs = dataManager.getLogsForTask(taskId);

        this.contentElement.innerHTML = templates.logProgressForm(task, logs);

        // Setup form submission
        const form = document.getElementById('log-form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleLogFormSubmit(form, taskId);
        });
    }

    // Render the schedule view
    renderSchedule(daysAhead = 7) {
        // Calculate schedule
        const schedule = dataManager.calculateSchedule(daysAhead);

        // Generate dates array
        const dates = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < daysAhead; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }

        this.contentElement.innerHTML = templates.schedule(schedule, dates);
    }

    // Render not found page
    renderNotFound() {
        this.contentElement.innerHTML = templates.notFound();
    }

    // Show a flash message - FIXED VERSION
    showFlashMessage(message, type = 'info') {
        // Create message container
        const messageElement = document.createElement('div');
        messageElement.innerHTML = templates.flashMessage(message, type);
        this.flashMessagesElement.appendChild(messageElement);

        // Get the actual alert element (the first child of our message container)
        const alertElement = messageElement.firstElementChild;

        // Set up the close button functionality safely
        if (alertElement) {
            const closeButton = alertElement.querySelector('.btn-close');
            if (closeButton) {
                closeButton.addEventListener('click', function() {
                    // Remove the whole message element when close is clicked
                    if (messageElement.parentNode) {
                        messageElement.parentNode.removeChild(messageElement);
                    }
                });
            }

            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                // Check if the element is still in the DOM before trying to remove it
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 5000);
        }
    }

    // Setup delete buttons on the dashboard
    setupDeleteButtons() {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        const deleteModal = document.getElementById('deleteTaskModal');
        const deleteTaskTitle = document.getElementById('deleteTaskTitle');
        const bsDeleteModal = new bootstrap.Modal(deleteModal);

        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Get task data from data attributes
                const taskId = this.getAttribute('data-task-id');
                const taskTitle = this.getAttribute('data-task-title');

                // Update the modal with task details
                deleteTaskTitle.textContent = taskTitle;
                deleteModal.setAttribute('data-task-id', taskId);

                // Show the modal
                bsDeleteModal.show();
            });
        });
    }

    // Handle task form submission
    handleTaskFormSubmit(form, taskId = null) {
        // Validate form
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        // Get form data
        const formData = {
            title: form.elements.title.value,
            description: form.elements.description.value,
            due_date: form.elements.due_date.value,
            estimated_hours: parseFloat(form.elements.estimated_hours.value)
        };

        // If editing, get status
        if (taskId) {
            formData.status = form.elements.status.value;
        }

        // Save task
        if (taskId) {
            dataManager.updateTask(taskId, formData);
            this.showFlashMessage('Task updated successfully!', 'success');
        } else {
            dataManager.addTask(formData);
            this.showFlashMessage('Task created successfully!', 'success');
        }

        // Navigate back to dashboard
        router.navigateTo('dashboard');
    }

    // Handle log form submission
    handleLogFormSubmit(form, taskId) {
        // Validate form
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        // Get form data
        const logData = {
            log_date: form.elements.log_date.value,
            hours: parseFloat(form.elements.hours.value)
        };

        // Save log
        dataManager.addTaskLog(taskId, logData);

        // Show success message and navigate back to dashboard
        this.showFlashMessage('Progress logged successfully!', 'success');
        router.navigateTo('dashboard');
    }

    // Handle delete task
    handleDeleteTask() {
        const deleteModal = document.getElementById('deleteTaskModal');
        const taskId = deleteModal.getAttribute('data-task-id');

        // Delete the task
        if (taskId) {
            const result = dataManager.deleteTask(taskId);

            if (result) {
                // Close modal
                const bsModal = bootstrap.Modal.getInstance(deleteModal);
                bsModal.hide();

                // Show success message and refresh dashboard
                this.showFlashMessage('Task deleted successfully!', 'success');
                router.navigateTo('dashboard');
            } else {
                this.showFlashMessage('Error deleting task. Please try again.', 'danger');
            }
        }
    }
}

// Initialize the UI controller
const uiController = new UIController();