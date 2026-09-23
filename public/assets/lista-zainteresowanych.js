// Zapis na listę zainteresowanych kursem. Zgłoszenie idzie mailem przez
// Web3Forms, tym samym kontem co formularze sklepu (checkout-forms.js).
(() => {
    const WEB3FORMS_ACCESS_KEY = '45035717-3dcb-44cc-b1d5-ae1e120a6c01';
    const COURSE = 'Semantyczny HTML, nie taki straszny';

    const form = document.getElementById('waitlistForm');
    if (!form) return;

    const email = document.getElementById('waitlist-email');
    const consent = document.getElementById('waitlist-consent');
    const summary = document.getElementById('waitlistErrorSummary');
    const sending = document.getElementById('waitlistSending');
    const sendError = document.getElementById('waitlistSendError');
    const done = document.getElementById('waitlistDone');
    const submitButton = form.querySelector('[type="submit"]');
    let busy = false;
    let submitted = false;

    function checkEmail() {
        const value = email.value.trim();
        if (!value) return 'Wpisz adres e-mail.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Wpisz adres e-mail w formacie nazwa@domena.pl.';
        return '';
    }

    function checkConsent() {
        return consent.checked ? '' : 'Zaznacz zgodę. Bez niej nie możemy wysłać Ci wiadomości o starcie sprzedaży.';
    }

    function setFieldError(field, message) {
        const error = document.getElementById(field.getAttribute('aria-describedby'));
        error.textContent = message;
        error.classList.toggle('active', Boolean(message));
        if (message) field.setAttribute('aria-invalid', 'true');
        else field.removeAttribute('aria-invalid');
    }

    function escapeHtml(text) {
        return String(text).replace(/[&<>"']/g, (char) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
        })[char]);
    }

    function validate() {
        const errors = [[email, checkEmail()], [consent, checkConsent()]]
            .map(([field, message]) => {
                setFieldError(field, message);
                return message ? { field, message } : null;
            })
            .filter(Boolean);

        if (errors.length) {
            summary.innerHTML = `
                <h3 id="waitlistErrorTitle">Formularz zawiera błędy</h3>
                <p>Popraw je, żeby się zapisać:</p>
                <ul>
                    ${errors.map(({ field, message }) => `<li><a href="#${field.id}">${escapeHtml(field.dataset.label)}: ${escapeHtml(message)}</a></li>`).join('')}
                </ul>
            `;
            summary.hidden = false;
        } else {
            summary.hidden = true;
            summary.textContent = '';
        }
        return errors;
    }

    // Po pierwszej próbie wysłania komunikaty aktualizują się na bieżąco,
    // żeby poprawione pole od razu traciło błąd. Wcześniej nie przeszkadzamy.
    form.addEventListener('input', () => { if (submitted) validate(); });
    form.addEventListener('change', () => { if (submitted) validate(); });

    // Link w podsumowaniu błędów przenosi fokus do pola, nie tylko przewija.
    summary.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="#"]');
        if (!link) return;
        const field = document.getElementById(link.getAttribute('href').slice(1));
        if (!field) return;
        event.preventDefault();
        field.focus();
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (busy) return;
        submitted = true;
        sendError.textContent = '';

        if (validate().length) {
            summary.focus();
            return;
        }

        const name = form.elements.name.value.trim();
        const payload = new FormData();
        payload.append('access_key', WEB3FORMS_ACCESS_KEY);
        payload.append('subject', `Lista zainteresowanych: kurs ${COURSE}`);
        payload.append('from_name', 'a11yfirst.pl');
        payload.append('replyto', email.value.trim());
        payload.append('email', email.value.trim());
        payload.append('name', name || 'Nie podano');
        payload.append('kurs', COURSE);
        payload.append('zgoda', consent.labels[0].textContent.replace(/\*.*$/, '').trim());
        payload.append('zgoda_data', new Date().toISOString());
        payload.append('strona', window.location.href);
        payload.append('botcheck', form.elements.botcheck.checked ? 'on' : '');

        busy = true;
        submitButton.setAttribute('aria-disabled', 'true');
        sending.textContent = 'Wysyłanie zgłoszenia…';

        try {
            const response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: payload });
            const data = await response.json().catch(() => ({}));
            if (!response.ok || !data.success) throw new Error(data.message || 'Błąd wysyłki');

            form.hidden = true;
            done.hidden = false;
            done.querySelector('h3').focus();
        } catch (error) {
            sending.textContent = '';
            sendError.textContent = 'Nie udało się wysłać zgłoszenia. Spróbuj ponownie za chwilę albo napisz na a11y@wlaczwizje.pl.';
        } finally {
            busy = false;
            submitButton.removeAttribute('aria-disabled');
        }
    });
})();
