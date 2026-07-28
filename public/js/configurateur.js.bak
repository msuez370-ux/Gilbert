(function () {
  const canvas = document.getElementById('cachet-preview');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const SIZE = 340;
  canvas.width = SIZE;
  canvas.height = SIZE;
  const state = { diametre: '30', texteHaut: '', texteBas: '', logo: null };

  function drawTextArc(text, radius, isBottom) {
    if (!text) return;
    const chars = text.split('');
    const n = chars.length;

    // Angle max occupe par le texte : un peu moins d'un demi-cercle (140°)
    // pour laisser un espace entre la ligne du haut et celle du bas.
    const maxArc = Math.PI * 0.78;

    // Taille de police adaptative : plus il y a de lettres, plus c'est petit
    let fontSize = 15;
    if (n > 18) fontSize = 13;
    if (n > 26) fontSize = 11;
    if (n > 34) fontSize = 10;

    ctx.save();
    ctx.font = 'bold ' + fontSize + 'px Georgia, serif';
    ctx.fillStyle = '#1a1a2e';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Espacement ideal selon la police, mais borne pour ne jamais depasser maxArc
    const idealStep = (fontSize + 3) / radius;
    const maxStep = n > 1 ? maxArc / (n - 1) : 0;
    const anglePerChar = Math.min(idealStep, maxStep);
    const totalAngle = anglePerChar * (n - 1);
    const cx = SIZE / 2, cy = SIZE / 2;

    chars.forEach((char, i) => {
      let angle;
      if (isBottom) {
        angle = Math.PI / 2 + (totalAngle / 2) - i * anglePerChar;
      } else {
        angle = -Math.PI / 2 - (totalAngle / 2) + i * anglePerChar;
      }
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(isBottom ? angle - Math.PI / 2 : angle + Math.PI / 2);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });
    ctx.restore();
  }
  function draw() {
    ctx.clearRect(0, 0, SIZE, SIZE);
    const R = state.diametre === '30' ? 95 : 80;
    const cx = SIZE / 2, cy = SIZE / 2;

    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = '#f5f0e8'; ctx.fill();
    ctx.strokeStyle = '#8b6914'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, R - 12, 0, Math.PI * 2);
    ctx.strokeStyle = '#8b6914'; ctx.lineWidth = 1.2; ctx.stroke();

    drawTextArc(state.texteHaut, R + 22, false);
    drawTextArc(state.texteBas, R + 22, true);

    if (state.logo) {
      const img = new Image();
      img.onload = () => {
        const rInt = R - 14;
        const off = document.createElement('canvas');
        off.width = rInt * 2;
        off.height = rInt * 2;
        const octx = off.getContext('2d');

        const ratio = Math.max((rInt * 2) / img.width, (rInt * 2) / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        octx.drawImage(img, (rInt * 2 - w) / 2, (rInt * 2 - h) / 2, w, h);

        const data = octx.getImageData(0, 0, off.width, off.height);
        const px = data.data;
        for (let i = 0; i < px.length; i += 4) {
          const lum = 0.299 * px[i] + 0.587 * px[i+1] + 0.114 * px[i+2];
          const v = lum < 140 ? 0 : 255;
          px[i] = px[i+1] = px[i+2] = v;
          if (v === 255) px[i+3] = 0;
        }
        octx.putImageData(data, 0, 0);

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, rInt, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(off, cx - rInt, cy - rInt);
        ctx.restore();
      };
      img.src = state.logo;
    } else {
      ctx.fillStyle = '#c9a84c'; ctx.font = '11px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('Votre logo', cx, cy - 8); ctx.fillText('ici', cx, cy + 8);
    }

    ctx.fillStyle = '#8b691455'; ctx.font = '10px sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText('Ø ' + state.diametre + ' mm', cx, SIZE - 6);
  }

  ['texteHaut', 'texteBas', 'diametre'].forEach(key => {
    const el = document.getElementById(key);
    if (el) el.addEventListener('input', () => { state[key] = el.value; draw(); });
  });
  const logoInput = document.getElementById('logoInput');
  if (logoInput) logoInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { state.logo = ev.target.result; draw(); };
    reader.readAsDataURL(file);
  });
  draw();
})();