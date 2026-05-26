# Contribution Guidelines — Sound Player

Welcome! This component is part of the BetoOS Datacore library. Please adhere to the following architectural standards.

## Codebase Architecture

The module utilizes a split-file structure to guarantee legibility, testability, and isolated execution scopes:

```text
SOUND PLAYER/
├── SOUND PLAYER.md        # Obsidian entry point
├── METADATA.md            # Component manifest
├── README.md              # Documentation
├── CONTRIBUTION.md        # This file
├── LICENSE.md             # MIT license
├── data/
│   └── mcp_commands.json  # Hot reload trigger
├── assets/
│   ├── sound_player.webp  # Static preview image
│   ├── soundplayer.clip.gif # Immersive preview clip
│   └── music/
│       └── beto.minigame.soundtrack.wav # Default audio soundtrack
└── src/
    ├── index.jsx          # CSS Injector & reload daemon
    ├── App.jsx            # Main layout and coordinator
    ├── components/
    │   └── AudioControls.jsx # Playback panel & drag UI controls
    └── utils/
        ├── domUtils.js    # Workspace leaf node locators
        └── loadScript.js  # Script & CDN resource local cache manager
```

## Developer Standard

1. **Strict Zero standard emojis**: All UI elements, buttons, headers, and control indicators must use Lucide vector icons (`<dc.Icon>`) or plain text. Emojis are reserved strictly for documentation.
2. **Path safety**: Do not hardcode absolute path strings (e.g. `/Volumes/` or `file:///`). Always resolve vault directories via the `dc.resolvePath` wrapper.
3. **Hot Module Reload**: The hot reload watch daemon monitors modification times of `data/mcp_commands.json`. To force a live reload of the component inside Obsidian:
   ```bash
   echo '{"action":"reload","timestamp":'`date +%s`000`,"executed":true}' > data/mcp_commands.json
   ```
