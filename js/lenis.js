const lenis = new Lenis({ lerp: 0.1 });

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);