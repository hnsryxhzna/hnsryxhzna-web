const MIN_WEIGHT = 400;
const MAX_WEIGHT = 900;
const RADIUS = 140;
const EASE = 0.18;

function initCharacterEffect(root) {
    const text = root.textContent.trim().replace(/\s+/g, ' ');
    root.textContent = '';

    const chars = [];

    text.split(' ').forEach((word, wordIndex) => {
        if (wordIndex > 0) {
            root.appendChild(document.createTextNode(' '));
        }

        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        root.appendChild(wordSpan);

        for (const character of word) {
            const span = document.createElement('span');
            span.className = 'ch';
            span.textContent = character;
            wordSpan.appendChild(span);

            chars.push({
                el: span,
                centerX: 0,
                centerY: 0,
                current: MIN_WEIGHT,
                target: MIN_WEIGHT
            });
        }
    });

    function measure() {
        chars.forEach(c => {
            c.el.style.width = '';
            c.el.style.fontVariationSettings = `"wght" ${MAX_WEIGHT}`;
        });

        const widths = chars.map(c => c.el.getBoundingClientRect().width);
        chars.forEach((c, i) => {
            c.el.style.width = `${widths[i]}px`;
        });

        chars.forEach(c => {
            const rect = c.el.getBoundingClientRect();
            c.centerX = rect.left + window.scrollX + rect.width / 2;
            c.centerY = rect.top + window.scrollY + rect.height / 2;
        });
    }

    let pointerX = null;
    let pointerY = null;

    root.addEventListener('mousemove', e => {
        pointerX = e.pageX;
        pointerY = e.pageY;
    });

    root.addEventListener('mouseleave', () => {
        pointerX = null;
        pointerY = null;
    });

    function tick() {
        chars.forEach(c => {
            if (pointerX === null) {
                c.target = MIN_WEIGHT;
            } else {
                const distance = Math.hypot(pointerX - c.centerX, pointerY - c.centerY);
                let influence = Math.max(0, 1 - distance / RADIUS);
                influence = influence * influence;
                c.target = MIN_WEIGHT + (MAX_WEIGHT - MIN_WEIGHT) * influence;
            }

            c.current += (c.target - c.current) * EASE;
            c.el.style.fontVariationSettings = `"wght" ${c.current.toFixed(1)}`;
        });

        requestAnimationFrame(tick);
    }

    document.fonts.ready.then(() => {
        measure();
        tick();
    });

    window.addEventListener('resize', measure);
}

const roots = document.querySelectorAll('.mul-text');
if (roots.length === 0) {
    console.warn('character_effect.js: no .mul-text element found');
}
roots.forEach(initCharacterEffect);
