const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(pointer: coarse)').matches;

if (!reduceMotion && !isTouch) {

    let target  = window.scrollY;
    let current = window.scrollY;
    const ease  = 0.1;

    function maxScroll() {
        return document.documentElement.scrollHeight - window.innerHeight;
    }

    window.addEventListener('wheel', (e) => {
        if (e.ctrlKey) return;

        e.preventDefault();
        target += e.deltaY;

        target = Math.max(0, Math.min(target, maxScroll()));
    }, { passive: false });

    function raf() {
        current += (target - current) * ease;

        if (Math.abs(target - current) < 0.5) current = target;

        window.scrollTo(0, current);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    window.addEventListener('scroll', () => {
        if (Math.abs(window.scrollY - current) > 2) {
        current = target = window.scrollY;
        }
    });

    window.addEventListener('resize', () => {
        target = Math.min(target, maxScroll());
    });
}
