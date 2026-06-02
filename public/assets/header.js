(() => {
    const updateHeaderState = () => {
        document.body.classList.toggle('header-compact', window.scrollY > 80);
    };

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
})();
