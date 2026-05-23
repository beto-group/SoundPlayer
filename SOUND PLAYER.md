---
datacore: true
---

```datacorejsx
const { View } = await dc.require(dc.resolvePath("SOUND PLAYER/src/index.jsx"));
return <View folderPath={dc.resolvePath("SOUND PLAYER")} dc={dc} />;
```
