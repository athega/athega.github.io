export function createRenderer(context, reducedMotion) {
  function drawPilotName(name, craft, color) {
    context.save();
    context.font = '12px ui-monospace, monospace';
    context.textAlign = 'center';
    const textWidth = context.measureText(name).width;
    context.fillStyle = '#08121de0';
    context.fillRect(craft.x - textWidth / 2 - 5, craft.y + 20, textWidth + 10, 19);
    context.fillStyle = color;
    context.fillText(name, craft.x, craft.y + 33);
    context.restore();
  }

  function drawShip(thrust, now, craft, color = '#ff6600') {
    context.save();
    context.translate(craft.x, craft.y);
    if (craft.hitFlash > 0 || craft.flashUntil > performance.now()) color = '#fff0ce';
    if (craft.shield) {
      context.beginPath();
      context.arc(0, 0, 26, 0, Math.PI * 2);
      context.strokeStyle = '#64e9ce';
      context.lineWidth = 2;
      context.stroke();
    }
    context.rotate(craft.angle);
    context.shadowColor = color;
    context.shadowBlur = reducedMotion ? 0 : 12;
    if (thrust) {
      const flame = reducedMotion ? 19 : 18 + Math.sin(now * 0.035) * 6;
      context.beginPath();
      context.moveTo(-10, -5);
      context.lineTo(-flame - 8, 0);
      context.lineTo(-10, 5);
      context.fillStyle = color;
      context.fill();
    }
    context.beginPath();
    context.moveTo(19, 0);
    context.lineTo(-12, -12);
    context.lineTo(-6, 0);
    context.lineTo(-12, 12);
    context.closePath();
    context.fillStyle = '#111820';
    context.fill();
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
    context.shadowBlur = 0;
    context.fillStyle = '#d8f4ff';
    context.fillRect(0, -2, 6, 4);
    context.restore();
  }

  function drawOrdnance(hazards, blasts, owner, now, dt) {
    for (const hazard of hazards) {
      context.save();
      context.translate(hazard.x, hazard.y);
      const friendly = hazard.kind === 'mine' && hazard.owner === owner;
      context.strokeStyle = friendly ? '#64e9ce' : '#ffb24d';
      context.fillStyle = '#142332';
      context.lineWidth = 2;
      context.beginPath();
      context.arc(0, 0, hazard.kind === 'mine' ? 12 : 15, 0, Math.PI * 2);
      context.fill(); context.stroke();
      if (hazard.kind === 'mine') {
        for (let ray = 0; ray < 8; ray++) {
          const angle = ray * Math.PI / 4;
          context.beginPath(); context.moveTo(Math.cos(angle) * 12, Math.sin(angle) * 12); context.lineTo(Math.cos(angle) * 18, Math.sin(angle) * 18); context.stroke();
        }
        context.fillStyle = friendly ? '#64e9ce' : '#ff6600';
        context.globalAlpha = reducedMotion ? 1 : 0.5 + Math.sin(now / 140) * 0.4;
        context.fillRect(-3, -3, 6, 6);
      } else {
        context.fillStyle = '#ffd18e'; context.font = 'bold 12px monospace'; context.textAlign = 'center';
        context.fillText(Math.max(0, (hazard.detonatesAt - now) / 1000).toFixed(1), 0, 4);
      }
      context.restore();
    }
    for (let i = blasts.length - 1; i >= 0; i--) {
      const blast = blasts[i];
      blast.life -= dt;
      if (blast.life <= 0) { blasts.splice(i, 1); continue; }
      context.save();
      context.globalAlpha = blast.life / 0.65;
      context.fillStyle = '#ff8a2433'; context.strokeStyle = '#ffc273'; context.lineWidth = 4;
      context.beginPath(); context.arc(blast.x, blast.y, reducedMotion ? blast.radius : blast.radius * Math.min(1, (0.65 - blast.life) * 5), 0, Math.PI * 2);
      context.fill(); context.stroke(); context.restore();
    }
  }

  return { drawShip, drawPilotName, drawOrdnance };
}
