(function () {
    'use strict';

    const screen = document.querySelector('.donut');
    if (!screen) return;

    const stage = screen.parentElement;

    const CHARS = '.,-~:;=!*#$@';

    let WIDTH = 80;
    let HEIGHT = 22;
    let centerX = 40;
    let centerY = 11;
    let scaleX = 30;
    let scaleY = 15;
    let theta_spacing = 0.07;
    let phi_spacing = 0.02;

    let A = 0;
    let B = 0;

    function measureCell() {
        const probe = document.createElement('span');
        probe.textContent = 'M'.repeat(100);
        probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;';
        screen.appendChild(probe);
        const rect = probe.getBoundingClientRect();
        probe.remove();
        return { w: rect.width / 100, h: rect.height };
    }

    function layout() {
        const cell = measureCell();
        if (!cell.w || !cell.h) {
            return;
        }

        const box = stage.getBoundingClientRect();

        const FILL = 1;
        WIDTH  = Math.max(20, Math.floor(box.width  * FILL / cell.w));
        HEIGHT = Math.max(10, Math.floor(box.height * FILL / cell.h));

        centerX = WIDTH  / 2;
        centerY = HEIGHT / 2;

        const EXTENT = 0.7;
        const MARGIN = 0.8;
        const aspect = cell.h / cell.w;

        scaleX = MARGIN * Math.min(centerX, centerY * aspect) / EXTENT;
        scaleY = scaleX / aspect;

        const sampleFit = Math.min(scaleX / 30, 2.5);
        theta_spacing = 0.07 / sampleFit;
        phi_spacing   = 0.02 / sampleFit;
    }

    function renderFrame() {
        const output  = new Array(WIDTH * HEIGHT).fill(' ');
        const z_buffer = new Array(WIDTH * HEIGHT).fill(0);

        for (let theta = 0; theta < 6.28; theta += theta_spacing) {
            const sin_theta = Math.sin(theta);
            const cos_theta = Math.cos(theta);

            for (let phi = 0; phi < 6.28; phi += phi_spacing) {
                const sin_phi = Math.sin(phi);
                const cos_phi = Math.cos(phi);
                const sinA = Math.sin(A);
                const cosA = Math.cos(A);
                const sinB = Math.sin(B);
                const cosB = Math.cos(B);

                const circleY = cos_theta + 2;

                const depth = 1 / (sin_phi * circleY * sinA + sin_theta * cosA + 5);
                const t = sin_phi * circleY * cosA - sin_theta * sinA;

                const x = Math.floor(centerX + scaleX * depth * (cos_phi * circleY * cosB - t * sinB));
                const y = Math.floor(centerY + scaleY * depth * (cos_phi * circleY * sinB + t * cosB));
                const index = x + WIDTH * y;

                const luminance = Math.floor(
                    8 * ((sin_theta * sinA - sin_phi * cos_theta * cosA) * cosB - sin_phi * cos_theta * sinA - sin_theta * cosA - cos_phi * cos_theta * sinB)
                );

                if (y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && depth > z_buffer[index]) {
                    z_buffer[index] = depth;
                    output[index] = CHARS[luminance > 0 ? luminance : 0];
                }
            }
        }

        let text = '';
        for (let row = 0; row < HEIGHT; row++) {
            text += output.slice(row * WIDTH, (row + 1) * WIDTH).join('') + '\n';
        }
        return text;
    }

    document.fonts.ready.then(() => {
        layout();

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            screen.textContent = renderFrame();
            return;
        }

        (function tick() {
            screen.textContent = renderFrame();
            A += 0.02;
            B += 0.02;
            requestAnimationFrame(tick);
        })();
    });

    window.addEventListener('resize', layout);
})();
