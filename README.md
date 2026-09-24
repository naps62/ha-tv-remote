# TV Remote Card

A mobile-friendly Lovelace remote for TVs paired with an NVIDIA Shield (or any
Android TV reachable via the `androidtv` / `remote` integrations) plus a webOS
TV. Replaces an iPhone-style remote pane with a swipe-pad d-pad, app
launchers, TV-source switches, media transport, and a 5-step volume slider.

## Features

- **Swipe pad** with canvas glow + press-hold direction repeat. Tap = OK.
- **App row** combining Shield-launched apps (via `remote.turn_on activity:`)
  and TV-source items (via `media_player.select_source`). Active app/source
  is highlighted using the colour you set.
- **Navigation row**: Back / Home / Keyboard (Shield text-entry overlay)
  / Power. Power highlight is driven by polling webOS `getPowerState` so it
  reflects actual screen state, not just controller reachability.
- **Media row**: prev / rewind / play-pause / fast-forward / next. Play/pause
  icon is dynamic.
- **Volume slider** in 5-unit steps with mute toggle.
- **Visual config editor** (HA's "Edit card" UI) backed by `ha-form` — no YAML
  required after install.

## Install

Via HACS:

1. HACS → Frontend → ⋮ → Custom repositories → add
   `https://github.com/naps62/ha-tv-remote` as type `Lovelace`.
2. Install the resulting "TV Remote Card" entry.
3. Hard-refresh the dashboard.

Manual install: drop `dist/tv-remote-card.js` into `/config/www/` and register
it as a Lovelace resource of type `module` pointing at
`/local/tv-remote-card.js`.

## Configuration

```yaml
type: custom:tv-remote-card
entities:
  tv: media_player.tv             # LG webOS TV (source/volume target)
  remote: remote.shield           # Android TV remote (DPAD + activity launches)
  media: media_player.shield_cast # state used for play/pause icon
  adb: media_player.shield_adb    # state used for active-app highlight
  volume: media_player.tv         # which entity controls volume
power_script: script.tv_toggle_screen   # optional; falls back to media_player.toggle
shield_source: SHIELD Game Console      # TV source to switch to when launching a Shield app
apps:                                   # remote.turn_on activity:... items
  - id: spotify
    icon: mdi:spotify
    color: "#1DB954"
    activity: spotify://
    app_id: com.spotify.tv.android
  - id: jellyfin
    icon: mdi:jellyfish
    color: "#244dd7"
    activity: org.jellyfin.androidtv
    app_id: org.jellyfin.androidtv
  - id: moonlight
    icon: mdi:moon-waning-crescent
    color: "#5c6bc0"
    activity: com.limelight
    app_id: com.limelight
  - id: smarttube
    icon: mdi:youtube
    color: "#ff0000"
    activity: org.smarttube.stable
    app_id: org.smarttube.stable, org.smarttube.beta, app.smarttube
sources:                                # media_player.select_source items
```

All keys except `entities.tv` and `entities.remote` are optional — omit `apps`
or `sources` to hide the row, omit `power_script` to fall back to
`media_player.toggle` on the TV entity, etc.

### App entries (`apps[]`)

| key | required | description |
|---|---|---|
| `id` | yes | Used for the active-state highlight class — must be unique |
| `icon` | yes | MDI icon (e.g. `mdi:spotify`) |
| `color` | no | Hex string for the icon tint and active-pill background |
| `activity` | yes | Value passed to `remote.turn_on activity:` on `entities.remote` |
| `app_id` | no | Matched against `media_player.<adb>.app_id` to set the active-state highlight. Use comma-separated IDs when an app has multiple package variants. |

When you tap an app entry the card also fires `media_player.select_source` on
`entities.tv` with `source: <shield_source>` so the TV switches back to the
Shield input first. Set `shield_source: ""` (or omit) to skip that.

### Source entries (`sources[]`)

| key | required | description |
|---|---|---|
| `id` | yes | Used for the active-state highlight class — must be unique |
| `icon` | yes | MDI icon |
| `color` | no | Hex string |
| `source` | yes | Source name (must appear in the TV's `source_list`) |

Tapping a source entry fires `media_player.select_source` on `entities.tv`.
Active-state highlight matches `media_player.<tv>.source` exactly.

## Build

```sh
npm install
npm run build
```

Produces `dist/tv-remote-card.js` (minified, no source map).

## License

MIT
