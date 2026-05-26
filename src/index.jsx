const { useState, useEffect } = dc;
const { App } = await dc.require(dc.resolvePath("SOUND PLAYER/src/App.jsx"));

const RootView = (props) => {
  const [stamp, setStamp] = useState(0);

  useEffect(() => {
    // Polling watch daemon
    const interval = setInterval(async () => {
      try {
        const cmdFile = dc.resolvePath("SOUND PLAYER/data/mcp_commands.json");
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

  return <App key={stamp} dc={dc} {...props} />;
};

return { View: RootView };
