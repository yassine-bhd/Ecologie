document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - starting app');
    
    // Debug container visibility
    const container = document.querySelector('.container');
    if (!container) {
        console.error('Container element missing!');
        document.body.innerHTML = '<h1 style="color:red">Error: Container element missing</h1>';
    } else {
        container.style.opacity = '1';
    }
});