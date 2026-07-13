var A="1.5.0";var M=[1500,3500,6e3],D=[{id:"previous",icon:"mdi:skip-previous",cmd:"MEDIA_PREVIOUS"},{id:"rewind",icon:"mdi:rewind",cmd:"MEDIA_REWIND"},{id:"play",icon:"mdi:play",cmd:"MEDIA_PLAY_PAUSE",dynamic:!0},{id:"forward",icon:"mdi:fast-forward",cmd:"MEDIA_FAST_FORWARD"},{id:"next",icon:"mdi:skip-next",cmd:"MEDIA_NEXT"}],O=[{id:"back",icon:"mdi:arrow-left",cmd:"BACK"},{id:"home",icon:"mdi:home",cmd:"HOME"}],P={up:"DPAD_UP",down:"DPAD_DOWN",left:"DPAD_LEFT",right:"DPAD_RIGHT"},H=`
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
`,k=class x extends HTMLElement{static getStubConfig(){return{entities:{tv:"media_player.tv",remote:"remote.shield",media:"media_player.shield_cast",adb:"media_player.shield_adb",volume:"media_player.tv"},power_script:"script.tv_toggle_screen",shield_source:"SHIELD Game Console",apps:[],sources:[]}}static getConfigElement(){return customElements.get("tv-remote-card-editor")||customElements.define("tv-remote-card-editor",w),document.createElement("tv-remote-card-editor")}setConfig(e){if(!e)throw new Error("Missing config");let i=x.getStubConfig();this._config={...i,...e,entities:{...i.entities,...e.entities||{}},apps:Array.isArray(e.apps)?e.apps:[],sources:Array.isArray(e.sources)?e.sources:[]},this._built?this._renderApps():this._build()}set hass(e){this._hass=e,this._update()}get hass(){return this._hass}getCardSize(){return 9}_build(){this.shadowRoot||this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=`<style>${H}</style>
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
      </div>`,this._renderApps(),this._renderRow("nav",O),this._appendNavExtras(),this._renderRow("media",D),this._setupPad(),this._setupVolume(),this._setupPowerPolling(),this._built=!0}_setupPowerPolling(){this._visHandler=()=>{document.visibilityState==="visible"&&this._maybeRefreshPower()},document.addEventListener("visibilitychange",this._visHandler)}_allButtons(){return[...this._config.apps.map(e=>({...e,kind:"app"})),...this._config.sources.map(e=>({...e,kind:"source"}))]}_renderApps(){if(!this.shadowRoot)return;let e=this.shadowRoot.querySelector("[data-apps]");if(!e)return;e.innerHTML="";let i=this._allButtons();e.style.display=i.length?"":"none";for(let t of i){let o=document.createElement("button");o.className="app",o.dataset.app=t.id,o.style.setProperty("--app-color",t.color||"var(--primary-text-color)"),o.innerHTML=`<ha-icon icon="${t.icon}"></ha-icon>`,o.addEventListener("click",()=>this._launchItem(t)),e.appendChild(o)}}_renderRow(e,i){let t=this.shadowRoot.querySelector(`[data-${e}]`);t.innerHTML="";for(let o of i){let s=document.createElement("button");s.className="b",s.dataset.id=o.id,s.innerHTML=`<ha-icon icon="${o.icon}"></ha-icon>`,s.addEventListener("click",()=>this._sendCommand(o.cmd)),t.appendChild(s)}}_appendNavExtras(){let e=this.shadowRoot.querySelector("[data-nav]"),i=document.createElement("button");i.className="b",i.dataset.id="keyboard",i.innerHTML='<ha-icon icon="mdi:keyboard"></ha-icon>',i.addEventListener("click",()=>this._openKeyboard()),e.appendChild(i);let t=document.createElement("button");t.className="b",t.dataset.id="power",t.innerHTML='<ha-icon icon="mdi:power"></ha-icon>',t.addEventListener("click",()=>this._togglePower()),e.appendChild(t)}_update(){if(!this._hass||!this._built)return;let e=this._config.entities,i=this._hass.states[e.tv],t=this._hass.states[e.adb],o=this._hass.states[e.media],s=i?.attributes?.source,r=t?.attributes?.app_id,c=null,d=this._config.sources.find(l=>l.source===s);if(d)c=d.id;else if(r){let l=this._config.apps.find(v=>v.app_id===r);l&&(c=l.id)}for(let l of this.shadowRoot.querySelectorAll(".app"))l.classList.toggle("on",l.dataset.app===c);let p=i?.state;p!==this._lastTvState?(this._lastTvState=p,p==="on"?this._maybeRefreshPower():this._setScreenOn(!1)):p==="on"&&this._screenOn===void 0&&this._maybeRefreshPower();let h=this.shadowRoot.querySelector('[data-id="play"]');if(h){let v=o&&!["playing","idle"].includes(o.state)?"mdi:pause":"mdi:play",g=h.querySelector("ha-icon");g&&g.getAttribute("icon")!==v&&g.setAttribute("icon",v)}let u=this._hass.states[e.volume],m=u?.attributes?.volume_level,f=u?.attributes?.is_volume_muted;if(m!=null&&!this._volDragging){let l=Math.round(m*100/5)*5,v=this.shadowRoot.querySelector("[data-vol]"),g=this.shadowRoot.querySelector("[data-vv]");Number(v.value)!==l&&(v.value=l),g.textContent!=l&&(g.textContent=l)}let b=this.shadowRoot.querySelector("[data-mute] ha-icon");if(b){let l=f?"mdi:volume-mute":m===0?"mdi:volume-low":"mdi:volume-high";b.getAttribute("icon")!==l&&b.setAttribute("icon",l)}}_launchItem(e){let i=this._config.entities,t=this._hass.states[i.tv],o=t&&!["unavailable","off"].includes(t.state),s=o&&this._config.shield_source&&t.attributes?.source===this._config.shield_source,r=this._screenOn!==!1;if(e.kind==="source"){let d=()=>this._hass.callService("media_player","select_source",{source:e.source},{entity_id:i.tv});o?d():(this._cecWake(),setTimeout(d,1200));return}let c=()=>this._hass.callService("remote","turn_on",{activity:e.activity},{entity_id:i.remote});if(s&&r){c();return}this._cecWake(),o&&this._config.shield_source&&this._hass.callService("media_player","select_source",{source:this._config.shield_source},{entity_id:i.tv}),setTimeout(c,500)}_cecWake(){this._hass.callService("remote","send_command",{command:"HOME"},{entity_id:this._config.entities.remote})}_sendCommand(e){this._hass.callService("remote","send_command",{command:e},{entity_id:this._config.entities.remote})}_togglePower(){if(this._config.power_script){let[e,i]=this._config.power_script.split(".");this._hass.callService(e,i,{})}else this._hass.callService("media_player","toggle",{},{entity_id:this._config.entities.tv});for(let e of M)setTimeout(()=>{this._lastPwrPoll=Date.now(),this._refreshPowerState()},e)}async _refreshPowerState(){if(!this._hass?.connection)return;let e=this._config.entities.tv,i=this._hass.states[e];if(!i||["unavailable","off"].includes(i.state)){this._setScreenOn(!1);return}try{let t=await this._hass.connection.sendMessagePromise({type:"call_service",domain:"webostv",service:"command",service_data:{command:"com.webos.service.tvpower/power/getPowerState"},target:{entity_id:e},return_response:!0}),s=(t?.response??t?.service_response??t)?.[e]?.state;this._setScreenOn(s==="Active")}catch{this._setScreenOn(!1)}}_maybeRefreshPower(){let e=Date.now();this._lastPwrPoll&&e-this._lastPwrPoll<800||(this._lastPwrPoll=e,this._refreshPowerState())}_setScreenOn(e){this._screenOn=!!e;let i=this.shadowRoot?.querySelector('[data-id="power"]');i&&i.classList.toggle("on",this._screenOn)}_openKeyboard(){let e=document.createElement("div");e.className="ov",e.innerHTML=`<div class="box">
      <h3>Send text to Shield</h3>
      <input type="text" autocomplete="off" placeholder="Type then Send / Enter">
      <div class="acts">
        <button data-act="cancel">Cancel</button>
        <button data-act="send" class="primary">Send</button>
      </div></div>`,this.shadowRoot.appendChild(e);let i=e.querySelector("input");setTimeout(()=>i.focus(),50);let t=()=>e.remove(),o=()=>{let s=i.value;s&&this._sendCommand(`text:${s}`),t()};e.addEventListener("click",s=>{s.target===e&&t()}),e.querySelector('[data-act="cancel"]').addEventListener("click",t),e.querySelector('[data-act="send"]').addEventListener("click",o),i.addEventListener("keydown",s=>{s.key==="Enter"?o():s.key==="Escape"&&t()})}_setupVolume(){let e=this.shadowRoot.querySelector("[data-vol]"),i=this.shadowRoot.querySelector("[data-vv]"),t=null,o=null;e.addEventListener("input",s=>{let r=Number(s.target.value);i.textContent=r,this._volDragging=!0,t=r,o&&clearTimeout(o),o=setTimeout(()=>{t!=null&&(this._hass.callService("media_player","volume_set",{volume_level:t/100},{entity_id:this._config.entities.volume}),t=null)},180)}),e.addEventListener("change",()=>{setTimeout(()=>{this._volDragging=!1},400)}),this.shadowRoot.querySelector("[data-mute]").addEventListener("click",()=>{let r=!this._hass.states[this._config.entities.volume]?.attributes?.is_volume_muted;this._hass.callService("media_player","volume_mute",{is_volume_muted:r},{entity_id:this._config.entities.volume})})}_setupPad(){let e=this.shadowRoot.querySelector("[data-pad]"),i=e.querySelector("canvas"),t=i.getContext("2d"),o=80,s=200,r=null,c=null,d=null,p=null,h=!1,u=0,m=0,f=0,b=0,l=()=>{let a=e.getBoundingClientRect(),n=window.devicePixelRatio||1;i.width=a.width*n,i.height=a.height*n,t.setTransform(n,0,0,n,0,0)},v=new ResizeObserver(l);v.observe(e),l();let g=()=>{let n=getComputedStyle(this).getPropertyValue("--primary-text-color").trim();return n.startsWith("#f")||n.startsWith("#e")||n.toLowerCase().includes("rgb(2")||window.matchMedia("(prefers-color-scheme: dark)").matches},R=()=>{let a=e.getBoundingClientRect();if(t.globalCompositeOperation="destination-out",t.fillStyle="rgba(0,0,0,.10)",t.fillRect(0,0,a.width,a.height),t.globalCompositeOperation="source-over",h?f=Math.min(1,f+.08):f=Math.max(0,f-.04),f>.01){let n=g()?"255,255,255":"0,0,0",_=t.createRadialGradient(u,m,0,u,m,110);_.addColorStop(0,`rgba(${n},${.35*f})`),_.addColorStop(.5,`rgba(${n},${.12*f})`),_.addColorStop(1,`rgba(${n},0)`),t.fillStyle=_,t.beginPath(),t.arc(u,m,110,0,Math.PI*2),t.fill()}b=requestAnimationFrame(R)};b=requestAnimationFrame(R);let C=()=>{p&&(clearInterval(p),p=null)},T=a=>{C(),d=a,this._sendCommand(P[a]),p=setInterval(()=>{d&&this._sendCommand(P[d])},s)},S=()=>{C(),d=null};e.addEventListener("pointerdown",a=>{e.setPointerCapture(a.pointerId);let n=e.getBoundingClientRect();u=a.clientX-n.left,m=a.clientY-n.top,h=!0,r={x:a.clientX,y:a.clientY},c={x:a.clientX,y:a.clientY}}),e.addEventListener("pointermove",a=>{let n=e.getBoundingClientRect();if(u=a.clientX-n.left,m=a.clientY-n.top,!c)return;let _=a.clientX-c.x,E=a.clientY-c.y,y=null;Math.abs(_)>Math.abs(E)&&Math.abs(_)>o?y=_>0?"right":"left":Math.abs(E)>o&&(y=E>0?"down":"up"),y?(c={x:a.clientX,y:a.clientY},y!==d&&T(y)):d&&S()});let L=a=>{if(h=!1,S(),r){let n=a.clientX-r.x,_=a.clientY-r.y;Math.abs(n)<10&&Math.abs(_)<10&&this._sendCommand("DPAD_CENTER")}r=null,c=null};e.addEventListener("pointerup",L),e.addEventListener("pointercancel",L),e.addEventListener("pointerleave",()=>{r&&(h=!1,S(),r=null,c=null)}),this._teardownPad=()=>{cancelAnimationFrame(b),v.disconnect()}}disconnectedCallback(){this._teardownPad?.(),this._visHandler&&(document.removeEventListener("visibilitychange",this._visHandler),this._visHandler=null)}},I=[{type:"grid",name:"entities",schema:[{name:"tv",selector:{entity:{filter:{domain:"media_player"}}}},{name:"remote",selector:{entity:{filter:{domain:"remote"}}}},{name:"media",selector:{entity:{filter:{domain:"media_player"}}}},{name:"adb",selector:{entity:{filter:{domain:"media_player"}}}},{name:"volume",selector:{entity:{filter:{domain:"media_player"}}}}]},{name:"power_script",selector:{entity:{filter:{domain:"script"}}}},{name:"shield_source",selector:{text:{}}}],q=[{name:"id",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"color",selector:{text:{}}},{name:"activity",selector:{text:{}}},{name:"app_id",selector:{text:{}}}],N=[{name:"id",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"color",selector:{text:{}}},{name:"source",selector:{text:{}}}],z=`
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
`,w=class extends HTMLElement{setConfig(e){this._config=e||{},this._render()}set hass(e){this._hass=e,this._built&&this._refresh()}_render(){this.shadowRoot||this.attachShadow({mode:"open"}),this._built||(this.shadowRoot.innerHTML=`<style>${z}</style>
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
        </div>`,this._topForm=this.shadowRoot.querySelector("[data-top]"),this._topForm.addEventListener("value-changed",e=>this._onTopChange(e)),this.shadowRoot.querySelector("[data-add-app]").addEventListener("click",()=>this._addItem("apps")),this.shadowRoot.querySelector("[data-add-source]").addEventListener("click",()=>this._addItem("sources")),this._built=!0),this._refresh()}_refresh(){this._topForm&&(this._topForm.schema=I,this._topForm.data={entities:this._config.entities||{},power_script:this._config.power_script||"",shield_source:this._config.shield_source||""},this._topForm.hass=this._hass,this._topForm.computeLabel=e=>this._labelFor(e.name),this._renderList("apps",q),this._renderList("sources",N))}_labelFor(e){return{tv:"TV",remote:"Remote",media:"Media (play/pause)",adb:"ADB media_player",volume:"Volume",power_script:"Power script",shield_source:"Shield TV source",id:"ID",icon:"Icon",color:"Color (hex)",activity:"Activity (Shield)",app_id:"Shield app_id",source:"TV source name"}[e]||e}_renderList(e,i){let t=Array.isArray(this._config[e])?this._config[e]:[],o=this.shadowRoot.querySelector(`[data-${e}]`);if(o.innerHTML="",!t.length){let s=document.createElement("div");s.className="empty",s.textContent=e==="apps"?"No Shield apps yet \u2014 add one to launch via remote.turn_on activity":"No TV sources yet \u2014 add one for inputs like PS5",o.appendChild(s);return}t.forEach((s,r)=>{let c=document.createElement("div");c.className="row";let d=document.createElement("ha-form");d.schema=i,d.data=s,d.hass=this._hass,d.computeLabel=h=>this._labelFor(h.name),d.addEventListener("value-changed",h=>{let u=[...t];u[r]=h.detail.value,this._emit({...this._config,[e]:u})});let p=document.createElement("button");p.className="rm",p.title="Remove",p.textContent="\xD7",p.addEventListener("click",()=>{let h=t.filter((u,m)=>m!==r);this._emit({...this._config,[e]:h})}),c.appendChild(d),c.appendChild(p),o.appendChild(c)})}_addItem(e){let i=Array.isArray(this._config[e])?this._config[e]:[],t=e==="apps"?{id:"",icon:"mdi:apps",color:"",activity:"",app_id:""}:{id:"",icon:"mdi:television-classic",color:"",source:""};this._emit({...this._config,[e]:[...i,t]})}_onTopChange(e){let i=e.detail.value||{};this._emit({...this._config,entities:i.entities||this._config.entities,power_script:i.power_script,shield_source:i.shield_source})}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}};customElements.get("tv-remote-card")||customElements.define("tv-remote-card",k);customElements.get("tv-remote-card-editor")||customElements.define("tv-remote-card-editor",w);window.customCards=window.customCards||[];window.customCards.find(x=>x.type==="tv-remote-card")||window.customCards.push({type:"tv-remote-card",name:"TV Remote",description:"Slick mobile TV remote with swipe pad and visual feedback",preview:!1});console.info(`%c TV-REMOTE-CARD %c v${A} `,"color:#fff;background:#4a148c;font-weight:700;padding:2px 6px;border-radius:3px 0 0 3px;","color:#4a148c;background:#fff;font-weight:700;padding:2px 6px;border-radius:0 3px 3px 0;border:1px solid #4a148c;");
