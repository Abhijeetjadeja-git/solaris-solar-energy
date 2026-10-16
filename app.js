(function () {
  const TOTAL_FRAMES = 300;
  const canvas = document.getElementById('animation-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false });

  // Frame URL generator
  function getFrameUrl(index) {
    const padded = String(index).padStart(6, '0');
    return `frames/frame_${padded}.jpg`;
  }

  // Preloaded frames storage
  const images = new Array(TOTAL_FRAMES + 1);
  const loadedStatus = new Array(TOTAL_FRAMES + 1).fill(false);
  const loadingStatus = new Array(TOTAL_FRAMES + 1).fill(false);

  let targetFrame = 1;
  let currentFrame = 1;
  let lastDrawnFrame = -1;
  const lerpFactor = 0.16; // Smooth responsive cinematic scrubbing

  // HUD elements
  const hudContainer = document.getElementById('video-hud');
  const hudText = document.getElementById('hud-text');
  const hudFrame = document.getElementById('hud-frame');

  // Load a single frame by index
  function loadFrame(index, priority = false) {
    if (index < 1 || index > TOTAL_FRAMES) return;
    if (loadedStatus[index] || loadingStatus[index]) return;

    loadingStatus[index] = true;
    const img = new Image();
    if (priority) {
      img.fetchPriority = 'high';
    }
    img.src = getFrameUrl(index);
    img.onload = () => {
      loadedStatus[index] = true;
      loadingStatus[index] = false;
      images[index] = img;

      if (Math.round(currentFrame) === index) {
        drawFrame(index);
      }
    };
    img.onerror = () => {
      loadingStatus[index] = false;
    };
    images[index] = img;
  }

  // Resize canvas to match display size & device pixel ratio
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    canvas.width = Math.round(displayWidth * dpr);
    canvas.height = Math.round(displayHeight * dpr);

    lastDrawnFrame = -1;
    drawFrame(Math.round(currentFrame));
  }

  // Draw frame with aspect-ratio cover fitting
  function drawFrame(targetIdx) {
    const clampedIdx = Math.max(1, Math.min(TOTAL_FRAMES, targetIdx));

    let frameToDraw = clampedIdx;
    if (!loadedStatus[frameToDraw]) {
      let closest = -1;
      let minDiff = Infinity;
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        if (loadedStatus[i]) {
          const diff = Math.abs(i - clampedIdx);
          if (diff < minDiff) {
            minDiff = diff;
            closest = i;
          }
        }
      }
      if (closest !== -1) {
        frameToDraw = closest;
      } else {
        return;
      }
    }

    if (frameToDraw === lastDrawnFrame && canvas.width > 0) return;

    const img = images[frameToDraw];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.drawImage(img, 0, 0, iw, ih, sx, sy, sw, sh);
    lastDrawnFrame = frameToDraw;

    // Update Live HUD
    updateHUD(frameToDraw);
  }

  // Update HUD text based on current video frame
  function updateHUD(frameNum) {
    if (!hudContainer || !hudText || !hudFrame) return;

    hudContainer.classList.remove('opacity-0', 'translate-y-4');
    hudContainer.classList.add('opacity-100', 'translate-y-0');

    hudFrame.textContent = `FRAME ${String(frameNum).padStart(3, '0')}`;

    if (frameNum < 70) {
      hudText.textContent = 'Photovoltaic Array • Dual-Axis Solar Capture';
    } else if (frameNum < 150) {
      hudText.textContent = 'High-Yield Crystalline Silicon • 32° Angle';
    } else if (frameNum < 220) {
      hudText.textContent = 'Smart Micro-Inverter Grid • 99.4% Efficiency';
    } else {
      hudText.textContent = 'Commercial Storage • Zero-Carbon Lifecycle';
    }
  }

  // Calculate scroll position accurately across all browsers
  function getScrollFraction() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    ) - window.innerHeight;

    if (docHeight <= 0) return 0;
    return Math.min(Math.max(scrollY / docHeight, 0), 1);
  }

  // Update target frame from scroll
  function updateScrollTarget() {
    const fraction = getScrollFraction();
    targetFrame = 1 + fraction * (TOTAL_FRAMES - 1);

    // Prioritize loading frames in vicinity
    const targetInt = Math.round(targetFrame);
    for (let offset = -5; offset <= 10; offset++) {
      const idx = targetInt + offset;
      if (idx >= 1 && idx <= TOTAL_FRAMES) {
        loadFrame(idx, true);
      }
    }
  }

  // Animation Loop with lerping
  function animate() {
    const diff = targetFrame - currentFrame;
    if (Math.abs(diff) > 0.005) {
      currentFrame += diff * lerpFactor;
    } else {
      currentFrame = targetFrame;
    }

    drawFrame(Math.round(currentFrame));
    requestAnimationFrame(animate);
  }

  // Preloading
  function startPreloading() {
    loadFrame(1, true);

    const keyframes = [];
    for (let i = 10; i <= TOTAL_FRAMES; i += 10) {
      keyframes.push(i);
    }
    keyframes.forEach((f) => loadFrame(f, true));

    let remaining = [];
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      if (i % 10 !== 0) remaining.push(i);
    }

    let batchIdx = 0;
    const BATCH_SIZE = 8;
    function loadNextBatch() {
      if (batchIdx >= remaining.length) return;
      const end = Math.min(batchIdx + BATCH_SIZE, remaining.length);
      for (let i = batchIdx; i < end; i++) {
        loadFrame(remaining[i], false);
      }
      batchIdx = end;
      setTimeout(loadNextBatch, 20);
    }

    setTimeout(loadNextBatch, 50);
  }

  // Scroll Reveal Animations (Intersection Observer)
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  // Interactive Solar Calculator
  function initCalculator() {
    const slider = document.getElementById('bill-slider');
    const billDisplay = document.getElementById('bill-display');
    const savingsDisplay = document.getElementById('savings-display');
    const systemDisplay = document.getElementById('system-display');
    const paybackDisplay = document.getElementById('payback-display');
    const co2Display = document.getElementById('co2-display');

    if (!slider) return;

    function recalculate() {
      const bill = parseInt(slider.value, 10);
      billDisplay.textContent = `$${bill}/mo`;

      // 25-year net savings calculation
      const annualBill = bill * 12;
      const savings = Math.round(annualBill * 25 * 0.76);
      savingsDisplay.textContent = `$${savings.toLocaleString()}`;

      // Recommended system size
      const systemSize = (bill / 26.5).toFixed(1);
      systemDisplay.textContent = `${systemSize} kW`;

      // Estimated payback time
      const payback = Math.max(3.8, (5.8 - (bill / 350))).toFixed(1);
      paybackDisplay.textContent = `${payback} Yrs`;

      // CO2 offset
      const co2 = Math.round(bill * 0.68);
      co2Display.textContent = `${co2} Tons`;
    }

    slider.addEventListener('input', recalculate);
    recalculate();
  }

  // Global Step Switcher for "Turning Sunlight into Savings"
  window.activateStep = function (stepNum) {
    const stepCards = document.querySelectorAll('.step-card');
    stepCards.forEach((card, idx) => {
      const p = card.querySelector('p');
      const arrow = card.querySelector('span:last-child');
      const numberCircle = card.querySelector('span:first-child');
      const title = card.querySelector('h4');

      if (idx + 1 === stepNum) {
        card.classList.add('active', 'bg-white/10', 'border-amber-400/40');
        card.classList.remove('bg-white/5', 'border-white/10');
        if (p) p.classList.remove('hidden');
        if (arrow) {
          arrow.textContent = '↓';
          arrow.className = 'text-amber-400 text-lg';
        }
        if (numberCircle) {
          numberCircle.className = 'w-8 h-8 rounded-full bg-amber-500 text-black font-bold flex items-center justify-center text-sm';
        }
        if (title) {
          title.className = 'text-base font-bold text-white';
        }
      } else {
        card.classList.remove('active', 'bg-white/10', 'border-amber-400/40');
        card.classList.add('bg-white/5', 'border-white/10');
        if (p) p.classList.add('hidden');
        if (arrow) {
          arrow.textContent = '→';
          arrow.className = 'text-slate-400 text-lg';
        }
        if (numberCircle) {
          numberCircle.className = 'w-8 h-8 rounded-full bg-white/10 text-slate-300 font-bold flex items-center justify-center text-sm';
        }
        if (title) {
          title.className = 'text-base font-bold text-slate-200';
        }
      }
    });
  };

  // Event Listeners
  window.addEventListener('scroll', updateScrollTarget, { passive: true });
  window.addEventListener('resize', resizeCanvas, { passive: true });

  // Initial execution
  resizeCanvas();
  startPreloading();
  updateScrollTarget();
  requestAnimationFrame(animate);
  initScrollReveal();
  initCalculator();
})();
