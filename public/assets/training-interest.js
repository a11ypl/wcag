(() => {
    document.querySelectorAll('[data-interest-form]').forEach((form) => {
        const status = form.querySelector('[role="status"]');
        const button = form.querySelector('[type="submit"]');
        const email = form.elements.email;
        let sending = false;
        let submitted = false;

        email.addEventListener('invalid', () => email.setAttribute('aria-invalid', 'true'));
        email.addEventListener('input', () => email.removeAttribute('aria-invalid'));

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            if (sending || submitted || !form.reportValidity()) return;
            if (form.elements.botcheck.checked) return;

            sending = true;
            button.setAttribute('aria-disabled', 'true');
            status.textContent = 'Wysyłanie zgłoszenia…';
            const payload = new FormData(form);
            payload.set('email', email.value.trim());
            payload.set('replyto', email.value.trim());
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);

            try {
                const response = await fetch(form.action, { method: 'POST', body: payload, signal: controller.signal });
                const result = await response.json();
                if (!response.ok || result.success !== true) throw new Error('Submission failed');
                submitted = true;
                form.reset();
                status.textContent = 'Dziękujemy za zgłoszenie. Powiadomimy Cię e-mailem, gdy ruszą zapisy na kolejną edycję.';
                button.textContent = 'Zgłoszenie wysłane';
            } catch {
                status.textContent = 'Nie udało się wysłać zgłoszenia. Spróbuj ponownie lub napisz na a11y@wlaczwizje.pl.';
            } finally {
                clearTimeout(timeout);
                sending = false;
                if (!submitted) button.removeAttribute('aria-disabled');
            }
        });
    });
})();
