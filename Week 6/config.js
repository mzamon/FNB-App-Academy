document.addEventListener('DOMContentLoaded', function() {
    const apiKeyForm = document.getElementById('apiKeyForm');
    
    apiKeyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const apiKey = document.getElementById('apiKey').value.trim();
        
        if (apiKey) {
            localStorage.setItem('contactBookApiKey', apiKey);
            alert('API Key saved successfully!');
            window.location.href = 'index.html';
        } else {
            alert('Please enter a valid API Key (your email)');
        }
    });

    // If there's no API key in localStorage, stay on this page
    // Otherwise, redirect to index.html
    if (localStorage.getItem('contactBookApiKey') && window.location.pathname.endsWith('enter-api-key.html')) {
        window.location.href = 'index.html';
    }
});