const scene = document.querySelector('.scene');
const panelB = document.querySelector('.panel-b');

function update() {
    const top = scene.getBoundingClientRect().top;
    const travel = scene.offsetHeight - window.innerHeight;

    let progress = -top / travel
    progress = Math.min(Math.max(progress, 0), 1)

    // panelB.style.transform = `translateX(${-100 + progress * 100}%)`;
    panelB.style.transform = `translateY(${100 - progress * 100}%)`;
}

let ticking = false;
function onScroll() {
    if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
            update();
            ticking = false;
        });
    }
}

window.addEventListener('scroll', onScroll);
window.addEventListener('resize', update);
update();
