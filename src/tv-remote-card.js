const VERSION = "1.5.0";

const POWER_POLL_THROTTLE_MS = 800;
const POWER_POLL_POST_TOGGLE_DELAYS = [1500, 3500, 6000];

const MEDIA_BTNS = [
  { id: "previous", icon: "mdi:skip-previous", cmd: "MEDIA_PREVIOUS" },
  { id: "rewind",   icon: "mdi:rewind",        cmd: "MEDIA_REWIND" },
  { id: "play",     icon: "mdi:play",          cmd: "MEDIA_PLAY_PAUSE", dynamic: true },
  { id: "forward",  icon: "mdi:fast-forward",  cmd: "MEDIA_FAST_FORWARD" },
  { id: "next",     icon: "mdi:skip-next",     cmd: "MEDIA_NEXT" },
];

const NAV_BTNS = [
  { id: "back", icon: "mdi:arrow-left", cmd: "BACK" },
  { id: "home", icon: "mdi:home",       cmd: "HOME" },
];

const DIR_CMD = { up: "DPAD_UP", down: "DPAD_DOWN", left: "DPAD_LEFT", right: "DPAD_RIGHT" };

const CSS = `
:host { display: block; }
.r {
  display: flex; flex-direction: column; gap: 6px; padding: 8px;
  max-width: 480px; margin: 0 auto;
  color: var(--primary-text-color);
  font-family: var(--paper-font-body1_-_font-family, system-ui, sans-serif);
}
.apps, .row {
  display: grid; grid-auto-flow: column; grid-auto-columns: 1fr;
  gap: 6px; padding: 4px; border-radius: 16px;
  background: var(--ha-card-background, var(--card-background-color, rgba(127,127,127,.08)));
}
.app, .b {
  display: flex; align-items: center; justify-content: center;
  background: transparent; border: 1px solid var(--divider-color);
  border-radius: 12px; cursor: pointer; user-select: none;
  transition: background .15s, transform .08s;
  color: inherit; padding: 0;
}
.app { padding: 14px 0; color: var(--app-color); }
.app ha-icon { --mdc-icon-size: 26px; }
.app:active { transform: scale(.95); }
.app.on { background: var(--app-color); color: white; }
.b { padding: 18px 0; }
.b ha-icon { --mdc-icon-size: 30px; }
.b:active { transform: scale(.95); background: var(--accent-color, #ff9800); color: white; }
.b.on { background: var(--accent-color, #ff9800); color: white; }
.pad {
  position: relative; height: 320px; border-radius: 16px;
  background: rgba(127,127,127,.12);
  overflow: hidden; touch-action: none; user-select: none;
}
.pad canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.vol {
  display: flex; align-items: center; gap: 8px; padding: 6px 8px;
  border-radius: 16px;
  background: var(--ha-card-background, var(--card-background-color, rgba(127,127,127,.08)));
}
.mute {
  display: flex; align-items: center; justify-content: center;
  padding: 10px; border-radius: 10px;
  background: transparent; border: 1px solid var(--divider-color);
  color: inherit; cursor: pointer;
}
.mute ha-icon { --mdc-icon-size: 22px; }
.vv { width: 32px; text-align: center; color: var(--secondary-text-color); font-variant-numeric: tabular-nums; font-size: 14px; }
input[type=range] {
  -webkit-appearance: none; appearance: none;
  flex: 1; height: 6px; border-radius: 3px;
  background: var(--divider-color, rgba(127,127,127,.4));
  outline: none; cursor: pointer; margin: 0;
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none; appearance: none;
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--primary-color, #03a9f4);
  border: 2px solid var(--card-background-color, #fff); cursor: pointer;
}
input[type=range]::-moz-range-thumb {
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--primary-color, #03a9f4);
  border: 2px solid var(--card-background-color, #fff); cursor: pointer;
}
.ov {
  position: fixed; inset: 0; background: rgba(0,0,0,.55);
  display: flex; align-items: center; justify-content: center;
  z-index: 99999;
}
.ov .box {
  background: var(--ha-card-background, var(--card-background-color, #222));
  color: var(--primary-text-color);
  padding: 16px; border-radius: 14px; width: min(420px, 90vw);
  display: flex; flex-direction: column; gap: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,.4);
}
.ov h3 { margin: 0; font-size: 15px; font-weight: 500; }
.ov input {
  background: var(--secondary-background-color, rgba(127,127,127,.15));
  border: 1px solid var(--divider-color); color: inherit;
  padding: 10px 12px; border-radius: 8px; font-size: 16px; outline: none;
}
.ov .acts { display: flex; gap: 8px; justify-content: flex-end; }
.ov button {
  padding: 8px 14px; border-radius: 8px;
  background: var(--secondary-background-color, rgba(127,127,127,.15));
  border: 1px solid var(--divider-color);
  color: inherit; cursor: pointer; font-size: 14px;
}
.ov button.primary { background: var(--primary-color, #03a9f4); color: white; border-color: transparent; }
`;

class TvRemoteCard extends HTMLElement {
  static getStubConfig() {
    return {
      entities: {
        tv: "media_player.tv",
        remote: "remote.shield",
        media: "media_player.shield_cast",
        adb: "media_player.shield_adb",
        volume: "media_player.tv",
      },
      power_script: "script.tv_toggle_screen",
      shield_source: "SHIELD Game Console",
      apps: [],
      sources: [],
    };
  }

  static getConfigElement() {
    if (!customElements.get("tv-remote-card-editor")) {
      customElements.define("tv-remote-card-editor", TvRemoteCardEditor);
    }
    return document.createElement("tv-remote-card-editor");
  }

  setConfig(config) {
    if (!config) throw new Error("Missing config");
    const stub = TvRemoteCard.getStubConfig();
    this._config = {
      ...stub,
      ...config,
      entities: { ...stub.entities, ...(config.entities || {}) },
      apps: Array.isArray(config.apps) ? config.apps : [],
      sources: Array.isArray(config.sources) ? config.sources : [],
    };
    if (!this._built) this._build();
    else this._renderApps();
  }

  set hass(hass) {
    this._hass = hass;
    this._update();
  }

  get hass() { return this._hass; }

  getCardSize() { return 9; }

  _build() {
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<style>${CSS}</style>
      <div class="r">
        <div class="row" data-nav></div>
        <div class="apps" data-apps></div>
        <div class="pad" data-pad><canvas></canvas></div>
        <div class="row" data-media></div>
        <div class="vol">
          <button class="mute" data-mute aria-label="Mute"><ha-icon icon="mdi:volume-high"></ha-icon></button>
          <span class="vv" data-vv>0</span>
          <input type="range" data-vol min="0" max="100" step="5" value="0">
        </div>
      </div>`;
    this._renderApps();
    this._renderRow("nav", NAV_BTNS);
    this._appendNavExtras();
    this._renderRow("media", MEDIA_BTNS);
    this._setupPad();
    this._setupVolume();
    this._setupPowerPolling();
    this._built = true;
  }

  _setupPowerPolling() {
    this._visHandler = () => {
      if (document.visibilityState === "visible") this._maybeRefreshPower();
    };
    document.addEventListener("visibilitychange", this._visHandler);
  }

  _allButtons() {
    return [
      ...this._config.apps.map(a => ({ ...a, kind: "app" })),
      ...this._config.sources.map(s => ({ ...s, kind: "source" })),
    ];
  }

  _renderApps() {
    if (!this.shadowRoot) return;
    const el = this.shadowRoot.querySelector("[data-apps]");
    if (!el) return;
    el.innerHTML = "";
    const items = this._allButtons();
    el.style.display = items.length ? "" : "none";
    for (const item of items) {
      const btn = document.createElement("button");
      btn.className = "app";
      btn.dataset.app = item.id;
      btn.style.setProperty("--app-color", item.color || "var(--primary-text-color)");
      btn.innerHTML = `<ha-icon icon="${item.icon}"></ha-icon>`;
      btn.addEventListener("click", () => this._launchItem(item));
      el.appendChild(btn);
    }
  }

  _renderRow(which, items) {
    const el = this.shadowRoot.querySelector(`[data-${which}]`);
    el.innerHTML = "";
    for (const it of items) {
      const btn = document.createElement("button");
      btn.className = "b";
      btn.dataset.id = it.id;
      btn.innerHTML = `<ha-icon icon="${it.icon}"></ha-icon>`;
      btn.addEventListener("click", () => this._sendCommand(it.cmd));
      el.appendChild(btn);
    }
  }

  _appendNavExtras() {
    const nav = this.shadowRoot.querySelector("[data-nav]");
    const kb = document.createElement("button");
    kb.className = "b"; kb.dataset.id = "keyboard";
    kb.innerHTML = `<ha-icon icon="mdi:keyboard"></ha-icon>`;
    kb.addEventListener("click", () => this._openKeyboard());
    nav.appendChild(kb);
    const pwr = document.createElement("button");
    pwr.className = "b"; pwr.dataset.id = "power";
    pwr.innerHTML = `<ha-icon icon="mdi:power"></ha-icon>`;
    pwr.addEventListener("click", () => this._togglePower());
    nav.appendChild(pwr);
  }

  _update() {
    if (!this._hass || !this._built) return;
    const e = this._config.entities;
    const tv = this._hass.states[e.tv];
    const adb = this._hass.states[e.adb];
    const media = this._hass.states[e.media];

    const tvSource = tv?.attributes?.source;
    const adbAppId = adb?.attributes?.app_id;

    let activeId = null;
    const srcMatch = this._config.sources.find(s => s.source === tvSource);
    if (srcMatch) activeId = srcMatch.id;
    else if (adbAppId) {
      const appMatch = this._config.apps.find(a => a.app_id === adbAppId);
      if (appMatch) activeId = appMatch.id;
    }
    for (const el of this.shadowRoot.querySelectorAll(".app")) {
      el.classList.toggle("on", el.dataset.app === activeId);
    }

    const curTvState = tv?.state;
    if (curTvState !== this._lastTvState) {
      this._lastTvState = curTvState;
      if (curTvState === "on") this._maybeRefreshPower();
      else this._setScreenOn(false);
    } else if (curTvState === "on" && this._screenOn === undefined) {
      this._maybeRefreshPower();
    }

    const playBtn = this.shadowRoot.querySelector('[data-id="play"]');
    if (playBtn) {
      const playing = media && !["playing", "idle"].includes(media.state);
      const want = playing ? "mdi:pause" : "mdi:play";
      const ic = playBtn.querySelector("ha-icon");
      if (ic && ic.getAttribute("icon") !== want) ic.setAttribute("icon", want);
    }

    const volEnt = this._hass.states[e.volume];
    const lvl = volEnt?.attributes?.volume_level;
    const muted = volEnt?.attributes?.is_volume_muted;
    if (lvl != null && !this._volDragging) {
      const v = Math.round(lvl * 100 / 5) * 5;
      const slider = this.shadowRoot.querySelector("[data-vol]");
      const vv = this.shadowRoot.querySelector("[data-vv]");
      if (Number(slider.value) !== v) slider.value = v;
      if (vv.textContent != v) vv.textContent = v;
    }
    const muteIc = this.shadowRoot.querySelector("[data-mute] ha-icon");
    if (muteIc) {
      const want = muted ? "mdi:volume-mute" : (lvl === 0 ? "mdi:volume-low" : "mdi:volume-high");
      if (muteIc.getAttribute("icon") !== want) muteIc.setAttribute("icon", want);
    }
  }

  _launchItem(item) {
    const e = this._config.entities;
    const tv = this._hass.states[e.tv];
    const reachable = tv && !["unavailable", "off"].includes(tv.state);
    const onShield = reachable && this._config.shield_source
      && tv.attributes?.source === this._config.shield_source;
    const screenActive = this._screenOn !== false;

    if (item.kind === "source") {
      // Switching a TV input goes through the webOS API. When the panel is
      // blanked or on another input that API is often unreachable, so a Shield
      // HOME press first asserts CEC active-source to wake the TV, then select.
      const doSelect = () => this._hass.callService("media_player", "select_source",
        { source: item.source }, { entity_id: e.tv });
      if (reachable) {
        doSelect();
      } else {
        this._cecWake();
        setTimeout(doSelect, 1200);
      }
      return;
    }

    // App launch. The launch always reaches the Shield, but the TV only shows
    // it if the TV is awake and on the Shield input. When it isn't (blanked or
    // on another HDMI) the webOS select_source can't help — the webOS API is
    // unreachable — so wake via CEC (Shield HOME), same as the manual fix.
    const launch = () => this._hass.callService("remote", "turn_on",
      { activity: item.activity }, { entity_id: e.remote });

    if (onShield && screenActive) {
      launch();
      return;
    }
    this._cecWake();
    if (reachable && this._config.shield_source) {
      this._hass.callService("media_player", "select_source",
        { source: this._config.shield_source }, { entity_id: e.tv });
    }
    setTimeout(launch, 500);
  }

  _cecWake() {
    // HOME on the Shield triggers HDMI-CEC one-touch-play: the TV powers on and
    // switches to the Shield input over the CEC bus — works even when the TV's
    // webOS (network) API is unreachable, which is why pressing Home recovers it.
    this._hass.callService("remote", "send_command",
      { command: "HOME" }, { entity_id: this._config.entities.remote });
  }

  _sendCommand(cmd) {
    this._hass.callService("remote", "send_command",
      { command: cmd },
      { entity_id: this._config.entities.remote });
  }

  _togglePower() {
    if (this._config.power_script) {
      const [d, n] = this._config.power_script.split(".");
      this._hass.callService(d, n, {});
    } else {
      this._hass.callService("media_player", "toggle", {},
        { entity_id: this._config.entities.tv });
    }
    for (const delay of POWER_POLL_POST_TOGGLE_DELAYS) {
      setTimeout(() => {
        this._lastPwrPoll = Date.now();
        this._refreshPowerState();
      }, delay);
    }
  }

  async _refreshPowerState() {
    if (!this._hass?.connection) return;
    const tvEnt = this._config.entities.tv;
    const tv = this._hass.states[tvEnt];
    if (!tv || ["unavailable", "off"].includes(tv.state)) {
      this._setScreenOn(false);
      return;
    }
    try {
      const result = await this._hass.connection.sendMessagePromise({
        type: "call_service",
        domain: "webostv",
        service: "command",
        service_data: { command: "com.webos.service.tvpower/power/getPowerState" },
        target: { entity_id: tvEnt },
        return_response: true,
      });
      const resp = result?.response ?? result?.service_response ?? result;
      const respState = resp?.[tvEnt]?.state;
      this._setScreenOn(respState === "Active");
    } catch {
      this._setScreenOn(false);
    }
  }

  _maybeRefreshPower() {
    const now = Date.now();
    if (this._lastPwrPoll && now - this._lastPwrPoll < POWER_POLL_THROTTLE_MS) return;
    this._lastPwrPoll = now;
    this._refreshPowerState();
  }

  _setScreenOn(v) {
    this._screenOn = !!v;
    const pwrBtn = this.shadowRoot?.querySelector('[data-id="power"]');
    if (pwrBtn) pwrBtn.classList.toggle("on", this._screenOn);
  }

  _openKeyboard() {
    const ov = document.createElement("div");
    ov.className = "ov";
    ov.innerHTML = `<div class="box">
      <h3>Send text to Shield</h3>
      <input type="text" autocomplete="off" placeholder="Type then Send / Enter">
      <div class="acts">
        <button data-act="cancel">Cancel</button>
        <button data-act="send" class="primary">Send</button>
      </div></div>`;
    this.shadowRoot.appendChild(ov);
    const input = ov.querySelector("input");
    setTimeout(() => input.focus(), 50);
    const close = () => ov.remove();
    const send = () => {
      const t = input.value;
      if (t) this._sendCommand(`text:${t}`);
      close();
    };
    ov.addEventListener("click", (e) => { if (e.target === ov) close(); });
    ov.querySelector('[data-act="cancel"]').addEventListener("click", close);
    ov.querySelector('[data-act="send"]').addEventListener("click", send);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") send();
      else if (e.key === "Escape") close();
    });
  }

  _setupVolume() {
    const slider = this.shadowRoot.querySelector("[data-vol]");
    const vv = this.shadowRoot.querySelector("[data-vv]");
    let pending = null;
    let timer = null;
    slider.addEventListener("input", (ev) => {
      const v = Number(ev.target.value);
      vv.textContent = v;
      this._volDragging = true;
      pending = v;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (pending == null) return;
        this._hass.callService("media_player", "volume_set",
          { volume_level: pending / 100 },
          { entity_id: this._config.entities.volume });
        pending = null;
      }, 180);
    });
    slider.addEventListener("change", () => {
      setTimeout(() => { this._volDragging = false; }, 400);
    });
    this.shadowRoot.querySelector("[data-mute]").addEventListener("click", () => {
      const volEnt = this._hass.states[this._config.entities.volume];
      const muted = !volEnt?.attributes?.is_volume_muted;
      this._hass.callService("media_player", "volume_mute",
        { is_volume_muted: muted },
        { entity_id: this._config.entities.volume });
    });
  }

  _setupPad() {
    const pad = this.shadowRoot.querySelector("[data-pad]");
    const canvas = pad.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const THRESHOLD = 80;
    const REPEAT_MS = 200;
    let start = null;
    let last = null;
    let currentDir = null;
    let repeatTimer = null;
    let active = false;
    let px = 0, py = 0;
    let glow = 0;
    let raf = 0;

    const resize = () => {
      const r = pad.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(pad);
    resize();

    const isDark = () => {
      const cs = getComputedStyle(this);
      const c = cs.getPropertyValue("--primary-text-color").trim();
      return c.startsWith("#f") || c.startsWith("#e") || c.toLowerCase().includes("rgb(2") || window.matchMedia("(prefers-color-scheme: dark)").matches;
    };

    const draw = () => {
      const r = pad.getBoundingClientRect();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,.10)";
      ctx.fillRect(0, 0, r.width, r.height);
      ctx.globalCompositeOperation = "source-over";

      if (active) glow = Math.min(1, glow + 0.08);
      else glow = Math.max(0, glow - 0.04);

      if (glow > 0.01) {
        const baseRgb = isDark() ? "255,255,255" : "0,0,0";
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 110);
        grad.addColorStop(0,    `rgba(${baseRgb},${0.35 * glow})`);
        grad.addColorStop(0.5,  `rgba(${baseRgb},${0.12 * glow})`);
        grad.addColorStop(1,    `rgba(${baseRgb},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, 110, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const clearRepeat = () => { if (repeatTimer) { clearInterval(repeatTimer); repeatTimer = null; } };
    const startRepeat = (dir) => {
      clearRepeat();
      currentDir = dir;
      this._sendCommand(DIR_CMD[dir]);
      repeatTimer = setInterval(() => {
        if (currentDir) this._sendCommand(DIR_CMD[currentDir]);
      }, REPEAT_MS);
    };
    const stopRepeat = () => { clearRepeat(); currentDir = null; };

    pad.addEventListener("pointerdown", (e) => {
      pad.setPointerCapture(e.pointerId);
      const r = pad.getBoundingClientRect();
      px = e.clientX - r.left; py = e.clientY - r.top;
      active = true;
      start = { x: e.clientX, y: e.clientY };
      last = { x: e.clientX, y: e.clientY };
    });
    pad.addEventListener("pointermove", (e) => {
      const r = pad.getBoundingClientRect();
      px = e.clientX - r.left; py = e.clientY - r.top;
      if (!last) return;
      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      let dir = null;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > THRESHOLD) dir = dx > 0 ? "right" : "left";
      else if (Math.abs(dy) > THRESHOLD) dir = dy > 0 ? "down" : "up";
      if (dir) {
        last = { x: e.clientX, y: e.clientY };
        if (dir !== currentDir) startRepeat(dir);
      } else if (currentDir) {
        stopRepeat();
      }
    });
    const release = (e) => {
      active = false;
      stopRepeat();
      if (start) {
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) this._sendCommand("DPAD_CENTER");
      }
      start = null; last = null;
    };
    pad.addEventListener("pointerup", release);
    pad.addEventListener("pointercancel", release);
    pad.addEventListener("pointerleave", () => {
      if (!start) return;
      active = false; stopRepeat();
      start = null; last = null;
    });

    this._teardownPad = () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }

  disconnectedCallback() {
    this._teardownPad?.();
    if (this._visHandler) {
      document.removeEventListener("visibilitychange", this._visHandler);
      this._visHandler = null;
    }
  }
}

const TOP_SCHEMA = [
  { type: "grid", name: "entities", schema: [
    { name: "tv",     selector: { entity: { filter: { domain: "media_player" } } } },
    { name: "remote", selector: { entity: { filter: { domain: "remote" } } } },
    { name: "media",  selector: { entity: { filter: { domain: "media_player" } } } },
    { name: "adb",    selector: { entity: { filter: { domain: "media_player" } } } },
    { name: "volume", selector: { entity: { filter: { domain: "media_player" } } } },
  ]},
  { name: "power_script",  selector: { entity: { filter: { domain: "script" } } } },
  { name: "shield_source", selector: { text: {} } },
];

const APP_SCHEMA = [
  { name: "id",       selector: { text: {} } },
  { name: "icon",     selector: { icon: {} } },
  { name: "color",    selector: { text: {} } },
  { name: "activity", selector: { text: {} } },
  { name: "app_id",   selector: { text: {} } },
];

const SOURCE_SCHEMA = [
  { name: "id",     selector: { text: {} } },
  { name: "icon",   selector: { icon: {} } },
  { name: "color",  selector: { text: {} } },
  { name: "source", selector: { text: {} } },
];

const EDITOR_CSS = `
:host { display: block; padding: 12px; }
.ed { display: flex; flex-direction: column; gap: 18px; }
h3 { margin: 0 0 6px; font-size: 13px; font-weight: 600; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: .04em; }
.list { display: flex; flex-direction: column; gap: 8px; }
.row {
  display: flex; gap: 8px; align-items: flex-start;
  padding: 10px; border: 1px solid var(--divider-color); border-radius: 10px;
  background: var(--secondary-background-color, rgba(127,127,127,.05));
}
.row ha-form { flex: 1; min-width: 0; }
.rm {
  background: transparent; border: 1px solid var(--divider-color);
  border-radius: 6px; color: var(--error-color, #c00);
  cursor: pointer; padding: 4px 10px; font-size: 18px; line-height: 1;
  align-self: center;
}
.add {
  padding: 8px 14px; background: var(--secondary-background-color, rgba(127,127,127,.1));
  border: 1px dashed var(--divider-color); border-radius: 8px;
  color: var(--primary-text-color); cursor: pointer;
  align-self: flex-start; font-size: 14px;
}
.add:hover { background: var(--secondary-background-color, rgba(127,127,127,.18)); }
.empty { color: var(--secondary-text-color); font-size: 13px; font-style: italic; padding: 4px 0; }
`;

class TvRemoteCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config || {};
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._built) this._refresh();
  }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    if (!this._built) {
      this.shadowRoot.innerHTML = `<style>${EDITOR_CSS}</style>
        <div class="ed">
          <section>
            <ha-form data-top></ha-form>
          </section>
          <section>
            <h3>Shield apps</h3>
            <div class="list" data-apps></div>
            <button class="add" data-add-app>+ Add app</button>
          </section>
          <section>
            <h3>TV sources</h3>
            <div class="list" data-sources></div>
            <button class="add" data-add-source>+ Add source</button>
          </section>
        </div>`;
      this._topForm = this.shadowRoot.querySelector("[data-top]");
      this._topForm.addEventListener("value-changed", (ev) => this._onTopChange(ev));
      this.shadowRoot.querySelector("[data-add-app]").addEventListener("click", () => this._addItem("apps"));
      this.shadowRoot.querySelector("[data-add-source]").addEventListener("click", () => this._addItem("sources"));
      this._built = true;
    }
    this._refresh();
  }

  _refresh() {
    if (!this._topForm) return;
    this._topForm.schema = TOP_SCHEMA;
    this._topForm.data = {
      entities: this._config.entities || {},
      power_script: this._config.power_script || "",
      shield_source: this._config.shield_source || "",
    };
    this._topForm.hass = this._hass;
    this._topForm.computeLabel = (s) => this._labelFor(s.name);
    this._renderList("apps", APP_SCHEMA);
    this._renderList("sources", SOURCE_SCHEMA);
  }

  _labelFor(name) {
    return ({
      tv: "TV", remote: "Remote", media: "Media (play/pause)",
      adb: "ADB media_player", volume: "Volume",
      power_script: "Power script", shield_source: "Shield TV source",
      id: "ID", icon: "Icon", color: "Color (hex)",
      activity: "Activity (Shield)", app_id: "Shield app_id", source: "TV source name",
    })[name] || name;
  }

  _renderList(key, schema) {
    const items = Array.isArray(this._config[key]) ? this._config[key] : [];
    const el = this.shadowRoot.querySelector(`[data-${key}]`);
    el.innerHTML = "";
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = key === "apps"
        ? "No Shield apps yet — add one to launch via remote.turn_on activity"
        : "No TV sources yet — add one for inputs like PS5";
      el.appendChild(empty);
      return;
    }
    items.forEach((item, idx) => {
      const row = document.createElement("div");
      row.className = "row";
      const form = document.createElement("ha-form");
      form.schema = schema;
      form.data = item;
      form.hass = this._hass;
      form.computeLabel = (s) => this._labelFor(s.name);
      form.addEventListener("value-changed", (ev) => {
        const next = [...items];
        next[idx] = ev.detail.value;
        this._emit({ ...this._config, [key]: next });
      });
      const rm = document.createElement("button");
      rm.className = "rm";
      rm.title = "Remove";
      rm.textContent = "×";
      rm.addEventListener("click", () => {
        const next = items.filter((_, i) => i !== idx);
        this._emit({ ...this._config, [key]: next });
      });
      row.appendChild(form);
      row.appendChild(rm);
      el.appendChild(row);
    });
  }

  _addItem(key) {
    const items = Array.isArray(this._config[key]) ? this._config[key] : [];
    const blank = key === "apps"
      ? { id: "", icon: "mdi:apps", color: "", activity: "", app_id: "" }
      : { id: "", icon: "mdi:television-classic", color: "", source: "" };
    this._emit({ ...this._config, [key]: [...items, blank] });
  }

  _onTopChange(ev) {
    const v = ev.detail.value || {};
    this._emit({
      ...this._config,
      entities: v.entities || this._config.entities,
      power_script: v.power_script,
      shield_source: v.shield_source,
    });
  }

  _emit(config) {
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config },
      bubbles: true,
      composed: true,
    }));
  }
}

if (!customElements.get("tv-remote-card")) {
  customElements.define("tv-remote-card", TvRemoteCard);
}
if (!customElements.get("tv-remote-card-editor")) {
  customElements.define("tv-remote-card-editor", TvRemoteCardEditor);
}

window.customCards = window.customCards || [];
if (!window.customCards.find(c => c.type === "tv-remote-card")) {
  window.customCards.push({
    type: "tv-remote-card",
    name: "TV Remote",
    description: "Slick mobile TV remote with swipe pad and visual feedback",
    preview: false,
  });
}

console.info(
  `%c TV-REMOTE-CARD %c v${VERSION} `,
  "color:#fff;background:#4a148c;font-weight:700;padding:2px 6px;border-radius:3px 0 0 3px;",
  "color:#4a148c;background:#fff;font-weight:700;padding:2px 6px;border-radius:0 3px 3px 0;border:1px solid #4a148c;",
);
