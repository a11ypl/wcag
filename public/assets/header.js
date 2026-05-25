(() => {
    const compactStart = 96;
    const compactEnd = 56;
    let isCompact = document.body.classList.contains('header-compact');
    let ticking = false;

    const updateHeaderState = () => {
        const scrollY = window.scrollY;
        const shouldCompact = isCompact
            ? scrollY > compactEnd
            : scrollY > compactStart;

        if (shouldCompact !== isCompact) {
            isCompact = shouldCompact;
            document.body.classList.toggle('header-compact', isCompact);
        }

        ticking = false;
    };

    const requestHeaderState = () => {
        if (ticking) {
            return;
        }

        ticking = true;
        window.requestAnimationFrame(updateHeaderState);
    };

    updateHeaderState();
    window.addEventListener('scroll', requestHeaderState, { passive: true });
    window.addEventListener('resize', requestHeaderState);
})();
