var F="1.5.2";var z=[1500,3500,6e3],V=[{id:"previous",icon:"mdi:skip-previous",cmd:"MEDIA_PREVIOUS"},{id:"rewind",icon:"mdi:rewind",cmd:"MEDIA_REWIND"},{id:"play",icon:"mdi:play",cmd:"MEDIA_PLAY_PAUSE",dynamic:!0},{id:"forward",icon:"mdi:fast-forward",cmd:"MEDIA_FAST_FORWARD"},{id:"next",icon:"mdi:skip-next",cmd:"MEDIA_NEXT"}],B=[{id:"back",icon:"mdi:arrow-left",cmd:"BACK"},{id:"home",icon:"mdi:home",cmd:"HOME"}],O={up:"DPAD_UP",down:"DPAD_DOWN",left:"DPAD_LEFT",right:"DPAD_RIGHT"},$=`
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
`,C=class S extends HTMLElement{static getStubConfig(){return{entities:{tv:"media_player.tv",remote:"remote.shield",media:"media_player.shield_cast",adb:"media_player.shield_adb",volume:"media_player.tv"},power_script:"script.tv_toggle_screen",shield_source:"SHIELD Game Console",apps:[],sources:[]}}static getConfigElement(){return customElements.get("tv-remote-card-editor")||customElements.define("tv-remote-card-editor",E),document.createElement("tv-remote-card-editor")}setConfig(e){if(!e)throw new Error("Missing config");let i=S.getStubConfig();this._config={...i,...e,entities:{...i.entities,...e.entities||{}},apps:Array.isArray(e.apps)?e.apps:[],sources:Array.isArray(e.sources)?e.sources:[]},this._built?this._renderApps():this._build()}set hass(e){this._hass=e,this._update()}get hass(){return this._hass}getCardSize(){return 9}_build(){this.shadowRoot||this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=`<style>${$}</style>
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
      </div>`,this._renderApps(),this._renderRow("nav",B),this._appendNavExtras(),this._renderRow("media",V),this._setupPad(),this._setupVolume(),this._setupPowerPolling(),this._built=!0}_setupPowerPolling(){this._visHandler=()=>{document.visibilityState==="visible"&&this._maybeRefreshPower()},document.addEventListener("visibilitychange",this._visHandler)}_allButtons(){return[...this._config.apps.map(e=>({...e,kind:"app"})),...this._config.sources.map(e=>({...e,kind:"source"}))]}_renderApps(){if(!this.shadowRoot)return;let e=this.shadowRoot.querySelector("[data-apps]");if(!e)return;e.innerHTML="";let i=this._allButtons();e.style.display=i.length?"":"none";for(let t of i){let o=document.createElement("button");o.className="app",o.dataset.app=t.id,o.style.setProperty("--app-color",t.color||"var(--primary-text-color)"),o.innerHTML=`<ha-icon icon="${t.icon}"></ha-icon>`,o.addEventListener("click",()=>this._launchItem(t)),e.appendChild(o)}}_renderRow(e,i){let t=this.shadowRoot.querySelector(`[data-${e}]`);t.innerHTML="";for(let o of i){let a=document.createElement("button");a.className="b",a.dataset.id=o.id,a.innerHTML=`<ha-icon icon="${o.icon}"></ha-icon>`,a.addEventListener("click",()=>this._sendCommand(o.cmd)),t.appendChild(a)}}_appendNavExtras(){let e=this.shadowRoot.querySelector("[data-nav]"),i=document.createElement("button");i.className="b",i.dataset.id="keyboard",i.innerHTML='<ha-icon icon="mdi:keyboard"></ha-icon>',i.addEventListener("click",()=>this._openKeyboard()),e.appendChild(i);let t=document.createElement("button");t.className="b",t.dataset.id="power",t.innerHTML='<ha-icon icon="mdi:power"></ha-icon>',t.addEventListener("click",()=>this._togglePower()),e.appendChild(t)}_update(){if(!this._hass||!this._built)return;let e=this._config.entities,i=this._hass.states[e.tv],t=this._hass.states[e.adb],o=this._hass.states[e.media],a=i?.attributes?.source,l=t?.attributes?.app_id,_=null,u=this._config.sources.find(r=>r.source===a);if(u)_=u.id;else if(l){let r=this._config.apps.find(m=>m.app_id===l);r&&(_=r.id)}for(let r of this.shadowRoot.querySelectorAll(".app"))r.classList.toggle("on",r.dataset.app===_);let n=i?.state;n!==this._lastTvState?(this._lastTvState=n,n==="on"?this._maybeRefreshPower():this._setScreenOn(!1)):n==="on"&&this._screenOn===void 0&&this._maybeRefreshPower();let d=this.shadowRoot.querySelector('[data-id="play"]');if(d){let m=o&&!["playing","idle"].includes(o.state)?"mdi:pause":"mdi:play",h=d.querySelector("ha-icon");h&&h.getAttribute("icon")!==m&&h.setAttribute("icon",m)}let p=this._hass.states[e.volume],v=p?.attributes?.volume_level,y=p?.attributes?.is_volume_muted;if(v!=null&&!this._volDragging){let r=Math.round(v*100/5)*5,m=this.shadowRoot.querySelector("[data-vol]"),h=this.shadowRoot.querySelector("[data-vv]");Number(m.value)!==r&&(m.value=r),h.textContent!=r&&(h.textContent=r)}let g=this.shadowRoot.querySelector("[data-mute] ha-icon");if(g){let r=y?"mdi:volume-mute":v===0?"mdi:volume-low":"mdi:volume-high";g.getAttribute("icon")!==r&&g.setAttribute("icon",r)}}_wakeScreen(){this._hass.callService("webostv","command",{command:"com.webos.service.tvpower/power/turnOnScreen"},{entity_id:this._config.entities.tv},!1).catch(()=>{}),this._setScreenOn(!0)}_launchItem(e){this._wakeScreen(),e.kind==="source"?this._hass.callService("media_player","select_source",{source:e.source},{entity_id:this._config.entities.tv}):(this._config.shield_source&&this._hass.callService("media_player","select_source",{source:this._config.shield_source},{entity_id:this._config.entities.tv}),this._hass.callService("remote","turn_on",{activity:e.activity},{entity_id:this._config.entities.remote}))}_sendCommand(e,i=!0,t=0){i&&this._wakeScreen();let o={command:e};t&&(o.hold_secs=t),this._hass.callService("remote","send_command",o,{entity_id:this._config.entities.remote})}_togglePower(){if(this._config.power_script){let[e,i]=this._config.power_script.split(".");this._hass.callService(e,i,{})}else this._hass.callService("media_player","toggle",{},{entity_id:this._config.entities.tv});for(let e of z)setTimeout(()=>{this._lastPwrPoll=Date.now(),this._refreshPowerState()},e)}async _refreshPowerState(){if(!this._hass?.connection)return;let e=this._config.entities.tv,i=this._hass.states[e];if(!i||["unavailable","off"].includes(i.state)){this._setScreenOn(!1);return}try{let t=await this._hass.connection.sendMessagePromise({type:"call_service",domain:"webostv",service:"command",service_data:{command:"com.webos.service.tvpower/power/getPowerState"},target:{entity_id:e},return_response:!0}),a=(t?.response??t?.service_response??t)?.[e]?.state;this._setScreenOn(a==="Active")}catch{this._setScreenOn(!1)}}_maybeRefreshPower(){let e=Date.now();this._lastPwrPoll&&e-this._lastPwrPoll<800||(this._lastPwrPoll=e,this._refreshPowerState())}_setScreenOn(e){this._screenOn=!!e;let i=this.shadowRoot?.querySelector('[data-id="power"]');i&&i.classList.toggle("on",this._screenOn)}_openKeyboard(){let e=document.createElement("div");e.className="ov",e.innerHTML=`<div class="box">
      <h3>Send text to Shield</h3>
      <input type="text" autocomplete="off" placeholder="Type then Send / Enter">
      <div class="acts">
        <button data-act="cancel">Cancel</button>
        <button data-act="send" class="primary">Send</button>
      </div></div>`,this.shadowRoot.appendChild(e);let i=e.querySelector("input");setTimeout(()=>i.focus(),50);let t=()=>e.remove(),o=()=>{let a=i.value;a&&this._sendCommand(`text:${a}`),t()};e.addEventListener("click",a=>{a.target===e&&t()}),e.querySelector('[data-act="cancel"]').addEventListener("click",t),e.querySelector('[data-act="send"]').addEventListener("click",o),i.addEventListener("keydown",a=>{a.key==="Enter"?o():a.key==="Escape"&&t()})}_setupVolume(){let e=this.shadowRoot.querySelector("[data-vol]"),i=this.shadowRoot.querySelector("[data-vv]"),t=null,o=null;e.addEventListener("input",a=>{let l=Number(a.target.value);i.textContent=l,this._volDragging=!0,t=l,o&&clearTimeout(o),o=setTimeout(()=>{t!=null&&(this._wakeScreen(),this._hass.callService("media_player","volume_set",{volume_level:t/100},{entity_id:this._config.entities.volume}),t=null)},180)}),e.addEventListener("change",()=>{setTimeout(()=>{this._volDragging=!1},400)}),this.shadowRoot.querySelector("[data-mute]").addEventListener("click",()=>{this._wakeScreen();let l=!this._hass.states[this._config.entities.volume]?.attributes?.is_volume_muted;this._hass.callService("media_player","volume_mute",{is_volume_muted:l},{entity_id:this._config.entities.volume})})}_setupPad(){let e=this.shadowRoot.querySelector("[data-pad]"),i=e.querySelector("canvas"),t=i.getContext("2d"),o=80,a=200,l=200,_=500,u=.5,n=null,d=null,p=null,v=null,y=!1,g=null,r=null,m=!1,h=0,x=0,b=0,k=0,P=()=>{let s=e.getBoundingClientRect(),c=window.devicePixelRatio||1;i.width=s.width*c,i.height=s.height*c,t.setTransform(c,0,0,c,0,0)},T=new ResizeObserver(P);T.observe(e),P();let H=()=>{let c=getComputedStyle(this).getPropertyValue("--primary-text-color").trim();return c.startsWith("#f")||c.startsWith("#e")||c.toLowerCase().includes("rgb(2")||window.matchMedia("(prefers-color-scheme: dark)").matches},L=()=>{let s=e.getBoundingClientRect();if(t.globalCompositeOperation="destination-out",t.fillStyle="rgba(0,0,0,.10)",t.fillRect(0,0,s.width,s.height),t.globalCompositeOperation="source-over",y?b=Math.min(1,b+.08):b=Math.max(0,b-.04),b>.01){let c=H()?"255,255,255":"0,0,0",f=t.createRadialGradient(h,x,0,h,x,110);f.addColorStop(0,`rgba(${c},${.35*b})`),f.addColorStop(.5,`rgba(${c},${.12*b})`),f.addColorStop(1,`rgba(${c},0)`),t.fillStyle=f,t.beginPath(),t.arc(h,x,110,0,Math.PI*2),t.fill()}k=requestAnimationFrame(L)};k=requestAnimationFrame(L);let A=()=>{v&&(clearInterval(v),v=null)},I=s=>{A(),p=s,this._sendCommand(O[s],!1),v=setInterval(()=>{p&&this._sendCommand(O[p],!1)},a)},M=()=>{A(),p=null};e.addEventListener("pointerdown",s=>{e.setPointerCapture(s.pointerId);let c=e.getBoundingClientRect();h=s.clientX-c.left,x=s.clientY-c.top,y=!0,n={x:s.clientX,y:s.clientY},d={x:s.clientX,y:s.clientY},m=!1,r=setTimeout(()=>{r=null,m=!0,this._sendCommand("DPAD_CENTER",!0,u),navigator.vibrate&&navigator.vibrate(50)},_)}),e.addEventListener("pointermove",s=>{let c=e.getBoundingClientRect();if(h=s.clientX-c.left,x=s.clientY-c.top,!d)return;if(r&&n){let N=s.clientX-n.x,q=s.clientY-n.y;(Math.abs(N)>10||Math.abs(q)>10)&&(clearTimeout(r),r=null)}let f=s.clientX-d.x,R=s.clientY-d.y,w=null;Math.abs(f)>Math.abs(R)&&Math.abs(f)>o?w=f>0?"right":"left":Math.abs(R)>o&&(w=R>0?"down":"up"),w&&(d={x:s.clientX,y:s.clientY},w!==p&&I(w))});let D=s=>{if(y=!1,M(),r&&(clearTimeout(r),r=null),n&&!m){let c=s.clientX-n.x,f=s.clientY-n.y;Math.abs(c)<10&&Math.abs(f)<10&&(g?(clearTimeout(g),g=null,this._sendCommand("DPAD_CENTER"),this._sendCommand("DPAD_CENTER")):g=setTimeout(()=>{g=null,this._sendCommand("DPAD_CENTER")},l))}n=null,d=null};e.addEventListener("pointerup",D),e.addEventListener("pointercancel",D),e.addEventListener("pointerleave",()=>{n&&(y=!1,M(),r&&(clearTimeout(r),r=null),n=null,d=null)}),this._teardownPad=()=>{cancelAnimationFrame(k),T.disconnect()}}disconnectedCallback(){this._teardownPad?.(),this._visHandler&&(document.removeEventListener("visibilitychange",this._visHandler),this._visHandler=null)}},Y=[{type:"grid",name:"entities",schema:[{name:"tv",selector:{entity:{filter:{domain:"media_player"}}}},{name:"remote",selector:{entity:{filter:{domain:"remote"}}}},{name:"media",selector:{entity:{filter:{domain:"media_player"}}}},{name:"adb",selector:{entity:{filter:{domain:"media_player"}}}},{name:"volume",selector:{entity:{filter:{domain:"media_player"}}}}]},{name:"power_script",selector:{entity:{filter:{domain:"script"}}}},{name:"shield_source",selector:{text:{}}}],X=[{name:"id",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"color",selector:{text:{}}},{name:"activity",selector:{text:{}}},{name:"app_id",selector:{text:{}}}],W=[{name:"id",selector:{text:{}}},{name:"icon",selector:{icon:{}}},{name:"color",selector:{text:{}}},{name:"source",selector:{text:{}}}],G=`
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
`,E=class extends HTMLElement{setConfig(e){this._config=e||{},this._render()}set hass(e){this._hass=e,this._built&&this._refresh()}_render(){this.shadowRoot||this.attachShadow({mode:"open"}),this._built||(this.shadowRoot.innerHTML=`<style>${G}</style>
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
        </div>`,this._topForm=this.shadowRoot.querySelector("[data-top]"),this._topForm.addEventListener("value-changed",e=>this._onTopChange(e)),this.shadowRoot.querySelector("[data-add-app]").addEventListener("click",()=>this._addItem("apps")),this.shadowRoot.querySelector("[data-add-source]").addEventListener("click",()=>this._addItem("sources")),this._built=!0),this._refresh()}_refresh(){this._topForm&&(this._topForm.schema=Y,this._topForm.data={entities:this._config.entities||{},power_script:this._config.power_script||"",shield_source:this._config.shield_source||""},this._topForm.hass=this._hass,this._topForm.computeLabel=e=>this._labelFor(e.name),this._renderList("apps",X),this._renderList("sources",W))}_labelFor(e){return{tv:"TV",remote:"Remote",media:"Media (play/pause)",adb:"ADB media_player",volume:"Volume",power_script:"Power script",shield_source:"Shield TV source",id:"ID",icon:"Icon",color:"Color (hex)",activity:"Activity (Shield)",app_id:"Shield app_id",source:"TV source name"}[e]||e}_renderList(e,i){let t=Array.isArray(this._config[e])?this._config[e]:[],o=this.shadowRoot.querySelector(`[data-${e}]`);if(o.innerHTML="",!t.length){let a=document.createElement("div");a.className="empty",a.textContent=e==="apps"?"No Shield apps yet \u2014 add one to launch via remote.turn_on activity":"No TV sources yet \u2014 add one for inputs like PS5",o.appendChild(a);return}t.forEach((a,l)=>{let _=document.createElement("div");_.className="row";let u=document.createElement("ha-form");u.schema=i,u.data=a,u.hass=this._hass,u.computeLabel=d=>this._labelFor(d.name),u.addEventListener("value-changed",d=>{let p=[...t];p[l]=d.detail.value,this._emit({...this._config,[e]:p})});let n=document.createElement("button");n.className="rm",n.title="Remove",n.textContent="\xD7",n.addEventListener("click",()=>{let d=t.filter((p,v)=>v!==l);this._emit({...this._config,[e]:d})}),_.appendChild(u),_.appendChild(n),o.appendChild(_)})}_addItem(e){let i=Array.isArray(this._config[e])?this._config[e]:[],t=e==="apps"?{id:"",icon:"mdi:apps",color:"",activity:"",app_id:""}:{id:"",icon:"mdi:television-classic",color:"",source:""};this._emit({...this._config,[e]:[...i,t]})}_onTopChange(e){let i=e.detail.value||{};this._emit({...this._config,entities:i.entities||this._config.entities,power_script:i.power_script,shield_source:i.shield_source})}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}};customElements.get("tv-remote-card")||customElements.define("tv-remote-card",C);customElements.get("tv-remote-card-editor")||customElements.define("tv-remote-card-editor",E);window.customCards=window.customCards||[];window.customCards.find(S=>S.type==="tv-remote-card")||window.customCards.push({type:"tv-remote-card",name:"TV Remote",description:"Slick mobile TV remote with swipe pad and visual feedback",preview:!1});console.info(`%c TV-REMOTE-CARD %c v${F} `,"color:#fff;background:#4a148c;font-weight:700;padding:2px 6px;border-radius:3px 0 0 3px;","color:#4a148c;background:#fff;font-weight:700;padding:2px 6px;border-radius:0 3px 3px 0;border:1px solid #4a148c;");
