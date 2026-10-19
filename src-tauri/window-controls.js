(() => {
  const setup = () => {
    const header = document.querySelector('header.appbar');
    if (!header) {
      requestAnimationFrame(setup);
      return;
    }
    if (header.dataset.tauriControls === 'true') return;

    const currentWindow = window.__TAURI__?.window?.getCurrentWindow?.();
    if (!currentWindow) {
      console.error('Tauri window API is unavailable');
      return;
    }

    header.dataset.tauriControls = 'true';
    header.setAttribute('data-tauri-drag-region', '');
    header.addEventListener('mousedown', event => {
      if (event.button !== 0 || event.target.closest('.tauri-window-controls, button, input, select, textarea, a')) return;
      currentWindow.startDragging().catch(error => {
        console.error('Failed to start dragging the window', error);
      });
    });

    const controls = document.createElement('div');
    controls.className = 'tauri-window-controls';
    controls.setAttribute('data-tauri-drag-region', '');

    const stroke = path => `<path d="${path}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>`;
    const icon = (name, body) => `<svg class="icon icon-${name}" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">${body}</svg>`;
    const icons = {
      minimize: icon('minus', stroke('M3.5 8h9')),
      maximize: icon('maximize', stroke('M3.5 3.5h9v9h-9z')),
      close: icon('close', stroke('M4.25 4.25l7.5 7.5M11.75 4.25l-7.5 7.5')),
    };

    const createButton = (label, action) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tauri-window-button';
      button.setAttribute('aria-label', label);
      button.title = label;
      button.innerHTML = icons[action];
      button.addEventListener('mousedown', event => event.stopPropagation());
      button.addEventListener('click', async event => {
        event.stopPropagation();
        try {
          if (action === 'maximize') await currentWindow.toggleMaximize();
          else await currentWindow[action]();
        } catch (error) {
          console.error(`Failed to ${action} the window`, error);
        }
      });
      return button;
    };

    controls.append(
      createButton('Minimize', 'minimize'),
      createButton('Maximize', 'maximize'),
      createButton('Close', 'close'),
    );
    header.append(controls);

    const style = document.createElement('style');
    style.textContent = `
      .tauri-window-controls { display: flex; align-items: stretch; height: 100%; margin-left: 4px; }
      .tauri-window-button { width: 42px; border: 0; border-radius: 0; background: transparent; color: inherit; display: grid; place-items: center; cursor: pointer; }
      .tauri-window-button .icon { display: block; }
      .tauri-window-button:hover { background: color-mix(in srgb, currentColor 12%, transparent); }
      .tauri-window-button:last-child:hover { background: #c42b1c; color: #fff; }
    `;
    document.head.append(style);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup, { once: true });
  } else {
    setup();
  }
})();
