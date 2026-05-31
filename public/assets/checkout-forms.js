window.A11yFirstCheckout = (() => {
    const WEB3FORMS_ACCESS_KEY = '45035717-3dcb-44cc-b1d5-ae1e120a6c01';

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function isValidPhone(phone) {
        return phone === '' || /^[0-9]{9,15}$/.test(phone);
    }

    function sanitizeDigits(value, maxLength) {
        return value.replace(/\D+/g, '').slice(0, maxLength);
    }

    function isValidNip(nip) {
        if (nip === '') return true;
        if (!/^[0-9]{10}$/.test(nip)) return false;

        const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
        const checksum = weights.reduce((sum, weight, index) => sum + weight * Number(nip[index]), 0) % 11;
        return checksum !== 10 && checksum === Number(nip[9]);
    }

    function escapeHtml(text) {
        return String(text).replace(/[&<>"']/g, (char) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        })[char]);
    }

    function getErrorElement(field) {
        const errorId = field.dataset.errorId;
        return errorId ? document.getElementById(errorId) : null;
    }

    function setFieldError(field, message) {
        const error = getErrorElement(field);
        if (!error) return;

        if (message) {
            field.setAttribute('aria-invalid', 'true');
            error.textContent = message;
            error.classList.add('active');
        } else {
            field.removeAttribute('aria-invalid');
            error.textContent = '';
            error.classList.remove('active');
        }
    }

    function getSelectedProducts(form) {
        const selectedProducts = Array.from(form.querySelectorAll('input[name="product"]:checked'));
        if (selectedProducts.length) {
            return selectedProducts.map((selected) => ({
                id: selected.dataset.productId || '',
                title: selected.dataset.title || selected.value,
                price: Number(selected.dataset.price || 0),
                transferTitle: selected.dataset.transferTitle || selected.dataset.title || selected.value
            }));
        }

        if (form.dataset.productTitle) {
            return [{
                id: form.dataset.productId || '',
                title: form.dataset.productTitle,
                price: Number(form.dataset.productPrice || 0),
                transferTitle: form.dataset.transferTitle || form.dataset.productTitle
            }];
        }

        return [];
    }

    function getSelectedProduct(form) {
        return getSelectedProducts(form)[0] || null;
    }

    function getCartSummary(products) {
        const total = Math.round(products.reduce((sum, product) => sum + product.price, 0) * 100) / 100;
        const ids = products.map((product) => product.id).filter(Boolean);
        const titles = products.map((product) => product.id ? `ID ${product.id}: ${product.title}` : product.title);
        const transferTitles = products.map((product) => product.transferTitle);

        return {
            total,
            ids,
            titles,
            transferTitle: transferTitles.length > 1 ? `Webinary: ${transferTitles.join('; ')}` : transferTitles[0] || ''
        };
    }

    function formatPrice(value) {
        return new Intl.NumberFormat('pl-PL', {
            minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    function updateSummary(form) {
        const products = getSelectedProducts(form);
        const cart = getCartSummary(products);
        const selectedOutput = document.getElementById(form.dataset.selectedOutput || '');
        const totalOutput = document.getElementById(form.dataset.totalOutput || '');

        if (selectedOutput) {
            if (products.length) {
                selectedOutput.innerHTML = `
                    <ul>
                        ${cart.titles.map((title) => `<li>${escapeHtml(title)}</li>`).join('')}
                    </ul>
                `;
            } else {
                selectedOutput.textContent = 'Brak wyboru';
            }
        }

        if (totalOutput) {
            totalOutput.textContent = products.length ? `${formatPrice(cart.total)} zł` : '0 zł';
        }
    }

    function validateProduct(form) {
        const group = form.querySelector('[data-checkout-product-group]');
        if (!group) return null;

        const error = getErrorElement(group);
        const firstProduct = group.querySelector('input[name="product"]');
        const products = getSelectedProducts(form);
        const message = products.length ? '' : 'Wybierz co najmniej jeden webinar, który chcesz kupić.';

        if (message) {
            group.setAttribute('aria-invalid', 'true');
            if (firstProduct) firstProduct.setAttribute('aria-invalid', 'true');
            if (error) {
                error.textContent = message;
                error.classList.add('active');
            }
            return {
                id: firstProduct ? firstProduct.id : group.id,
                label: group.dataset.label || 'Produkty',
                message
            };
        }

        group.removeAttribute('aria-invalid');
        group.querySelectorAll('input[name="product"]').forEach((input) => input.removeAttribute('aria-invalid'));
        if (error) {
            error.textContent = '';
            error.classList.remove('active');
        }
        return null;
    }

    function validateField(field) {
        const value = field.type === 'checkbox' ? field.checked : field.value.trim();
        const label = field.dataset.label || field.name || field.id;
        const required = field.required;
        const validateAs = field.dataset.validate || field.type;
        let message = '';

        if (field.type === 'checkbox') {
            message = field.checked
                ? ''
                : (field.name === 'consent_tos' ? 'Zaakceptuj regulamin i politykę prywatności.' : `Zaznacz pole: ${label}.`);
        } else if (required && value === '') {
            message = `Uzupełnij pole: ${label}.`;
        } else if (validateAs === 'email' && value !== '' && !isValidEmail(value)) {
            message = 'Wpisz poprawny adres e-mail, np. imie@domena.pl.';
        } else if (validateAs === 'phone' && !isValidPhone(value)) {
            message = 'Numer telefonu może zawierać tylko cyfry i powinien mieć od 9 do 15 cyfr.';
        } else if (validateAs === 'nip' && !isValidNip(value)) {
            message = 'Wpisz poprawny NIP: 10 cyfr i poprawna suma kontrolna.';
        } else if (field.maxLength > 0 && value.length > field.maxLength) {
            message = `Wpisz maksymalnie ${field.maxLength} znaków.`;
        }

        setFieldError(field, message);
        return message ? { id: field.id, label, message } : null;
    }

    function validate(form, options = {}) {
        const { showSummary = false } = options;
        const fields = Array.from(form.querySelectorAll('[data-checkout-field]'));
        const errors = [validateProduct(form), ...fields.map(validateField)].filter(Boolean);
        const summary = document.getElementById(form.dataset.errorSummary || '');

        if (summary) {
            if (showSummary && errors.length) {
                summary.hidden = false;
                summary.innerHTML = `
                    <p><strong>Formularz zawiera błędy.</strong> Sprawdź pola:</p>
                    <ul>
                        ${errors.map((error) => `<li><a href="#${escapeHtml(error.id)}">${escapeHtml(error.label)}: ${escapeHtml(error.message)}</a></li>`).join('')}
                    </ul>
                `;
            } else {
                summary.hidden = true;
                summary.textContent = '';
            }
        }

        return {
            isValid: errors.length === 0,
            firstInvalidFieldId: errors[0] ? errors[0].id : null
        };
    }

    function setButtonBusy(button, busy) {
        button.toggleAttribute('aria-busy', busy);
        button.disabled = busy;
    }

    function showStatus(form, message) {
        const region = document.getElementById(form.dataset.alertRegion || 'alertRegion');
        if (!region) return;

        region.textContent = message;
        region.classList.add('show');
        window.setTimeout(() => region.classList.remove('show'), 5000);
    }

    function focusStepTitle(section) {
        const title = section ? section.querySelector('.checkout-step-title') : null;
        if (!title) return;

        title.setAttribute('tabindex', '-1');
        title.focus({ preventScroll: true });
    }

    function preferredScrollBehavior() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    }

    function fillTransferInfo(form, products, participant) {
        const section = document.getElementById(form.dataset.transferSection || '');
        if (!section) return;

        const cart = getCartSummary(products);
        const amount = section.querySelector('[data-transfer-amount]');
        const title = section.querySelector('[data-transfer-title]');
        if (amount) amount.textContent = `${formatPrice(cart.total)} zł`;
        if (title) title.textContent = `${cart.transferTitle} - ${participant.firstName} ${participant.lastName}`.trim();

        section.hidden = false;
        section.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'start' });
        focusStepTitle(section);
    }

    function getParticipant(form) {
        const value = (name) => {
            const field = form.querySelector(`[name="${name}"]`);
            return field ? field.value.trim() : '';
        };

        return {
            firstName: value('fname'),
            lastName: value('lname'),
            email: value('email'),
            phone: value('phone'),
            nip: value('nip'),
            accessNeeds: value('access_needs')
        };
    }

    async function submitForm(form) {
        const validation = validate(form, { showSummary: true });
        if (!validation.isValid) {
            const firstInvalid = document.getElementById(validation.firstInvalidFieldId);
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        const products = getSelectedProducts(form);
        const cart = getCartSummary(products);
        const participant = getParticipant(form);
        const submitButton = form.querySelector('[type="submit"]');
        const transferSection = document.getElementById(form.dataset.transferSection || '');
        if (transferSection) transferSection.hidden = true;

        const payload = new FormData();
        payload.append('access_key', form.dataset.web3formsKey || WEB3FORMS_ACCESS_KEY);
        payload.append('subject', `${form.dataset.subjectPrefix || 'Nowe zamówienie'}: ${cart.ids.length ? cart.ids.join(', ') : products.map((product) => product.title).join(', ')}`);
        payload.append('from_name', 'a11yfirst.pl');
        payload.append('replyto', participant.email);
        payload.append('name', `${participant.firstName} ${participant.lastName}`.trim());
        payload.append('email', participant.email);
        payload.append('phone', participant.phone || 'Nie podano');
        payload.append('nip', participant.nip || 'Nie podano');
        payload.append('access_needs', participant.accessNeeds || 'Nie podano');
        payload.append('product_ids', cart.ids.join(', '));
        payload.append('products', cart.titles.join('\n'));
        payload.append('amount', `${formatPrice(cart.total)} zł`);
        payload.append('transfer_title', cart.transferTitle);
        payload.append('message', [
            form.dataset.messageHeading || 'Nowe zamówienie z a11yfirst.pl',
            '',
            `Produkty:\n${cart.titles.join('\n')}`,
            `Kwota: ${formatPrice(cart.total)} zł`,
            `Uczestnik / nabywca: ${participant.firstName} ${participant.lastName}`.trim(),
            `Email: ${participant.email}`,
            `Telefon: ${participant.phone || 'Nie podano'}`,
            `NIP: ${participant.nip || 'Nie podano'}`,
            `Dostosowanie do potrzeb: ${participant.accessNeeds || 'Nie podano'}`,
            `Tytuł przelewu: ${cart.transferTitle}`
        ].join('\n'));

        setButtonBusy(submitButton, true);

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: payload
            });
            const data = await response.json().catch(() => ({}));

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Nie udało się wysłać formularza.');
            }

            fillTransferInfo(form, products, participant);
            showStatus(form, 'Formularz został wysłany. Dane do przelewu są dostępne poniżej.');
        } catch (error) {
            showStatus(form, 'Nie udało się wysłać formularza. Spróbuj ponownie za chwilę albo napisz na a11y@wlaczwizje.pl.');
        } finally {
            setButtonBusy(submitButton, false);
        }
    }

    function selectProduct(formId, productId, options = {}) {
        const { moveToForm = true } = options;
        const form = document.getElementById(formId);
        const product = document.getElementById(productId);
        if (!form || !product) return;

        product.checked = true;
        product.dispatchEvent(new Event('change', { bubbles: true }));

        const selectedProducts = getSelectedProducts(form);
        showStatus(form, `Koszyk został zaktualizowany. Liczba produktów w koszyku: ${selectedProducts.length}.`);

        if (moveToForm) {
            form.scrollIntoView({ behavior: preferredScrollBehavior(), block: 'start' });
            product.focus({ preventScroll: true });
        }
    }

    function initForm(form) {
        updateSummary(form);
        form.addEventListener('input', (event) => {
            const field = event.target.closest('[data-checkout-field]');
            if (field && field.dataset.validate === 'phone') field.value = sanitizeDigits(field.value, 15);
            if (field && field.dataset.validate === 'nip') field.value = sanitizeDigits(field.value, 10);
            validate(form);
        });
        form.addEventListener('change', () => {
            updateSummary(form);
            validate(form);
        });
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            submitForm(form);
        });
    }

    function init() {
        document.querySelectorAll('form[data-checkout-form]').forEach(initForm);
        document.addEventListener('click', async (event) => {
            const productTrigger = event.target.closest('[data-checkout-select]');
            if (productTrigger) {
                selectProduct(productTrigger.dataset.checkoutForm, productTrigger.dataset.checkoutSelect, { moveToForm: false });
                return;
            }

            const copyButton = event.target.closest('[data-copy-target]');
            if (!copyButton) return;

            const target = document.getElementById(copyButton.dataset.copyTarget);
            if (!target) return;

            try {
                const text = target.textContent.trim();
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(text);
                } else {
                    const temp = document.createElement('textarea');
                    temp.value = text;
                    temp.setAttribute('readonly', '');
                    temp.style.position = 'absolute';
                    temp.style.left = '-9999px';
                    document.body.appendChild(temp);
                    temp.select();
                    document.execCommand('copy');
                    document.body.removeChild(temp);
                }
                copyButton.textContent = 'Skopiowano';
                const form = copyButton.closest('form[data-checkout-form]') || document.querySelector('form[data-checkout-form]');
                if (form) showStatus(form, 'Skopiowano dane do schowka.');
                window.setTimeout(() => {
                    copyButton.textContent = 'Kopiuj';
                }, 2500);
            } catch (error) {
                copyButton.textContent = 'Nie skopiowano';
                const form = copyButton.closest('form[data-checkout-form]') || document.querySelector('form[data-checkout-form]');
                if (form) showStatus(form, 'Nie udało się skopiować danych do schowka.');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', init);

    return {
        selectProduct,
        validate
    };
})();
