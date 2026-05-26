// GLVE — Walkthrough scroll engine + Tweaks panel
// Reads window.GLVE_ENGINES, builds the right-column narrative
// and the left-column sticky canvas, drives state via IntersectionObserver.

(function () {
  'use strict';

  const ENGINES = window.GLVE_ENGINES || [];

  // ── Tweakable defaults ────────────────────────────────────────────
  const TWEAKS = /*EDITMODE-BEGIN*/{
    "pacing": 1.0,
    "accentMode": "system",
    "dataset": "mixed"
  }/*EDITMODE-END*/;

  // ── Helpers ──────────────────────────────────────────────────────
  const $  = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const el = (tag, attrs, kids) => {
    const n = document.createElement(tag);
    if (attrs) {
      for (const k in attrs) {
        if (k === 'class') n.className = attrs[k];
        else if (k === 'html') n.innerHTML = attrs[k];
        else if (k === 'style' && typeof attrs[k] === 'object') Object.assign(n.style, attrs[k]);
        else if (k.startsWith('data-')) n.setAttribute(k, attrs[k]);
        else n.setAttribute(k, attrs[k]);
      }
    }
    if (kids) (Array.isArray(kids) ? kids : [kids]).forEach(k => {
      if (k == null) return;
      n.appendChild(typeof k === 'string' ? document.createTextNode(k) : k);
    });
    return n;
  };

  // confidence pills: "conf:N" → 5 bars with N filled
  function confBars(token) {
    const m = /conf:(\d)/.exec(token);
    if (!m) return el('span', { class: 'muted' }, token);
    const n = parseInt(m[1], 10);
    const wrap = el('span', { class: 'conf' });
    for (let i = 0; i < 5; i++) wrap.appendChild(el('i', { class: i < n ? 'on' : '' }));
    return wrap;
  }

  function statusTag(token) {
    const lower = String(token).toLowerCase();
    if (lower === 'ok')      return el('span', { class: 'tag-mini ok' }, '✓ OK');
    if (lower === 'sent')    return el('span', { class: 'tag-mini ok' }, '✓ SENT');
    if (lower === 'live')    return el('span', { class: 'tag-mini amb' }, '● LIVE');
    if (lower === 'hold')    return el('span', { class: 'tag-mini amb' }, '◌ HOLD');
    if (lower === 'reroute') return el('span', { class: 'tag-mini' }, '⤳ REROUTE');
    return el('span', { class: 'tag-mini' }, token);
  }

  // ── Build narrative (right column) ──────────────────────────────
  function buildNarrative(host) {
    ENGINES.forEach((eng, i) => {
      const tone = eng.tone === 'amber' ? 'amber' : eng.tone === 'navy' ? 'navy' : '';
      const block = el('section', { class: 'engine-block', 'data-engine': eng.id });

      // Intro (engine name + lede)
      const intro = el('div', { class: 'engine-intro' }, [
        el('div', { class: 'num' }, [
          document.createTextNode('Engine '),
          el('strong', null, eng.id),
          document.createTextNode(' · ' + eng.tag),
        ]),
        el('h3', null, eng.name),
        el('p', { class: 'lede' }, [
          el('strong', null, eng.exec.what + ' '),
          document.createTextNode(eng.exec.how),
        ]),
      ]);
      block.appendChild(intro);

      // STATE 01 — Executive
      block.appendChild(el('section', {
        class: 'state-section ' + tone,
        'data-engine': eng.id, 'data-state': '1',
      }, [
        el('div', { class: 'tag' }, [
          el('span', { class: 'dot' }), document.createTextNode('State 01 · Executive Summary'),
        ]),
        el('h4', null, [
          document.createTextNode('Clean. Calm. '),
          el('span', { class: 'light' }, 'Executive-friendly.'),
        ]),
        el('p', { html: '<strong>Input:</strong> ' + eng.exec.input }),
        el('p', null, 'The engine surfaces only what an operator needs to decide whether to invest the next hour: what it does, how it does it, and what it takes in.'),
        el('p', null, 'A specialized intelligence module inside the Composable Agentic Architecture — a defined mandate, defined boundaries, defined output.'),
      ]));

      // STATE 02 — Operational depth (varies by engine.depth.kind)
      const depthCopy = el('section', {
        class: 'state-section ' + tone,
        'data-engine': eng.id, 'data-state': '2',
      });
      depthCopy.appendChild(el('div', { class: 'tag' }, [
        el('span', { class: 'dot' }), document.createTextNode('State 02 · Operational Depth'),
      ]));
      depthCopy.appendChild(el('h4', null, [
        document.createTextNode('Underneath the executive view. '),
        el('span', { class: 'light' }, 'Structured complexity.'),
      ]));
      depthCopy.appendChild(el('p', null, depthDescription(eng)));
      depthCopy.appendChild(el('p', null, 'No dashboard theatre — only the infrastructure required to make the next commitment defensible.'),);
      // source list
      if (eng.depth.kind === 'terminal') {
        const sl = el('div', { class: 'source-list' });
        new Set(eng.depth.lines.map(l => l.src)).forEach(s => sl.appendChild(el('span', null, s)));
        depthCopy.appendChild(sl);
      }
      block.appendChild(depthCopy);

      // STATE 03 — Dual-Output
      const nextEngLabel = eng.handoff.nextId
        ? ('Engine ' + eng.handoff.nextId + ' · ' + eng.handoff.nextName)
        : eng.handoff.nextName;
      block.appendChild(el('section', {
        class: 'state-section ' + tone,
        'data-engine': eng.id, 'data-state': '3',
      }, [
        el('div', { class: 'tag' }, [
          el('span', { class: 'dot' }), document.createTextNode('State 03 · Dual-Output Protocol'),
        ]),
        el('h4', null, [
          document.createTextNode('Two languages, simultaneously. '),
          el('span', { class: 'light' }, 'Audit → handoff.'),
        ]),
        el('p', { html: '<strong>Output 01 · Strategic Audit.</strong> Human-readable reasoning — sources, verification logic, decision rationale. The trust layer.' }),
        el('p', { html: '<strong>Output 02 · System Handoff.</strong> Only the verified variables required downstream. Zero-knowledge — the next engine inherits no messy reasoning, just a clean contract.' }),
        el('p', null, 'Downstream: ' + nextEngLabel + '.'),
      ]));

      // Transition (except for last) — Mail Carrier / Zero-Knowledge Handoff
      if (i < ENGINES.length - 1) {
        const next = ENGINES[i + 1];
        const v = eng.handoff && eng.handoff.variables ? eng.handoff.variables : 5;
        block.appendChild(el('div', { class: 'engine-divider' }, [
          el('span', { class: 'arrow' }, '→'),
          el('span', { class: 'txt' }, 'Handoff · zero-knowledge · ' + v + ' verified variables · ' + next.id + ' ' + next.name),
        ]));
      } else if (eng.handoff && eng.handoff.finalLabel) {
        block.appendChild(el('div', { class: 'engine-divider' }, [
          el('span', { class: 'arrow' }, '→'),
          el('span', { class: 'txt' }, eng.handoff.finalLabel),
        ]));
      }

      host.appendChild(block);
    });
  }

  function depthDescription(eng) {
    if (eng.depth.kind === 'terminal') {
      return 'Each source is queried in parallel — hiring systems, ecosystem feeds, leadership and funding wires. Confidence is raised only when independent sources agree.';
    }
    if (eng.depth.kind === 'nodes') {
      return 'Reporting lines, tenure, and authority signals resolve into a stakeholder map. Visible decision-makers and the quieter authority paths both surface.';
    }
    return 'The engine synthesizes everything it has been handed — tone, signal anchor, pain hypothesis, channel preference — into one operational unit per stakeholder.';
  }

  // ── Build canvas (left sticky) ──────────────────────────────────
  function buildCanvas() {
    // rail
    const rail = $('.canvas-rail');
    ENGINES.forEach(eng => {
      const tone = eng.tone === 'amber' ? 'amber' : eng.tone === 'navy' ? 'navy' : '';
      const chip = el('button', { class: 'rail-chip ' + tone, 'data-engine': eng.id }, [
        el('span', { class: 'num' }, eng.id),
        el('span', { class: 'name' }, eng.name),
      ]);
      chip.addEventListener('click', () => {
        const target = document.querySelector('[data-engine="' + eng.id + '"][data-state="1"]');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      rail.appendChild(chip);
    });

    // stage frame
    const stage = $('.stage');
    const body = $('.stage-body');
    body.innerHTML = '';

    // Three layers for cross-fade per engine
    ['exec', 'depth', 'output'].forEach((k) => {
      body.appendChild(el('div', { class: 'layer layer-' + k }));
    });
  }

  // ── Render the stage for a given engine + state ────────────────
  let currentKey = '';
  let currentState = 0;
  function setStage(eng, state) {
    const key = eng.id + ':' + state;
    if (key === currentKey) return;

    const prevState = currentState;
    const isUnfold      = prevState === 1 && state === 2;
    const isCompressing = prevState === 2 && state === 3;

    currentKey = key;
    currentState = state;

    const stage = $('.stage');
    stage.classList.remove('amber', 'navy');
    const tone = eng.tone === 'amber' ? 'amber' : eng.tone === 'navy' ? 'navy' : '';
    if (tone) stage.classList.add(tone);

    // STATE CLASS — drives the navy-flip / white-resolution choreography.
    // .state-02 = "Under the Hood": canvas flips dark navy (engine room).
    // .state-03 = "Resolution": clean white card emerges with a brief glow.
    stage.classList.remove('state-01', 'state-02', 'state-03');
    stage.classList.add('state-0' + state);
    const canvas = $('.canvas');
    if (canvas) {
      canvas.classList.remove('state-01', 'state-02', 'state-03');
      canvas.classList.add('state-0' + state);
    }

    // head
    $('.stage-eng .badge').textContent = eng.id;
    $('.stage-eng .name').textContent = eng.name;
    $('.stage-state').innerHTML = '';
    [1,2,3].forEach(s => {
      const cls = s === state ? 'pill live' : 'pill';
      $('.stage-state').appendChild(el('span', { class: cls }, 'State ' + String(s).padStart(2,'0')));
    });

    const layers = { 1: '.layer-exec', 2: '.layer-depth', 3: '.layer-output' };
    const target = $(layers[state]);
    const prev   = prevState ? $(layers[prevState]) : null;

    // clean transient animation classes off all layers
    $$('.layer').forEach(l => l.classList.remove('unfold', 'emerge', 'compress-out'));

    // outgoing
    if (prev && prev !== target) {
      if (isCompressing) {
        prev.classList.add('compress-out');
        setTimeout(() => { prev.classList.remove('show', 'compress-out'); }, 420);
      } else {
        prev.classList.remove('show');
      }
    }

    // render new content
    target.innerHTML = '';
    if (state === 1) renderExec(target, eng);
    if (state === 2) renderDepth(target, eng);
    if (state === 3) renderOutput(target, eng);

    // entrance class BEFORE show
    if (isUnfold)      target.classList.add('unfold');
    if (isCompressing) target.classList.add('emerge');

    const showDelay = isCompressing ? 140 : 0;
    setTimeout(() => {
      requestAnimationFrame(() => target.classList.add('show'));
    }, showDelay);
  }

  function renderExec(layer, eng) {
    const tone = eng.tone === 'amber' ? 'amber' : eng.tone === 'navy' ? 'navy' : '';
    const wrap = el('div', { class: 'exec ' + tone }, [
      el('div', { class: 'exec-tag' }, '— Executive Summary'),
      el('div', { class: 'exec-title' }, 'Engine ' + eng.id + ' · ' + eng.name),
      el('div', { class: 'exec-grid' }, [
        el('div', { class: 'exec-row' }, [
          el('div', { class: 'k' }, 'What'),
          el('div', { class: 'v' }, eng.exec.what),
        ]),
        el('div', { class: 'exec-row' }, [
          el('div', { class: 'k' }, 'How'),
          el('div', { class: 'v' }, eng.exec.how),
        ]),
        el('div', { class: 'exec-row' }, [
          el('div', { class: 'k' }, 'Input'),
          el('div', { class: 'v' }, eng.exec.input),
        ]),
      ]),
      el('div', { class: 'exec-foot' }, [
        el('div', { class: 'handoff' }, [
          el('span', { class: 'arrow' }, '↓'),
          el('span', null, eng.exec.handoffOut),
        ]),
      ]),
    ]);
    layer.appendChild(wrap);
  }

  function renderDepth(layer, eng) {
    // Density wrapper: API source strip + telemetry + viz
    const shell = el('div', { class: 'depth-shell' });

    // API source strip
    if (eng.depth.sources && eng.depth.sources.length) {
      const strip = el('div', { class: 'api-strip' });
      strip.appendChild(el('span', { class: 'api-lbl' }, 'Sources'));
      eng.depth.sources.forEach(s => {
        const cls = 'api-chip' + (s.live ? ' live' : '') + (s.more ? ' more' : '');
        const chip = el('span', { class: cls, title: s.name }, s.code);
        strip.appendChild(chip);
      });
      shell.appendChild(strip);
    }

    // Telemetry
    if (eng.depth.telemetry && eng.depth.telemetry.length) {
      const tele = el('div', { class: 'telemetry' });
      eng.depth.telemetry.forEach(t => {
        const cell = el('div', { class: 't-cell' + (t.live ? ' live' : '') }, [
          el('div', { class: 't-k' }, t.k),
          el('div', { class: 't-v' }, t.v),
        ]);
        tele.appendChild(cell);
      });
      shell.appendChild(tele);
    }

    // Main viz
    const viz = el('div', { class: 'depth-viz' });
    shell.appendChild(viz);
    layer.appendChild(shell);

    if (eng.depth.kind === 'terminal') return renderTerminal(viz, eng);
    if (eng.depth.kind === 'nodes')    return renderNodes(viz, eng);
    if (eng.depth.kind === 'panels')   return renderPanels(viz, eng);
  }

  function renderTerminal(layer, eng) {
    const head = el('div', { class: 'depth-head' }, [
      el('span', { class: 'ttl' }, eng.depth.title),
      el('span', { class: 'meter' }, [
        document.createTextNode('Confidence '),
        el('span', { class: 'bar' }, el('i', { class: 'fill' })),
      ]),
    ]);
    const term = el('div', { class: 'terminal' });
    layer.appendChild(head);
    layer.appendChild(term);

    // animate lines in
    const total = eng.depth.lines.length;
    eng.depth.lines.forEach((l, i) => {
      const row = el('div', { class: 'term-line ' + (l.cls || '') }, [
        el('span', { class: 't' }, l.t),
        el('span', { class: 'src' }, l.src),
        el('span', { class: 'msg' }, l.msg),
        el('span', { class: 'v' }, l.v),
      ]);
      term.appendChild(row);
      setTimeout(() => row.classList.add('in'), 80 + i * 90);
    });
    // fill meter
    setTimeout(() => {
      const fill = head.querySelector('.fill');
      if (fill) fill.style.width = '88%';
    }, 80 + total * 90 + 80);
  }

  function renderNodes(layer, eng) {
    const head = el('div', { class: 'depth-head' }, [
      el('span', { class: 'ttl' }, eng.depth.title),
      el('span', { class: 'meter' }, [
        document.createTextNode('Map · '),
        el('span', { class: 'bar' }, el('i', { class: 'fill' })),
      ]),
    ]);
    const stage = el('div', { class: 'nodes' });
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('preserveAspectRatio', 'none');
    stage.appendChild(svg);
    // legend
    const legend = el('div', { class: 'nodes-legend' });
    if (eng.depth.legend) {
      legend.appendChild(el('span', null, [el('i', { class: 'solid' }), document.createTextNode(eng.depth.legend[0] || '')]));
      legend.appendChild(el('span', null, [el('i'), document.createTextNode(eng.depth.legend[1] || '')]));
    }
    stage.appendChild(legend);

    layer.appendChild(head);
    layer.appendChild(stage);

    // place nodes after layout settles so we can read px positions
    requestAnimationFrame(() => {
      const rect = stage.getBoundingClientRect();
      const W = rect.width, H = rect.height;
      // size svg viewbox to match
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);

      // create nodes
      const placed = eng.depth.nodes.map((n) => {
        const cx = n.x * W / 100, cy = n.y * H / 100;
        const node = el('div', { class: 'node ' + (n.lead ? 'lead' : ''), style: { left: cx + 'px', top: cy + 'px', '--d': (n.d || 0) + 'ms' } }, [
          el('div', { class: 'dot' }),
          el('div', { class: 'lbl' }, n.lbl),
          el('div', { class: 'role' }, n.role || ''),
        ]);
        stage.appendChild(node);
        setTimeout(() => node.classList.add('in'), n.d || 0);
        return { node, cx, cy };
      });

      // edges
      (eng.depth.edges || []).forEach((e, i) => {
        const a = placed[e[0]], b = placed[e[1]];
        if (!a || !b) return;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const mx = (a.cx + b.cx) / 2;
        const my = (a.cy + b.cy) / 2 - 24;
        path.setAttribute('d', 'M' + a.cx + ',' + a.cy + ' Q' + mx + ',' + my + ' ' + b.cx + ',' + b.cy);
        path.setAttribute('class', 'node-line');
        svg.appendChild(path);
        setTimeout(() => path.classList.add('in'), 200 + i * 90);
      });

      setTimeout(() => {
        const fill = head.querySelector('.fill');
        if (fill) fill.style.width = '92%';
      }, 200 + (eng.depth.edges || []).length * 90 + 200);
    });
  }

  function renderPanels(layer, eng) {
    const head = el('div', { class: 'depth-head' }, [
      el('span', { class: 'ttl' }, eng.depth.title),
      el('span', { class: 'meter' }, [
        document.createTextNode('Synth · '),
        el('span', { class: 'bar' }, el('i', { class: 'fill' })),
      ]),
    ]);
    const grid = el('div', { class: 'panels' });
    eng.depth.panels.forEach((p, i) => {
      const body = el('div', { class: 'body' },
        p.rows.map(r => el('div', { class: 'row' }, [
          el('span', { class: 'k' }, r[0]),
          el('span', { class: 'v' }, r[1]),
        ]))
      );
      const panel = el('div', { class: 'panel', style: { '--d': (i * 120) + 'ms' } }, [
        el('div', { class: 'ph' }, [
          el('span', { class: 'lbl' }, p.lbl),
          el('span', { class: 'stat' }, p.stat),
        ]),
        body,
      ]);
      grid.appendChild(panel);
      setTimeout(() => panel.classList.add('in'), 80 + i * 120);
    });
    layer.appendChild(head);
    layer.appendChild(grid);

    setTimeout(() => {
      const fill = head.querySelector('.fill');
      if (fill) fill.style.width = '95%';
    }, 80 + eng.depth.panels.length * 120 + 80);
  }

  // STATE 03 — Dual-Output Protocol
  // Strategic Audit (table + summary) → compression beat → SYSTEM_HANDOFF JSON
  function renderOutput(layer, eng) {
    const audit = eng.audit;
    const ho = eng.handoff;
    const wrap = el('div', { class: 'dual' });

    // ── Output 01 · Strategic Audit ─────────────────────────────
    const auditSec = el('div', { class: 'dual-section reveal' });
    auditSec.appendChild(el('div', { class: 'dual-tag' }, [
      el('span', { class: 'badge audit' }, 'Output 01 · Strategic Audit'),
      document.createTextNode('Human-readable intelligence'),
    ]));
    auditSec.appendChild(el('div', { class: 'audit-head' }, [
      el('span', { class: 'ttl' }, eng.name + ' · verified output'),
      el('span', { class: 'meta' }, audit.meta),
    ]));
    auditSec.appendChild(el('div', { class: 'audit-summary' }, audit.summary));

    // table
    const tbl = el('div', { class: 'tbl' });
    const colTemplate = audit.cols;
    const head = el('div', { class: 'tbl-row head', style: { gridTemplateColumns: colTemplate } });
    audit.head.forEach(h => head.appendChild(el('div', null, h)));
    tbl.appendChild(head);

    const rows = filterRows(audit.rows, TWEAKS.dataset);
    rows.forEach((r) => {
      const row = el('div', { class: 'tbl-row', style: { gridTemplateColumns: colTemplate } });
      r.forEach((cell, ci) => {
        if (/^conf:\d/.test(cell)) row.appendChild(el('div', null, confBars(cell)));
        else if (/^(ok|sent|live|hold|reroute)$/i.test(cell)) row.appendChild(el('div', null, statusTag(cell)));
        else if (ci === 0) row.appendChild(el('div', { class: 'cmp' }, cell));
        else row.appendChild(el('div', { class: 'muted' }, cell));
      });
      tbl.appendChild(row);
    });
    auditSec.appendChild(tbl);
    wrap.appendChild(auditSec);

    // ── Compression beat ────────────────────────────────────────
    wrap.appendChild(el('div', { class: 'compress' }, [
      el('span', { class: 'rule' }),
      el('span', { class: 'pill' }, 'Compression · audit → handoff'),
      el('span', { class: 'rule' }),
    ]));

    // ── Output 02 · System Handoff ──────────────────────────────
    const handoffSec = el('div', { class: 'dual-section reveal delayed' });
    handoffSec.appendChild(el('div', { class: 'dual-tag' }, [
      el('span', { class: 'badge handoff' }, 'Output 02 · System Handoff'),
      document.createTextNode('Machine-readable orchestration'),
    ]));
    handoffSec.appendChild(renderJsonBlock(ho));

    const nextLabel = ho.nextId
      ? ('Engine ' + ho.nextId + ' · ' + ho.nextName)
      : ho.nextName;
    handoffSec.appendChild(el('div', { class: 'handoff-foot' }, [
      el('span', null, 'Zero-knowledge · ' + ho.variables + ' verified variables'),
      el('span', { class: 'next-pill' }, [
        el('span', { class: 'arrow' }, '→'),
        el('span', null, nextLabel),
      ]),
    ]));
    wrap.appendChild(handoffSec);

    layer.appendChild(wrap);
  }

  function renderJsonBlock(ho) {
    const block = el('div', { class: 'handoff-block' });
    const open  = el('div', { class: 'tag-line' }, '<SYSTEM_HANDOFF>');
    const close = el('div', { class: 'tag-line' }, '</SYSTEM_HANDOFF>');
    block.appendChild(open);
    block.appendChild(el('div', { class: 'punct' }, '{'));
    const keys = Object.keys(ho.json);
    keys.forEach((k, i) => {
      const v = ho.json[k];
      const line = el('div', { class: 'kv' });
      line.appendChild(el('span', { class: 'punct' }, '"'));
      line.appendChild(el('span', { class: 'key' }, k));
      line.appendChild(el('span', { class: 'punct' }, '": '));
      line.appendChild(renderJsonValue(v));
      if (i < keys.length - 1) line.appendChild(el('span', { class: 'punct' }, ','));
      block.appendChild(line);
    });
    block.appendChild(el('div', { class: 'punct' }, '}'));
    block.appendChild(close);
    return block;
  }

  function renderJsonValue(v) {
    if (v == null) return el('span', { class: 'null' }, 'null');
    if (typeof v === 'number') return el('span', { class: 'num' }, String(v));
    if (typeof v === 'boolean') return el('span', { class: 'bool' }, String(v));
    if (Array.isArray(v)) {
      const wrap = el('span');
      wrap.appendChild(el('span', { class: 'punct' }, '['));
      v.forEach((item, i) => {
        wrap.appendChild(renderJsonValue(item));
        if (i < v.length - 1) wrap.appendChild(el('span', { class: 'punct' }, ', '));
      });
      wrap.appendChild(el('span', { class: 'punct' }, ']'));
      return wrap;
    }
    // string
    const wrap = el('span');
    wrap.appendChild(el('span', { class: 'punct' }, '"'));
    wrap.appendChild(el('span', { class: 'str' }, String(v)));
    wrap.appendChild(el('span', { class: 'punct' }, '"'));
    return wrap;
  }

  function filterRows(rows, dataset) {
    if (dataset === 'all-placeholder') {
      // first row → placeholder too
      return rows.map((r, i) => {
        if (i !== 0) return r;
        return r.map((c, ci) => (ci < 2 ? '[' + (ci === 0 ? 'Account A' : 'Detail') + ']' : c));
      });
    }
    return rows;
  }

  // ── Rail update ────────────────────────────────────────────────
  function updateRail(engineId) {
    const chips = $$('.rail-chip');
    const idx = ENGINES.findIndex(e => e.id === engineId);
    chips.forEach((c, i) => {
      c.classList.remove('active', 'done');
      if (i < idx) c.classList.add('done');
      if (i === idx) c.classList.add('active');
    });
  }

  // ── Scroll watcher ─────────────────────────────────────────────
  function watchScroll() {
    const sections = $$('.state-section[data-engine]');
    if (!sections.length) return;
    const io = new IntersectionObserver((entries) => {
      // pick the entry whose target is closest to viewport center
      let best = null;
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const r = e.target.getBoundingClientRect();
        const dist = Math.abs((r.top + r.height / 2) - window.innerHeight / 2);
        if (!best || dist < best.dist) best = { dist, target: e.target };
      });
      if (!best) return;
      const engineId = best.target.getAttribute('data-engine');
      const state = parseInt(best.target.getAttribute('data-state'), 10);
      const eng = ENGINES.find(e => e.id === engineId);
      if (!eng) return;
      setStage(eng, state);
      updateRail(engineId);
    }, {
      // trigger when the section's center is in the middle 30% band
      rootMargin: '-35% 0px -35% 0px',
      threshold: 0,
    });
    sections.forEach(s => io.observe(s));

    // progress bar
    const progress = $('.progress');
    function onScroll() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, window.scrollY / h));
      progress.style.setProperty('--p', (p * 100).toFixed(2) + '%');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Tweaks panel ──────────────────────────────────────────────
  function setupTweaks() {
    const panel = $('.tweaks-panel');
    if (!panel) return;

    // Build panel
    panel.innerHTML = `
      <div class="tw-head">
        <h6>Tweaks</h6>
        <button class="tw-close" aria-label="Close">✕</button>
      </div>
      <div class="tw-row">
        <label>Scroll pacing <span class="val" data-out="pacing">${TWEAKS.pacing.toFixed(2)}×</span></label>
        <input type="range" min="0.5" max="2" step="0.1" data-key="pacing" value="${TWEAKS.pacing}">
      </div>
      <div class="tw-row">
        <label>Accent mode <span class="val" data-out="accentMode">${TWEAKS.accentMode}</span></label>
        <div class="seg" data-seg="accentMode">
          <button data-v="system">System</button>
          <button data-v="ink-only">Ink only</button>
        </div>
      </div>
      <div class="tw-row">
        <label>Output dataset <span class="val" data-out="dataset">${TWEAKS.dataset}</span></label>
        <div class="seg" data-seg="dataset">
          <button data-v="mixed">Mixed</button>
          <button data-v="all-placeholder">Placeholder</button>
        </div>
      </div>
    `;

    function applyTweaks() {
      // pacing → CSS var
      document.documentElement.style.setProperty('--pace', TWEAKS.pacing);
      // accent mode
      document.documentElement.classList.toggle('ink-only', TWEAKS.accentMode === 'ink-only');
      // labels
      $('[data-out="pacing"]', panel).textContent = TWEAKS.pacing.toFixed(2) + '×';
      $('[data-out="accentMode"]', panel).textContent = TWEAKS.accentMode === 'ink-only' ? 'ink only' : 'system';
      $('[data-out="dataset"]', panel).textContent = TWEAKS.dataset;
      // segmented "on" states
      $$('.seg', panel).forEach(seg => {
        const key = seg.getAttribute('data-seg');
        $$('button', seg).forEach(b => b.classList.toggle('on', b.getAttribute('data-v') === TWEAKS[key]));
      });
      // re-render current stage output
      currentKey = '';
      // re-fire: find currently active narrative section
      const sections = $$('.state-section[data-engine]');
      let best = null;
      sections.forEach(s => {
        const r = s.getBoundingClientRect();
        const dist = Math.abs((r.top + r.height / 2) - window.innerHeight / 2);
        if (!best || dist < best.dist) best = { dist, target: s };
      });
      if (best) {
        const eng = ENGINES.find(e => e.id === best.target.getAttribute('data-engine'));
        const state = parseInt(best.target.getAttribute('data-state'), 10);
        if (eng) setStage(eng, state);
      }
    }

    // Inputs
    panel.querySelector('[data-key="pacing"]').addEventListener('input', (e) => {
      TWEAKS.pacing = parseFloat(e.target.value);
      applyTweaks();
      persist({ pacing: TWEAKS.pacing });
    });
    $$('.seg button', panel).forEach(btn => {
      btn.addEventListener('click', () => {
        const seg = btn.closest('.seg');
        const key = seg.getAttribute('data-seg');
        const v = btn.getAttribute('data-v');
        TWEAKS[key] = v;
        applyTweaks();
        persist({ [key]: v });
      });
    });
    panel.querySelector('.tw-close').addEventListener('click', () => {
      panel.classList.remove('open');
      try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch(e){}
    });

    // host protocol
    window.addEventListener('message', (e) => {
      const data = e.data || {};
      if (data.type === '__activate_edit_mode')   panel.classList.add('open');
      if (data.type === '__deactivate_edit_mode') panel.classList.remove('open');
    });
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch(e){}

    applyTweaks();
  }

  function persist(edits) {
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*'); } catch(e){}
  }

  // ── Path activation (A: standalone Engine 04 · B: full loop) ───
  function setupPaths() {
    const wt = document.querySelector('.walkthrough');
    if (!wt) return;

    function apply(mode) {
      wt.setAttribute('data-mode', mode);
      // visual state on path cards
      document.querySelectorAll('.path').forEach(p => {
        p.classList.toggle('selected', p.getAttribute('data-path') === mode);
      });
      // update sticky mode indicator
      const tag = document.querySelector('[data-mode-tag] .wm-name');
      if (tag) {
        tag.textContent = mode === 'A'
          ? 'Path A · standalone utility · Engine 04 only'
          : 'Path B · Full Orchestrated Play · 6 engines';
      }
      try { sessionStorage.setItem('glve.path', mode); } catch(e){}
      // recompute scroll-driven state in case visibility changed
      window.dispatchEvent(new Event('scroll'));
    }

    document.querySelectorAll('.path-cta').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        apply(btn.getAttribute('data-activate'));
        // smooth-scroll the user into the walkthrough so they feel the effect
        const target = btn.getAttribute('data-activate') === 'A'
          ? document.querySelector('[data-engine="04"][data-state="1"]')
          : document.querySelector('[data-engine="01"][data-state="1"]');
        if (target) {
          setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
        }
      });
    });

    // hydrate from session
    let initial = 'B';
    try { initial = sessionStorage.getItem('glve.path') || 'B'; } catch(e){}
    apply(initial);
  }

  // ── Boot ──────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    buildNarrative($('.narrative-col'));
    buildCanvas();
    setupPaths();
    if (ENGINES.length) setStage(ENGINES[0], 1);
    watchScroll();
    setupTweaks();
  });
})();
