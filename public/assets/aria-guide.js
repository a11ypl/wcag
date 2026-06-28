(function () {
  const root = document.querySelector('[data-aria-reference]');
  if (!root) return;

  const search = root.querySelector('#aria-search');
  const type = root.querySelector('#aria-type');
  const status = root.querySelector('[data-aria-reference-status]');
  const items = Array.from(root.querySelectorAll('[data-name][data-type]'));

  if (!search || !type || !status || items.length === 0) return;

  function normalize(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function update() {
    const query = normalize(search.value);
    const selectedType = type.value;
    let visibleCount = 0;

    for (const item of items) {
      const haystack = normalize(item.dataset.search || item.textContent);
      const itemType = item.dataset.type || '';
      const matchesQuery = !query || haystack.includes(query);
      const matchesType = !selectedType || itemType === selectedType;
      const isVisible = matchesQuery && matchesType;

      const listItem = item.closest('li');
      if (listItem) {
        listItem.hidden = !isVisible;
      } else {
        item.hidden = !isVisible;
      }
      if (isVisible) visibleCount += 1;
    }

    if (visibleCount === items.length) {
      status.textContent = 'Pokazano wszystkie pozycje słownika.';
    } else if (visibleCount === 1) {
      status.textContent = 'Pokazano 1 pozycję słownika.';
    } else {
      status.textContent = `Pokazano ${visibleCount} pozycji słownika.`;
    }
  }

  search.addEventListener('input', update);
  type.addEventListener('change', update);
})();
