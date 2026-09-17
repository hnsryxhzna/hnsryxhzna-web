const stage = document.querySelector('.scroll_video');
const videos = [...stage.querySelectorAll('.sv_video')];
const headers = [...stage.querySelectorAll('.sv_header')];
const triggers = [...stage.querySelectorAll('.sv_trigger')];

let current = -1;

function activate(i) {
    if (i === current) return;
    current = i;

    videos.forEach((v, n) => {
        v.classList.toggle('is_active', n === i);
        if (n === i) v.play().catch(() => {});
        else v.pause();
    });

    headers.forEach((h, n) => h.classList.toggle('is_active', n === i));
}

const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (e.isIntersecting) activate(triggers.indexOf(e.target));
    });
}, { rootMargin: '-50% 0px -50% 0px' });

triggers.forEach((t) => io.observe(t));
activate(0);
