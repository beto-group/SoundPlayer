const { useState, useEffect } = dc;
const { View } = await dc.require(dc.resolvePath("SOUND PLAYER/src/App.jsx"));

const RootView = ({ folderPath }) => {
  const [stamp, setStamp] = useState(0);

  useEffect(() => {
    const cmdFile = dc.resolvePath("SOUND PLAYER/data/mcp_commands.json");
    
    // Polling watch daemon
    const interval = setInterval(async () => {
      try {
        if (!cmdFile) return;
        const stat = await app.vault.adapter.stat(cmdFile);
        if (stat && stat.mtime > stamp) {
          setStamp(stat.mtime);
        }
      } catch (e) {
        // Ignore file not found
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [stamp]);

  return <View key={stamp} folderPath={folderPath} dc={dc} />;
};

return { View: RootView };
