window.onscroll = () => {
    const backToTop = document.getElementById('back-to-top');
    backToTop.addEventListener('click', () => {
        window.scrollBy(0, -999);
    })

    if (window.pageYOffset > 100) {
        backToTop.classList.remove('sembunyikan');
    } else {
        backToTop.classList.add('sembunyikan');
    }
}