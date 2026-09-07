(function () {
    'use strict';

    const keyInput = document.querySelector('#aes-key-input');
    const plainGrid = document.querySelector('#aes-plain');
    const cipherGrid = document.querySelector('#aes-cipher');
    const status = document.querySelector('.aes-status');
    if (!keyInput || !plainGrid || !cipherGrid) return;

    const DEFAULT_PLAIN = '3243f6a8885a308d313198a2e0370734';

    function byteIndex(row, col) {
        return col * 4 + row;
    }

    const plainCells  = [];
    const cipherCells = [];

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const i = byteIndex(row, col);

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'aes-cell';
            input.maxLength = 2;
            input.spellcheck = false;
            input.autocomplete = 'off';
            input.setAttribute('aria-label', `Plaintext byte ${i}`);
            input.value = DEFAULT_PLAIN.substr(i * 2, 2);
            plainCells[i] = input;
            plainGrid.appendChild(input);

            const out = document.createElement('span');
            out.className = 'aes-cell aes-cell--out';
            cipherCells[i] = out;
            cipherGrid.appendChild(out);
        }
    }

    function bytesFromHex(hex) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
        }
        return bytes;
    }

    function hexFromByte(b) {
        return b.toString(16).padStart(2, '0');
    }

    function readPlainBytes() {
        const bytes = new Uint8Array(16);
        for (let i = 0; i < 16; i++) {
            const text = plainCells[i].value.trim();
            bytes[i] = text === '' ? 0 : parseInt(text, 16);
        }
        return bytes;
    }

    async function encryptBlock(keyBytes, plainBytes) {
        const key = await crypto.subtle.importKey(
            'raw', keyBytes, { name: 'AES-CBC' }, false, ['encrypt']
        );
        const result = await crypto.subtle.encrypt(
            { name: 'AES-CBC', iv: new Uint8Array(16) }, key, plainBytes
        );
        return new Uint8Array(result).slice(0, 16);
    }

    function setStatus(message, isError) {
        status.textContent = message;
        status.classList.toggle('is-error', Boolean(isError));
    }

    function showCipher(bytes) {
        for (let i = 0; i < 16; i++) {
            cipherCells[i].textContent = bytes ? hexFromByte(bytes[i]) : '··';
        }
    }

    async function refresh() {
        const keyHex = keyInput.value.trim().toLowerCase();

        if (!/^[0-9a-f]*$/.test(keyHex)) {
            showCipher(null);
            setStatus('Key: hex digits only.', true);
            return;
        }
        if (keyHex.length !== 32) {
            showCipher(null);
            setStatus(`Key: ${keyHex.length}/32 hex digits.`, true);
            return;
        }

        for (let i = 0; i < 16; i++) {
            const text = plainCells[i].value.trim();
            if (text !== '' && !/^[0-9a-fA-F]{1,2}$/.test(text)) {
                showCipher(null);
                setStatus('Cells: one hex byte (00–ff).', true);
                return;
            }
        }

        try {
            const cipher = await encryptBlock(bytesFromHex(keyHex), readPlainBytes());
            showCipher(cipher);
            setStatus('Encrypted.', false);
        } catch (err) {
            showCipher(null);
            setStatus('Encryption failed: ' + err.message, true);
        }
    }

    plainCells.forEach((cell, i) => {
        cell.addEventListener('input', () => {
            if (cell.value.length === 2 && i < 15) plainCells[i + 1].focus();
            refresh();
        });
        cell.addEventListener('focus', () => cell.select());
    });

    keyInput.addEventListener('input', refresh);

    if (!window.crypto || !window.crypto.subtle) {
        showCipher(null);
        setStatus('Web Crypto unavailable', true);
        return;
    }

    refresh();
})();
