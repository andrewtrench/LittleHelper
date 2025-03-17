/**
 * Router for the Task Scheduler application
 * Handles navigation between different views
 */

class Router {
    constructor() {
        this.routes = {
            'dashboard': this.showDashboard,
            'create-task': this.showCreateTask,
            'edit-task': this.showEditTask,
            'log-progress': this.showLogProgress,
            'schedule': this.showSchedule,
            'not-found': this.showNotFound
        };

        // Set up popstate event listener for back/forward navigation
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.route) {
                this.handleRoute(event.state.route, event.state.params, false);
            }
        });

        // Parse initial route from URL hash
        this.parseUrlAndNavigate();
    }

    // Parse URL hash and navigate to the appropriate route
    parseUrlAndNavigate() {
        let hash = window.location.hash.substring(1) || 'dashboard';
        let parts = hash.split('/');
        let route = parts[0];
        let params = {};

        // Parse parameters
        if (parts.length > 1) {
            // Handle routes like #edit-task/123
            if (route === 'edit-task' || route === 'log-progress') {
                params.taskId = parts[1];
            }
            // Handle other parameterized routes as needed
        }

        this.navigateTo(route, params, false);
    }

    // Navigate to a route
    navigateTo(route, params = {}, addToHistory = true) {
        // Validate route
        if (!this.routes[route]) {
            route = 'not-found';
        }

        // Build URL hash
        let hash = route;
        if (route === 'edit-task' && params.taskId) {
            hash += `/${params.taskId}`;
        } else if (route === 'log-progress' && params.taskId) {
            hash += `/${params.taskId}`;
        }

        // Update browser history
        if (addToHistory) {
            window.history.pushState({ route, params }, '', `#${hash}`);
        }

        // Handle the route
        this.handleRoute(route, params);
    }

    // Handle route by calling the appropriate method
    handleRoute(route, params = {}, updateActive = true) {
        // Call the route handler
        const routeHandler = this.routes[route];
        if (routeHandler) {
            routeHandler.call(this, params);
        } else {
            this.routes['not-found'].call(this);
        }

        // Update active links in the navbar
        if (updateActive) {
            this.updateActiveNavLinks(route);
        }
    }

    // Update active state of navigation links
    updateActiveNavLinks(currentRoute) {
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Match the route to the navigation link
        const routeMap = {
            'dashboard': 'Dashboard',
            'create-task': 'New Task',
            'schedule': 'Schedule'
        };

        if (routeMap[currentRoute]) {
            const linkText = routeMap[currentRoute];
            document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                if (link.textContent.trim().includes(linkText)) {
                    link.classList.add('active');
                }
            });
        }
    }

    // Route handlers
    showDashboard() {
        uiController.renderDashboard();
    }

    showCreateTask() {
        uiController.renderTaskForm();
    }

    showEditTask(params) {
        uiController.renderTaskForm(params.taskId);
    }

    showLogProgress(params) {
        uiController.renderLogProgressForm(params.taskId);
    }

    showSchedule() {
        uiController.renderSchedule();
    }

    showNotFound() {
        uiController.renderNotFound();
    }
}

// Initialize the router
const router = new Router();// router.js for Task Scheduler
