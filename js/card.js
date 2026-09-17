const MAX_TILT = 3;

document.querySelectorAll('.tilt-wrap').forEach(wrap => {
	const card = wrap.querySelector('.tilt-card');
	const hover_scale = parseFloat(getComputedStyle(card).getPropertyValue('--hover-scale')) || 2;
	let frame = null;

	wrap.addEventListener('pointerenter', e => {
		if (e.pointerType !== 'mouse') return;
		card.classList.add('is-active');
		card.style.setProperty('--s', hover_scale);
	});

  	wrap.addEventListener('pointermove', e => {
		if (e.pointerType !== 'mouse') return;
		if (frame) return;

		frame = requestAnimationFrame(() => {
			frame = null;
			const r = wrap.getBoundingClientRect();

			const px = (e.clientX - r.left) / r.width;
			const py = (e.clientY - r.top)  / r.height;

			const nx = px - 0.5;
			const ny = py - 0.5;

			card.style.setProperty('--rx', `${-ny * 2 * MAX_TILT}deg`);
			card.style.setProperty('--ry', `${ nx * 2 * MAX_TILT}deg`);
		});
  	});

	wrap.addEventListener('pointerleave', () => {
		if (frame) { cancelAnimationFrame(frame); frame = null; }
		card.classList.remove('is-active');
		card.style.setProperty('--rx', '0deg');
		card.style.setProperty('--ry', '0deg');
		card.style.setProperty('--s', 1);
	});
});
