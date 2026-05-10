window.A11yFirstTrainerFlip = (() => {
    const trainers = [
        {
            id: 'damian',
            name: 'Damian Żłobicki',
            company: 'Włącz Wizję',
            bio: 'Trener biznesu, andragog, prezes Włącz Wizję. Twórca podcastu „AKTYWIZJE”. Ekspert od wystąpień publicznych i AI.',
            image: 'assets/damian-profil-4.jpg',
            alt: 'Portret Damiana Żłobickiego.',
            backContent: `
                <h3>Damian Żłobicki</h3>
                <p class="trainer-flip-label">Kompetencje:</p>
                <ul class="instructor-credentials">
                    <li>Szkoleniowiec z 4000h doświadczenia</li>
                    <li>Audytor stron internetowych i aplikacji mobilnych</li>
                    <li>Ekspert w projekcie "AI DC - sztuczna inteligencja wspierająca dostępność cyfrową"</li>
                    <li>Lider <a href="https://www.gov.pl/web/dostepnosc-cyfrowa/sklad-sieci-dostepnosci-cyfrowej" target="_blank" rel="noopener noreferrer" class="trainer-flip-inline-link">Sieci Dostępności Cyfrowej<span class="sr-only"> (otwiera się w nowym oknie)</span></a></li>
                </ul>
                <a href="https://linktr.ee/bergivision" target="_blank" rel="noopener noreferrer" class="instructor-cta-link">Poznaj Damiana<span class="sr-only"> (otwiera się w nowym oknie)</span></a>
            `
        },
        {
            id: 'aleksandra',
            name: 'Aleksandra Migus',
            company: 'SOFTIQ',
            bio: 'Ekspertka wdrażania standardów WCAG w złożonych systemach IT.',
            image: 'assets/ola.jfif',
            alt: 'Portret Aleksandry Migus.',
            backContent: `
                <h3>Aleksandra Migus</h3>
                <p class="trainer-flip-label">Specjalizacja:</p>
                <p>Aleksandra specjalizuje się w dostępności UI/UX oraz audytach kodu frontendowego.</p>
                <a href="https://www.linkedin.com/in/aleksandra-migus/" target="_blank" rel="noopener noreferrer" class="instructor-cta-link">Profil LinkedIn<span class="sr-only"> (otwiera się w nowym oknie)</span></a>
            `
        }
    ];

    function createCard(trainer) {
        return `
            <div class="instructor-flip-card" id="trainer-card-${trainer.id}">
                <div class="instructor-flip-card-inner" id="trainer-inner-${trainer.id}">
                    <button type="button" class="instructor-front card-side-visible"
                            id="trainer-front-${trainer.id}"
                            aria-label="Trener ${trainer.name}. Kliknij kartę, aby poznać doświadczenie"
                            onclick="A11yFirstTrainerFlip.flip('${trainer.id}', true)">
                        <img src="${trainer.image}" alt="${trainer.alt}" class="instructor-image">
                        <div class="instructor-info-front">
                            <h3>${trainer.name}</h3>
                            <div class="instructor-company">${trainer.company}</div>
                            <p class="instructor-bio">${trainer.bio}</p>
                        </div>
                    </button>
                    <div class="instructor-back card-side-hidden"
                         id="trainer-back-${trainer.id}" inert aria-hidden="true"
                         onkeydown="A11yFirstTrainerFlip.handleBackKey(event, '${trainer.id}')">
                        <div>${trainer.backContent}</div>
                        <button type="button" class="flip-close-button" id="trainer-close-${trainer.id}" onclick="A11yFirstTrainerFlip.flip('${trainer.id}', false)">
                            Zamknij szczegóły
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function render(containerId = 'instructorsContainer', trainerList = trainers) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = trainerList.map(createCard).join('');
    }

    function flip(id, open) {
        const inner = document.getElementById(`trainer-inner-${id}`);
        const front = document.getElementById(`trainer-front-${id}`);
        const back = document.getElementById(`trainer-back-${id}`);

        if (!inner || !front || !back) return;

        if (open) {
            inner.classList.add('flipped');
            front.setAttribute('inert', '');
            front.setAttribute('aria-hidden', 'true');
            front.classList.replace('card-side-visible', 'card-side-hidden');
            back.removeAttribute('inert');
            back.removeAttribute('aria-hidden');
            back.classList.replace('card-side-hidden', 'card-side-visible');
            setTimeout(() => {
                const closeButton = document.getElementById(`trainer-close-${id}`);
                if (closeButton) closeButton.focus();
            }, 100);
        } else {
            inner.classList.remove('flipped');
            back.setAttribute('inert', '');
            back.setAttribute('aria-hidden', 'true');
            back.classList.replace('card-side-visible', 'card-side-hidden');
            front.removeAttribute('inert');
            front.removeAttribute('aria-hidden');
            front.classList.replace('card-side-hidden', 'card-side-visible');
            setTimeout(() => {
                front.focus();
            }, 100);
        }
    }

    function handleBackKey(event, id) {
        if (event.key === 'Escape') {
            event.preventDefault();
            flip(id, false);
        }
    }

    return {
        trainers,
        render,
        flip,
        handleBackKey
    };
})();
