document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('nav a');

    function setActiveLink() {
        const fromTop = window.scrollY + 100;

        navLinks.forEach(link => {
            const section = document.querySelector(link.hash);
            if (!section) return;

            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;

            if (fromTop >= top && fromTop < bottom) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const target = document.querySelector(this.hash);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    window.addEventListener('scroll', setActiveLink);
    setActiveLink();
});
