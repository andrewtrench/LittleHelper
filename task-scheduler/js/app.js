/**
 * Main application script for Task Scheduler
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    if (typeof bootstrap !== 'undefined') {
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Auto-dismiss flash messages after 5 seconds - FIXED VERSION
    const autoHideFlashMessages = () => {
        const flashMessages = document.querySelectorAll('.alert-dismissible');
        flashMessages.forEach(function(message) {
            setTimeout(function() {
                // Check if the element still exists in the DOM
                if (document.body.contains(message)) {
                    const closeButton = message.querySelector('.btn-close');
                    if (closeButton) {
                        // Instead of programmatically clicking (which can cause issues),
                        // use the Bootstrap API to close the alert
                        const bsAlert = bootstrap.Alert.getOrCreateInstance(message);
                        bsAlert.close();
                    }
                }
            }, 5000);
        });
    };

    // Call initially
    autoHideFlashMessages();

    // Observer for flash messages to auto-dismiss new ones
    const flashMessagesContainer = document.getElementById('flash-messages');
    const observer = new MutationObserver(autoHideFlashMessages);
    observer.observe(flashMessagesContainer, { childList: true });

    // Show welcome message for first-time users
    if (!localStorage.getItem('hasVisited')) {
        uiController.showFlashMessage('Welcome to Task Scheduler! Create your first task to get started.', 'info');
        localStorage.setItem('hasVisited', 'true');
    }

    // Show motivational quotes randomly
    const quotes = [
        "The secret of getting ahead is getting started. – Mark Twain",
        "Don't wish it were easier, wish you were better. – Jim Rohn",
        "Education is the most powerful weapon which you can use to change the world. – Nelson Mandela",
        "The beautiful thing about learning is that no one can take it away from you. – B.B. King",
        "The more that you read, the more things you will know. The more that you learn, the more places you'll go. – Dr. Seuss",
        "The expert in anything was once a beginner. – Helen Hayes",
        "Learn from yesterday, live for today, hope for tomorrow. – Albert Einstein"
    ];

    // Show a random quote on dashboard
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    console.log(`Today's motivational quote: ${randomQuote}`);
});