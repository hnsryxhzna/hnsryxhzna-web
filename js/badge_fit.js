function fitBadgeText(svg) {
    const path = svg.querySelector('path[id]');
    const textEl = svg.querySelector('text');
    const textPath = svg.querySelector('textPath');

    if (!path || !textEl || !textPath) {
        console.warn('fitBadgeText: missing path, text or textPath in', svg);
        return;
    }

    textPath.removeAttribute('textLength');
    textPath.removeAttribute('lengthAdjust');

    const circumference = path.getTotalLength();
    const unit = textPath.textContent.trim().replace(/\s+/g, ' ') + ' ';
    textEl.style.letterSpacing = '0px';
    textPath.textContent = unit;

    const unitLength = textPath.getComputedTextLength();
    if (!unitLength) return;
    const repeats = Math.max(1, Math.floor(circumference / unitLength));

    const full = unit.repeat(repeats);
    textPath.textContent = full;
    const naturalLength = textPath.getComputedTextLength();
    const spacing = (circumference - naturalLength) / full.length;

    textEl.style.letterSpacing = `${spacing.toFixed(3)}px`;
}

document.fonts.ready.then(() => {
    document.querySelectorAll('.badge').forEach(fitBadgeText);
});
