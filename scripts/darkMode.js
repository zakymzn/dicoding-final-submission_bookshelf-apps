const darkMode = document.querySelectorAll('.material-symbols-outlined');

function switchToDarkModeIcon() {
    darkMode[1].innerHTML = 'dark_mode';
}

function switchToLightModeIcon() {
    darkMode[1].innerHTML = 'light_mode';
}

const darkToggle = document.getElementById('darkToggle');
const html = document.querySelector('html');
const input = document.querySelectorAll('input');
let dark = localStorage.getItem('dark_mode');

const enableDarkMode = () => {
    html.classList.remove('light');
    html.classList.add('dark');
    input[2].classList.remove('light-input');
    input[2].classList.add('dark-input');
    input[3].classList.remove('light-input');
    input[3].classList.add('dark-input');
    input[4].classList.remove('light-input');
    input[4].classList.add('dark-input');
    switchToDarkModeIcon();
    localStorage.setItem('dark_mode', 'enabled');
}

const disableDarkMode = () => {
    html.classList.remove('dark');
    html.classList.add('light');
    input[2].classList.remove('dark-input');
    input[2].classList.add('light-input');
    input[3].classList.remove('dark-input');
    input[3].classList.add('light-input');
    input[4].classList.remove('dark-input');
    input[4].classList.add('light-input');
    switchToLightModeIcon();
    localStorage.setItem('dark_mode', null);
}

if (dark === 'enabled') {
    enableDarkMode();
}

darkToggle.addEventListener('click', () => {
    dark = localStorage.getItem('dark_mode');

    if (dark !== 'enabled') {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
})