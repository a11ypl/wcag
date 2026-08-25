(() => {
    const compactHeaderStart = 120;
    const compactHeaderEnd = 40;

    const updateHeaderState = () => {
        const isCompact = document.body.classList.contains('header-compact');

        if (!isCompact && window.scrollY >= compactHeaderStart) {
            document.body.classList.add('header-compact');
        } else if (isCompact && window.scrollY <= compactHeaderEnd) {
            document.body.classList.remove('header-compact');
        }
    };

    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
})();
