const MAX_TILT = 15;

document.querySelectorAll('.tilt-wrap').forEach(wrap => {
	const card = wrap.querySelector('.tilt-card');
	const hover_scale = parseFloat(getComputedStyle(card).getPropertyValue('--hover-scale')) || 5;
	let frame = null;
	let raiseTimer = null;

	wrap.addEventListener('pointerenter', e => {
		if (e.pointerType !== 'mouse') return;
		clearTimeout(raiseTimer);

		wrap.classList.add('is-raised');
		card.classList.add('is-active');
		card.style.setProperty('--s', hover_scale);
	});

	wrap.addEventListener('pointermove', e => {
		if (e.pointerType !== 'mouse') return;
		if (frame) return;

		const x = e.clientX;
		const y = e.clientY;

		frame = requestAnimationFrame(() => {
			frame = null;
			const r = wrap.getBoundingClientRect();

			const cx = r.left + r.width / 2;
			const cy = r.top + r.height / 2;

			const active = card.classList.contains('is-active');
			const s = active ? hover_scale : 1;

			let nx = (x - cx) / (r.width * s);
			let ny = (y - cy) / (r.height * s);

			nx = Math.max(-0.5, Math.min(0.5, nx));
			ny = Math.max(-0.5, Math.min(0.5, ny));

			card.style.setProperty('--rx', `${-ny * 2 * MAX_TILT}deg`);
			card.style.setProperty('--ry', `${ nx * 2 * MAX_TILT}deg`);
		});
	});

	wrap.addEventListener('pointerleave', () => {
		if (frame) {
			cancelAnimationFrame(frame);
			frame = null;
		}

		card.classList.remove('is-active');
		card.style.setProperty('--rx', '0deg');
		card.style.setProperty('--ry', '0deg');
		card.style.setProperty('--s', 1);

		clearTimeout(raiseTimer);
		raiseTimer = setTimeout(() => wrap.classList.remove('is-raised'), 350);
	});
});
