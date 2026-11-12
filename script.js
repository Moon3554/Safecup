// SafeCup - Script interactif simplifié (Projet École)

document.addEventListener('DOMContentLoaded', () => {
  // --- Synthèse sonore Web Audio pour le clic de verrouillage ---
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  function playLockSound(isLocking) {
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (isLocking) {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(350, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);
        osc.start(now);
        osc.stop(now + 0.09);
      }
    } catch (e) {
      // Audio ignoré gracieusement si non autorisé
    }
  }

  // --- Toggle Verrouillage du Gobelet ---
  let isLocked = true;
  const heroToggleLockBtn = document.getElementById('heroToggleLockBtn');
  const heroLockBtnText = document.getElementById('heroLockBtnText');
  const heroLockIcon = document.getElementById('heroLockIcon');
  const cupStatusBadge = document.getElementById('cupStatusBadge');
  const cupStatusDot = document.getElementById('cupStatusDot');
  const cupStatusLabel = document.getElementById('cupStatusLabel');
  const svgLatch = document.getElementById('svgLatch');

  function toggleLockState() {
    isLocked = !isLocked;
    playLockSound(isLocked);

    if (isLocked) {
      // Verrouillé
      if (cupStatusBadge) {
        cupStatusBadge.className = 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider status-badge-locked mb-4';
      }
      if (cupStatusDot) cupStatusDot.className = 'w-2 h-2 rounded-full bg-emerald-400';
      if (cupStatusLabel) cupStatusLabel.textContent = 'Couvercle Verrouillé';
      if (svgLatch) {
        svgLatch.setAttribute('fill', '#10b981');
        svgLatch.setAttribute('transform', 'rotate(0 120 92)');
      }
      if (heroLockBtnText) heroLockBtnText.textContent = 'Déverrouiller le gobelet';
      if (heroLockIcon) heroLockIcon.textContent = '🔓';
    } else {
      // Déverrouillé
      if (cupStatusBadge) {
        cupStatusBadge.className = 'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider status-badge-unlocked mb-4';
      }
      if (cupStatusDot) cupStatusDot.className = 'w-2 h-2 rounded-full bg-rose-500';
      if (cupStatusLabel) cupStatusLabel.textContent = 'Couvercle Déverrouillé';
      if (svgLatch) {
        svgLatch.setAttribute('fill', '#ef4444');
        svgLatch.setAttribute('transform', 'rotate(-35 120 92)');
      }
      if (heroLockBtnText) heroLockBtnText.textContent = 'Verrouiller le gobelet';
      if (heroLockIcon) heroLockIcon.textContent = '🔒';
    }
  }

  heroToggleLockBtn?.addEventListener('click', toggleLockState);

  // --- Calculateur de quantité et commande simple ---
  const UNIT_PRICE = 3.50;
  let quantity = 1;

  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const qtyDisplay = document.getElementById('qtyDisplay');
  const totalPriceDisplay = document.getElementById('totalPriceDisplay');
  const orderBtn = document.getElementById('orderBtn');
  const orderSuccessMessage = document.getElementById('orderSuccessMessage');

  function updateOrderDisplay() {
    if (qtyDisplay) qtyDisplay.textContent = quantity;
    const total = (quantity * UNIT_PRICE).toFixed(2);
    if (totalPriceDisplay) totalPriceDisplay.textContent = `${total.replace('.', ',')} €`;
  }

  qtyMinus?.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      updateOrderDisplay();
    }
  });

  qtyPlus?.addEventListener('click', () => {
    if (quantity < 50) {
      quantity++;
      updateOrderDisplay();
    }
  });

  orderBtn?.addEventListener('click', () => {
    playLockSound(true);
    if (orderSuccessMessage) {
      orderSuccessMessage.classList.remove('hidden');
    }
    orderBtn.disabled = true;
    orderBtn.classList.add('opacity-70', 'cursor-not-allowed');
    orderBtn.innerHTML = '<span>✓</span> Commande confirmée';
  });
});
