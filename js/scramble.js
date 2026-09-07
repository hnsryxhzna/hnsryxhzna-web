const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const STAGGER = 2;
const CHURN = 3;


function randomChar() {
    return CHARS[Math.floor(Math.random() * CHARS.length)];
}


function runScramble(el) {
    const target = el.dataset.text || el.textContent.trim().replace(/\s+/g, ' ');
    el.dataset.text = target;
    const state = [...target].map(char => ({
        target: char,
        glyph: char === ' ' ? ' ' : randomChar(),
        resolved: char === ' '
    }));

    let frame = 0;
    const totalFrames = (state.length - 1) * STAGGER + 1;

    function tick() {
        const churn = frame % CHURN === 0;

        state.forEach((c, i) => {
            if (c.resolved) return;

            if (frame >= i * STAGGER) {
                c.glyph = c.target;
                c.resolved = true;
            } else if (churn) {
                c.glyph = randomChar();
            }
        });

        el.textContent = state.map(c => c.glyph).join('');

        frame++;
        if (frame <= totalFrames) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = target;
        }
    }

    tick();
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        runScramble(entry.target);
    });
}, {
    threshold: 0.2
});

document.querySelectorAll('.scramble').forEach(el => {
    if (reduceMotion) return;
    observer.observe(el);
});
