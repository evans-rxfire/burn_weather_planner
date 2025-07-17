// Dark Mode Toggle
const darkModeBtn = document.getElementById('dark-mode-toggle');
const htmlElement = document.documentElement;

if (darkModeBtn) {
    darkModeBtn.addEventListener('click', () => {
        htmlElement.classList.toggle('dark');
        localStorage.setItem('theme', htmlElement.classList.contains('dark') ? 'dark' : 'light');
    });

    window.addEventListener('DOMContentLoaded', () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            htmlElement.classList.add('dark');
        }
    });
}
