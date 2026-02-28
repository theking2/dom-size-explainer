// DOM Size Explainer - Content Script
(function () {
  // If panel already exists, just restart picking
  if (window.__domSizePanel) {
    window.__domSizePanel.startPicking();
    return;
  }

  // ── Styles ───────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    #__dse-panel {
      all: initial;
      position: fixed !important;
      top: 16px !important;
      right: 16px !important;
      width: 300px !important;
      max-height: 90vh !important;
      overflow-y: auto !important;
      background: #0a0a0f !important;
      border: 1px solid #2a1a4a !important;
      border-radius: 12px !important;
      box-shadow: 0 8px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(168,85,247,0.2) !important;
      z-index: 2147483646 !important;
      font-family: system-ui, sans-serif !important;
      color: #e8e6f0 !important;
    }
    #__dse-panel * { all: unset; box-sizing: border-box !important; display: revert !important; }
    #__dse-header {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      padding: 12px 14px !important;
      background: linear-gradient(135deg, #1a0533, #0d1a33) !important;
      border-bottom: 1px solid #2a1a4a !important;
      cursor: move !important;
    }
    #__dse-title {
      font-size: 12px !important;
      font-weight: 800 !important;
      letter-spacing: 0.08em !important;
      text-transform: uppercase !important;
      color: #c084fc !important;
    }
    #__dse-close {
      cursor: pointer !important;
      color: #6b7280 !important;
      font-size: 20px !important;
      line-height: 1 !important;
    }
    #__dse-close:hover { color: #e8e6f0 !important; }
    #__dse-body { padding: 12px 14px !important; }
    #__dse-status {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      font-size: 11px !important;
      color: #9ca3af !important;
      margin-bottom: 10px !important;
    }
    #__dse-dot {
      width: 7px !important;
      height: 7px !important;
      min-width: 7px !important;
      border-radius: 50% !important;
      background: #f59e0b !important;
      box-shadow: 0 0 6px #f59e0b !important;
      animation: __dse_pulse 1s infinite !important;
    }
    #__dse-dot.done {
      background: #22c55e !important;
      box-shadow: 0 0 6px #22c55e !important;
      animation: none !important;
    }
    @keyframes __dse_pulse { 0%,100%{opacity:1}50%{opacity:.3} }
    #__dse-cancel {
      display: block !important;
      width: 100% !important;
      padding: 8px !important;
      background: #1e1e2e !important;
      border: 1px solid #2a2a3e !important;
      border-radius: 6px !important;
      color: #9ca3af !important;
      font-size: 11px !important;
      text-align: center !important;
      cursor: pointer !important;
      margin-bottom: 8px !important;
    }
    #__dse-cancel:hover { background: #2a2a3e !important; color: #e8e6f0 !important; }
    .dse-tag {
      display: inline-block !important;
      font-family: monospace !important;
      font-size: 10px !important;
      color: #a78bfa !important;
      background: #1a0a2e !important;
      padding: 3px 7px !important;
      border-radius: 4px !important;
      border: 1px solid #2d1a4a !important;
      margin-bottom: 10px !important;
    }
    .dse-sizes {
      display: flex !important;
      gap: 8px !important;
      margin-bottom: 12px !important;
    }
    .dse-box {
      flex: 1 !important;
      background: #111118 !important;
      border: 1px solid #1e1e2e !important;
      border-radius: 8px !important;
      padding: 8px !important;
      text-align: center !important;
    }
    .dse-box-label {
      display: block !important;
      font-size: 9px !important;
      text-transform: uppercase !important;
      letter-spacing: 0.1em !important;
      color: #6b7280 !important;
      margin-bottom: 3px !important;
    }
    .dse-box-val {
      display: block !important;
      font-family: monospace !important;
      font-size: 20px !important;
      font-weight: 700 !important;
      color: #c084fc !important;
    }
    .dse-box-unit { font-size: 10px !important; color: #6b7280 !important; }
    .dse-section {
      display: block !important;
      font-size: 9px !important;
      text-transform: uppercase !important;
      letter-spacing: 0.12em !important;
      color: #4b5563 !important;
      font-weight: 700 !important;
      margin: 10px 0 6px !important;
    }
    .dse-card {
      background: #111118 !important;
      border: 1px solid #1e1e2e !important;
      border-left: 3px solid #7c3aed !important;
      border-radius: 0 6px 6px 0 !important;
      padding: 8px 10px !important;
      margin-bottom: 6px !important;
    }
    .dse-card.warn { border-left-color: #f59e0b !important; }
    .dse-card.info { border-left-color: #3b82f6 !important; }
    .dse-card.ok   { border-left-color: #22c55e !important; }
    .dse-card-t {
      display: block !important;
      font-size: 11px !important;
      font-weight: 700 !important;
      color: #e8e6f0 !important;
      margin-bottom: 2px !important;
    }
    .dse-card-d {
      display: block !important;
      font-family: monospace !important;
      font-size: 10px !important;
      color: #9ca3af !important;
      line-height: 1.5 !important;
    }
    #__dse-again {
      display: block !important;
      width: 100% !important;
      margin-top: 12px !important;
      padding: 9px !important;
      background: linear-gradient(135deg, #7c3aed, #2563eb) !important;
      border-radius: 7px !important;
      color: white !important;
      font-size: 12px !important;
      font-weight: 700 !important;
      text-align: center !important;
      cursor: pointer !important;
    }
    #__dse-again:hover { opacity: 0.88 !important; }
  `;
  document.head.appendChild(style);

  // ── Panel HTML ───────────────────────────────────────────────────────
  const panel = document.createElement('div');
  panel.id = '__dse-panel';
  panel.innerHTML = `
    <div id="__dse-header">
      <span id="__dse-title">⬡ DOM Size Explainer</span>
      <span id="__dse-close">×</span>
    </div>
    <div id="__dse-body">
      <div id="__dse-status">
        <div id="__dse-dot"></div>
        <span id="__dse-stxt">Click any element on the page…</span>
      </div>
      <div id="__dse-cancel">Cancel</div>
      <div id="__dse-results"></div>
    </div>
  `;
  document.body.appendChild(panel);

  // ── Dragging ─────────────────────────────────────────────────────────
  let dragging = false, dx = 0, dy = 0;
  const hdr = panel.querySelector('#__dse-header');
  hdr.addEventListener('mousedown', e => {
    dragging = true;
    const r = panel.getBoundingClientRect();
    dx = e.clientX - r.left; dy = e.clientY - r.top;
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    panel.style.left = (e.clientX - dx) + 'px';
    panel.style.top  = (e.clientY - dy) + 'px';
    panel.style.right = 'auto';
  });
  document.addEventListener('mouseup', () => { dragging = false; });

  panel.querySelector('#__dse-close').addEventListener('click', () => {
    cancelPicking();
    panel.remove();
    style.remove();
    delete window.__domSizePanel;
  });
  panel.querySelector('#__dse-cancel').addEventListener('click', cancelPicking);

  // ── Highlight overlay ────────────────────────────────────────────────
  let overlay = null;
  function getOverlay() {
    if (!overlay) {
      overlay = document.createElement('div');
      Object.assign(overlay.style, {
        position:'fixed', pointerEvents:'none',
        zIndex:'2147483645', borderRadius:'2px',
        border:'2px solid #a855f7',
        background:'rgba(168,85,247,0.07)',
        boxShadow:'0 0 0 1px rgba(168,85,247,0.25)',
        transition:'all 0.04s',
      });
      document.body.appendChild(overlay);
    }
    return overlay;
  }
  function removeOverlay() {
    if (overlay) { overlay.remove(); overlay = null; }
  }
  function highlightEl(el) {
    const ov = getOverlay();
    const r = el.getBoundingClientRect();
    Object.assign(ov.style, { left:r.left+'px', top:r.top+'px', width:r.width+'px', height:r.height+'px' });
  }

  // ── Analyze ──────────────────────────────────────────────────────────
  function analyze(el) {
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const par = el.parentElement;
    const pc = par ? getComputedStyle(par) : null;
    const tag = el.tagName.toLowerCase();

    const reasons = [];
    const add = (axis, level, title, detail) => reasons.push({axis, level, title, detail});

    const display = cs.display;
    const position = cs.position;
    const bsizing = cs.boxSizing;
    const pH = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const bH = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
    const pV = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    const bV = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

    // WIDTH
    // 1. Check for an explicit CSS width (computed, not just inline)
    const computedW = cs.width; // always resolves to a px value
    const hasInlineWidth = el.style.width && el.style.width !== 'auto';

    // Keyword widths (fit-content, min-content, max-content)
    // We detect these by checking if the computed width differs significantly from parent content width
    // and the element is not block-filling. Also check via getComputedStyle on width keyword directly.
    // Best approach: check el.style.width or stylesheet rules via CSSStyleDeclaration
    const widthKeyword = (() => {
      // Walk stylesheets to find a width rule targeting this element
      try {
        for (const sheet of document.styleSheets) {
          let rules;
          try { rules = sheet.cssRules; } catch { continue; }
          for (const rule of rules) {
            if (rule.style && rule.selectorText && el.matches(rule.selectorText)) {
              const w = rule.style.width;
              if (w && w !== '') return w;
            }
          }
        }
      } catch {}
      return null;
    })();

    const effectiveWidthSource = hasInlineWidth ? el.style.width : widthKeyword;

    if (effectiveWidthSource) {
      const val = effectiveWidthSource;
      if (['fit-content','min-content','max-content'].some(k => val.includes(k))) {
        add('w','ok',`width: ${val}`,`Keyword sizing — element shrinks/grows to fit its content naturally.`);
      } else if (val.endsWith('%') && pc) {
        const pct = parseFloat(val);
        const parentW = parseFloat(pc.width);
        add('w','ok',`width: ${val}`,`${pct}% of parent's width (${Math.round(parentW)}px) = ${Math.round(parentW * pct / 100)}px.`);
      } else if (val !== 'auto') {
        add('w','ok',`Explicit width: ${val}`,`width is explicitly set to ${val}${hasInlineWidth ? ' via inline style' : ' via CSS rule'}.`);
      }
    }

    // 2. Layout context — how the parent affects this element's width
    if (pc && pc.display.includes('flex')) {
      const dir = pc.flexDirection;
      const isMainAxis = dir === 'row' || dir === 'row-reverse';
      add('w','info','Flex child',`Parent is display:flex (${dir}). flex: ${cs.flexGrow} ${cs.flexShrink} ${cs.flexBasis}. ${
        cs.flexGrow !== '0'
          ? `flex-grow:${cs.flexGrow} — expands to fill remaining space.`
          : cs.flexBasis !== 'auto'
            ? `flex-basis:${cs.flexBasis} sets the base size.`
            : isMainAxis ? 'Sized by content along main axis.' : 'Stretches across cross axis.'
      }`);
    } else if (pc && pc.display.includes('grid')) {
      add('w','info','Grid child',`Parent is display:grid. Columns: ${pc.gridTemplateColumns}. Spans: ${cs.gridColumnStart}→${cs.gridColumnEnd}.`);
    } else if ((display === 'block' || display === 'list-item') && pc) {
      const pw = parseFloat(pc.width) - parseFloat(pc.paddingLeft) - parseFloat(pc.paddingRight);
      if (!effectiveWidthSource || effectiveWidthSource === 'auto') {
        if (Math.abs(rect.width - pw) < 4) {
          add('w','info','Block fills container',`display:${display} stretches to parent's content width (${Math.round(pw)}px) by default.`);
        } else {
          // Block but smaller — something constrained it
          add('w','info','Block element',`display:${display} normally fills container (${Math.round(pw)}px) but is ${Math.round(rect.width)}px — constrained by max-width, float, or content.`);
        }
      }
    }

    // 3. Inline / shrink-wrap
    if (['inline','inline-block','inline-flex','inline-grid'].includes(display)) {
      if (!effectiveWidthSource || effectiveWidthSource === 'auto') {
        add('w','default','Shrinks to fit content',`display:${display} — width wraps content rather than filling the container.`);
      }
    }

    // 4. Positioned elements
    if (position === 'absolute' || position === 'fixed') {
      const l = cs.left, r2 = cs.right;
      if (l !== 'auto' && r2 !== 'auto') {
        add('w','info','Stretched by left + right',`position:${position} with left:${l} and right:${r2} — width is the space between these anchors.`);
      } else if (!effectiveWidthSource || effectiveWidthSource === 'auto') {
        add('w','info',`position:${position}`,`Removed from normal flow. Width shrinks to content unless explicitly set (left:${l}, right:${r2}).`);
      }
    }

    // 5. box-sizing effect on padding/border
    if (pH > 0 || bH > 0) {
      if (bsizing === 'border-box')
        add('w','ok','box-sizing: border-box',`Padding (${Math.round(pH)}px) + border (${Math.round(bH)}px) are INSIDE the stated width — they don't add to the total.`);
      else
        add('w','warn','box-sizing: content-box',`Padding (${Math.round(pH)}px) + border (${Math.round(bH)}px) ADD on top of the content width, increasing total size.`);
    }

    // 6. min/max constraints
    if (cs.minWidth && cs.minWidth !== '0px') add('w','warn',`min-width: ${cs.minWidth}`,`Can't shrink below ${cs.minWidth}.`);
    if (cs.maxWidth && cs.maxWidth !== 'none') add('w','warn',`max-width: ${cs.maxWidth}`,`Width is capped at ${cs.maxWidth}.`);

    // 7. Float
    if (cs.float && cs.float !== 'none')
      add('w','info',`float: ${cs.float}`,`Floated elements shrink-wrap their content unless an explicit width is set.`);

    // 8. Fallback — if we still have no width reasons, report the computed value
    if (reasons.filter(r => r.axis === 'w').length === 0) {
      add('w','default',`Computed width: ${computedW}`,`No single CSS rule dominates. The browser resolved the width to ${computedW} based on display:${display}, parent layout, and content.`);
    }

    // HEIGHT
    // Detect whether height was explicitly authored or is implicit
    const hasInlineHeight = el.style.height && el.style.height !== 'auto';
    const heightKeyword = (() => {
      try {
        for (const sheet of document.styleSheets) {
          let rules; try { rules = sheet.cssRules; } catch { continue; }
          for (const rule of rules) {
            if (rule.style && rule.selectorText && el.matches(rule.selectorText)) {
              const h = rule.style.height;
              if (h && h !== '') return h;
            }
          }
        }
      } catch {}
      return null;
    })();
    const explicitHeight = hasInlineHeight ? el.style.height : heightKeyword;

    // Detect if height is driven by line-height × lines (text content elements)
    // The browser always resolves cs.height to px, so we check if an explicit rule exists.
    // If not, and the element contains text, it's line-height driven.
    const isTextDriven = (() => {
      if (explicitHeight && explicitHeight !== 'auto') return false;
      // Check if element has direct text content (not just children)
      const hasText = [...el.childNodes].some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
      // Also treat inline/block elements whose only content is text children
      const onlyTextChildren = el.children.length === 0 && el.textContent.trim().length > 0;
      return hasText || onlyTextChildren || ['p','h1','h2','h3','h4','h5','h6','span','a','li','td','th','label','button'].includes(tag);
    })();

    if (explicitHeight && explicitHeight !== 'auto') {
      if (explicitHeight.endsWith('%') && pc) {
        add('h','ok',`Explicit height: ${explicitHeight}`,`${explicitHeight} of parent height (${pc.height}).`);
      } else {
        add('h','ok',`Explicit height: ${explicitHeight}`,`height is explicitly set to ${explicitHeight}${hasInlineHeight ? ' via inline style' : ' via CSS rule'}.`);
      }
    } else if (isTextDriven) {
      // Calculate approximate line count
      const lineHeight = cs.lineHeight;
      const lineHeightPx = lineHeight === 'normal'
        ? parseFloat(cs.fontSize) * 1.2  // browsers use ~1.2 for 'normal'
        : parseFloat(lineHeight);
      const contentHeight = rect.height - pV - bV;
      const approxLines = lineHeightPx > 0 ? Math.round(contentHeight / lineHeightPx) : '?';
      const lhDesc = lineHeight === 'normal'
        ? `line-height: normal (≈ font-size ${cs.fontSize} × 1.2 = ~${Math.round(lineHeightPx)}px)`
        : `line-height: ${lineHeight}`;
      const parts = [`~${approxLines} line${approxLines !== 1 ? 's' : ''} (${Math.round(lineHeightPx)}px × ${approxLines} = ${Math.round(contentHeight)}px)`];
      if (pV > 0) parts.push(`padding ${Math.round(pV)}px`);
      if (bV > 0) parts.push(`border ${Math.round(bV)}px`);
      add('h','default','Height from line-height × lines',
        `No explicit height. ${lhDesc}. ${parts.join(' + ')} = ${Math.round(rect.height)}px total.${lineHeight === 'normal' ? ' "normal" is font/UA dependent — exact px varies.' : ''}`);
    } else {
      add('h','default','Auto height (content-driven)',`No explicit height — grows to wrap its children. Total ${Math.round(rect.height)}px (padding contributes ${Math.round(pV)}px).`);
    }

    if (cs.minHeight&&cs.minHeight!=='0px') add('h','warn',`min-height: ${cs.minHeight}`,`Can't shrink below ${cs.minHeight}.`);
    if (cs.maxHeight&&cs.maxHeight!=='none') add('h','warn',`max-height: ${cs.maxHeight}`,`Height is capped at ${cs.maxHeight}.`);

    // MISC
    if (cs.aspectRatio&&cs.aspectRatio!=='auto')
      add('m','info',`aspect-ratio:${cs.aspectRatio}`,`One axis is derived from the other to maintain this ratio.`);

    if (['img','video','canvas','svg','iframe'].includes(tag))
      add('m','info','Replaced element',`<${tag}> has intrinsic dimensions${tag==='img'?" (the image's natural resolution)":""}. Displays at natural size unless overridden.`);

    if (cs.overflow!=='visible')
      add('m','info',`overflow:${cs.overflow}`,`Content that overflows is ${cs.overflow==='hidden'?'clipped':cs.overflow==='scroll'||cs.overflow==='auto'?'scrollable':cs.overflow}.`);

    return {
      tag, id: el.id, classes: [...el.classList].slice(0,4),
      width: Math.round(rect.width), height: Math.round(rect.height),
      reasons
    };
  }

  // ── Picking ──────────────────────────────────────────────────────────
  let picking = false;

  function onMove(e) {
    if (!picking || panel.contains(e.target)) return;
    highlightEl(e.target);
  }
  function onClick(e) {
    if (!picking || panel.contains(e.target)) return;
    e.preventDefault(); e.stopPropagation();
    const data = analyze(e.target);
    stopPicking();
    showResults(data);
  }

  function startPicking() {
    picking = true;
    document.body.style.cursor = 'crosshair';
    getOverlay();
    document.addEventListener('mousemove', onMove, true);
    document.addEventListener('click', onClick, true);
    panel.querySelector('#__dse-results').innerHTML = '';
    panel.querySelector('#__dse-cancel').style.display = 'block';
    const dot = panel.querySelector('#__dse-dot');
    dot.className = '';
    panel.querySelector('#__dse-stxt').textContent = 'Click any element on the page…';
  }

  function stopPicking() {
    picking = false;
    document.body.style.cursor = '';
    removeOverlay();
    document.removeEventListener('mousemove', onMove, true);
    document.removeEventListener('click', onClick, true);
  }

  function cancelPicking() {
    stopPicking();
    panel.querySelector('#__dse-stxt').textContent = 'Cancelled.';
    panel.querySelector('#__dse-cancel').style.display = 'none';
  }

  // ── Render ───────────────────────────────────────────────────────────
  function showResults(data) {
    panel.querySelector('#__dse-dot').className = 'done';
    panel.querySelector('#__dse-stxt').textContent = 'Element analyzed ✓';
    panel.querySelector('#__dse-cancel').style.display = 'none';

    const tagStr = `&lt;${data.tag}${data.id?'#'+data.id:''}${data.classes.length?'.'+data.classes.join('.'):''}&gt;`;

    const wr = data.reasons.filter(r=>r.axis==='w');
    const hr = data.reasons.filter(r=>r.axis==='h');
    const mr = data.reasons.filter(r=>r.axis==='m');

    const cards = arr => arr.map(r=>`
      <div class="dse-card ${r.level==='warn'?'warn':r.level==='info'?'info':r.level==='ok'?'ok':''}">
        <span class="dse-card-t">${r.title}</span>
        <span class="dse-card-d">${r.detail}</span>
      </div>`).join('');

    const res = panel.querySelector('#__dse-results');
    res.innerHTML = `
      <span class="dse-tag">${tagStr}</span>
      <div class="dse-sizes">
        <div class="dse-box"><span class="dse-box-label">Width</span><span class="dse-box-val">${data.width}<span class="dse-box-unit">px</span></span></div>
        <div class="dse-box"><span class="dse-box-label">Height</span><span class="dse-box-val">${data.height}<span class="dse-box-unit">px</span></span></div>
      </div>
      ${wr.length?`<span class="dse-section">↔ Width</span>${cards(wr)}`:''}
      ${hr.length?`<span class="dse-section">↕ Height</span>${cards(hr)}`:''}
      ${mr.length?`<span class="dse-section">⊡ Other Factors</span>${cards(mr)}`:''}
      <div id="__dse-again">🔍 Pick Another Element</div>
    `;
    res.querySelector('#__dse-again').addEventListener('click', startPicking);
  }

  // ── Init ─────────────────────────────────────────────────────────────
  window.__domSizePanel = { startPicking };
  startPicking();

  chrome.runtime.onMessage.addListener(msg => {
    if (msg.type === 'START_PICKING') startPicking();
    if (msg.type === 'CANCEL_PICKING') cancelPicking();
  });
})();
