/**
 * Ov.EL Labs — Tactile Feedback Loops & Micro-Interactions Engine
 * - Dynamic cursor-origin radial ink ripples
 * - Signature particle micro-sparks on primary CTAs
 * - Whisper-soft synthesized haptic tick via Web Audio API
 * - Interactive action toasts with auto-clipboard for emails & phone numbers
 * - Live input validation feedback
 */

// ---------------------------------------------------------------------------
// 1. Whisper-Soft Synthesized Haptic Audio Click (Native Web Audio API)
// ---------------------------------------------------------------------------
let audioCtx = null;

export function playTactileTick() {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (audioCtx) {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(840, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.016);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.016);
    }
  } catch {
    // Non-blocking in restricted audio environments
  }
}

// ---------------------------------------------------------------------------
// 2. Cursor-Origin Radial Ink Ripple
// ---------------------------------------------------------------------------
export function createRipple(element, event) {
  const rect = element.getBoundingClientRect();
  const x = event ? (event.clientX - rect.left) : (rect.width / 2);
  const y = event ? (event.clientY - rect.top) : (rect.height / 2);

  const ripple = document.createElement('span');
  ripple.className = 'ovel-ripple';
  const diameter = Math.max(rect.width, rect.height) * 2.4;
  ripple.style.width = `${diameter}px`;
  ripple.style.height = `${diameter}px`;
  ripple.style.left = `${x - diameter / 2}px`;
  ripple.style.top = `${y - diameter / 2}px`;

  element.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

// ---------------------------------------------------------------------------
// 3. Signature Particle Micro-Sparks Burst (Matching Preloader Sparks)
// ---------------------------------------------------------------------------
export function createSparkBurst(clientX, clientY, count = 8) {
  const container = document.createElement('div');
  container.className = 'ovel-spark-container';
  container.style.left = `${clientX}px`;
  container.style.top = `${clientY}px`;
  document.body.appendChild(container);

  for (let i = 0; i < count; i += 1) {
    const spark = document.createElement('span');
    spark.className = 'ovel-click-spark';
    const angle = (i / count) * Math.PI * 2 + (Math.random() * 0.5 - 0.25);
    const distance = 20 + Math.random() * 32;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    const size = 3 + Math.random() * 3.5;
    const isElectric = Math.random() > 0.35;

    spark.style.width = `${size}px`;
    spark.style.height = `${size}px`;
    spark.style.background = isElectric ? '#6342FF' : '#111111';
    spark.style.setProperty('--dx', `${dx}px`);
    spark.style.setProperty('--dy', `${dy}px`);
    container.appendChild(spark);
  }

  setTimeout(() => container.remove(), 550);
}

// ---------------------------------------------------------------------------
// 4. Modern Action Toast System
// ---------------------------------------------------------------------------
let toastTimeout = null;

export function showToast(message, icon = '✓', duration = 3000) {
  let toast = document.getElementById('ovel-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ovel-toast';
    toast.className = 'ovel-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="ovel-toast-icon">${icon}</span>
    <span class="ovel-toast-text">${message}</span>
  `;

  // Trigger re-animation
  toast.classList.remove('is-visible');
  void toast.offsetWidth; // force reflow
  toast.classList.add('is-visible');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, duration);
}

// ---------------------------------------------------------------------------
// 5. Global Button & Interactive Element Listeners
// ---------------------------------------------------------------------------
export function initButtonFeedback() {
  const interactiveSelector = [
    'button',
    '.submit',
    '.hero-primary',
    '.hero-secondary',
    '.pricing-card-action',
    'header a',
    '.site-footer-contact',
    '.back-link',
    '.contact-item a',
    '.founder',
    '.rail-links a',
    'a[href^="#"]',
  ].join(', ');

  document.addEventListener('pointerdown', (e) => {
    const target = e.target.closest(interactiveSelector);
    if (!target) return;

    // Haptic tick
    playTactileTick();

    // Radial ripple inside element
    createRipple(target, e);

    // Spark burst on primary action buttons
    const isPrimary = target.matches(
      '.submit, .hero-primary, .pricing-card-action, .site-footer-contact, header a:last-child, #btn-submit-another, #btn-retry-submit'
    );
    if (isPrimary && e.clientX && e.clientY) {
      createSparkBurst(e.clientX, e.clientY, 8);
    }
  });

  // Intercept email and phone links to provide instant copy feedback
  document.addEventListener('click', async (e) => {
    const mailLink = e.target.closest('a[href^="mailto:"]');
    if (mailLink) {
      const email = mailLink.getAttribute('href').replace('mailto:', '').split('?')[0];
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
          showToast(`Copied ${email} to clipboard — launching mail...`, '✉', 3200);
        }
      } catch {
        showToast(`Opening mail client to ${email}...`, '✉', 2500);
      }
      return;
    }

    const telLink = e.target.closest('a[href^="tel:"]');
    if (telLink) {
      const phone = telLink.getAttribute('href').replace('tel:', '');
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(phone);
          showToast(`Copied ${phone} to clipboard`, '📞', 3000);
        }
      } catch {
        showToast(`Calling ${phone}...`, '📞', 2500);
      }
    }
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initButtonFeedback);
} else {
  initButtonFeedback();
}
