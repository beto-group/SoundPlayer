const { findNearestAncestorWithClass, findDirectChildByClass } = await dc.require(dc.resolvePath("SOUND PLAYER/src/utils/domUtils.js"));
const { AudioControls } = await dc.require(dc.resolvePath("SOUND PLAYER/src/components/AudioControls.jsx"));

function App(props) {
  const { dc } = props;
  const { useState, useEffect, useRef } = dc;

  const instanceId = useRef(Math.random().toString(36).substr(2, 5)).current;
  const uniqueWrapperClass = `sound-player-wrapper-${instanceId}`;

  const defaultSongPath = dc.resolvePath("SOUND PLAYER/assets/music/beto.minigame.soundtrack.wav");
  
  // Audio state
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [audioSrc, setAudioSrc] = useState(null);
  const [fileName, setFileName] = useState("BETO.MINIGAME.SOUNDTRACK");
  const [isDragging, setIsDragging] = useState(false);

  // Initialize with default song
  useEffect(() => {
    if (defaultSongPath) {
      const defaultSrc = app.vault.adapter.getResourcePath(defaultSongPath);
      setAudioSrc(defaultSrc);
    }
  }, [defaultSongPath]);

  // Full-tab state
  const [isFullTab, setIsFullTab] = useState(true);
  const containerRef = useRef(null);
  const stateRefs = useRef({}).current;

  // Styles
  const STYLES = {
    hoverEffectStyle: `
      .${uniqueWrapperClass} .subtle-icon {
        opacity: 0;
        transform: scale(0.9);
        transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
      }
      .${uniqueWrapperClass}:hover .subtle-icon {
        opacity: 0.7;
        transform: scale(1);
      }
      .${uniqueWrapperClass} .subtle-icon:hover {
        opacity: 1;
      }
      .${uniqueWrapperClass} .subtle-icon:hover .exit-tooltip {
        visibility: visible;
        opacity: 1;
      }
      @keyframes pulse {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; }
      }
      @keyframes ripple {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(1.5); opacity: 0; }
      }
    `,
    fullTabWrapper: {
      position: "relative",
      height: "100%",
      width: "100%",
      padding: "40px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "30px",
      backgroundColor: "#000000",
      color: "white",
    },
    exitIcon: {
      position: "absolute",
      top: "20px",
      right: "30px",
      fontFamily: "monospace",
      fontSize: "16px",
      color: "#6b7280",
      userSelect: "none",
      cursor: "pointer",
      zIndex: 10,
    },
    tooltip: {
      visibility: "hidden",
      opacity: 0,
      backgroundColor: "#1a1a1a",
      color: "white",
      textAlign: "center",
      borderRadius: "4px",
      padding: "6px 12px",
      position: "absolute",
      zIndex: 1,
      top: "50%",
      right: "120%",
      transform: "translateY(-50%)",
      fontSize: "12px",
      whiteSpace: "nowrap",
      pointerEvents: "none",
      border: "1px solid #8b5cf6",
    },
    playerContainer: {
      width: "100%",
      maxWidth: "600px",
      display: "flex",
      flexDirection: "column",
      gap: "25px",
      padding: "40px",
      backgroundColor: "#0a0a0a",
      border: "1px solid #2d2d2d",
      borderRadius: "12px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.8)",
      transition: "all 0.3s ease",
    },
    dropZone: {
      width: "100%",
      padding: "30px",
      border: "2px dashed #2d2d2d",
      borderRadius: "8px",
      backgroundColor: "#000000",
      textAlign: "center",
      color: "#6b7280",
      fontSize: "13px",
      fontFamily: "monospace",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    dropZoneActive: {
      border: "2px dashed #8b5cf6",
      backgroundColor: "#1a1a1a",
      boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
      color: "#8b5cf6",
    },
    title: {
      fontSize: "28px",
      fontWeight: "300",
      color: "white",
      textAlign: "center",
      marginBottom: "10px",
      letterSpacing: "2px",
      fontFamily: "monospace",
    },
    subtitle: {
      fontSize: "12px",
      color: "#6b7280",
      textAlign: "center",
      letterSpacing: "4px",
      textTransform: "uppercase",
      marginBottom: "20px",
    },
    playButton: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      border: "2px solid #8b5cf6",
      backgroundColor: "#1a1a1a",
      color: "#8b5cf6",
      fontSize: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
      alignSelf: "center",
      position: "relative",
    },
    progressContainer: {
      width: "100%",
      height: "4px",
      backgroundColor: "#1a1a1a",
      borderRadius: "2px",
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      backgroundColor: "#8b5cf6",
      borderRadius: "2px",
      transition: "width 0.1s linear",
      boxShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
    },
    timeDisplay: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "11px",
      color: "#6b7280",
      fontFamily: "monospace",
      letterSpacing: "1px",
    },
    volumeContainer: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
      justifyContent: "center",
    },
    volumeSlider: {
      width: "120px",
      height: "4px",
      backgroundColor: "#1a1a1a",
      borderRadius: "2px",
      cursor: "pointer",
      position: "relative",
    },
    volumeBar: {
      height: "100%",
      backgroundColor: "#8b5cf6",
      borderRadius: "2px",
      transition: "width 0.1s ease",
    },
    volumeIcon: {
      fontSize: "18px",
      color: "#8b5cf6",
    },
    compactWrapper: {
      padding: "20px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "15px",
      border: "1px solid #2d2d2d",
      borderRadius: "8px",
      backgroundColor: "#0a0a0a",
    },
    compactText: {
      margin: 0,
      color: "#6b7280",
      fontSize: "14px",
      fontFamily: "monospace",
    },
    button: {
      padding: "10px 20px",
      fontSize: "13px",
      fontWeight: "500",
      color: "white",
      backgroundColor: "#1a1a1a",
      border: "1px solid #8b5cf6",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      boxShadow: "0 0 10px rgba(139, 92, 246, 0.3)",
    },
  };

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(e => console.warn("Playback prevented:", e));
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(1, percent));
    setVolume(newVolume);
    audio.volume = newVolume;
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const dragData = e.dataTransfer.getData('text/plain');
    const files = e.dataTransfer.files;

    if (dragData) {
      let filePath = dragData.replace(/^\[\[/, '').replace(/\]\]$/, '');
      const fileExt = filePath.split('.').pop().toLowerCase();
      
      if (!['wav', 'mp3', 'mp4'].includes(fileExt)) {
        return;
      }

      const audio = audioRef.current;
      if (audio && isPlaying) {
        audio.pause();
        setIsPlaying(false);
      }

      const file = app.vault.getAbstractFileByPath(filePath);
      if (file) {
        const resourcePath = app.vault.adapter.getResourcePath(file.path);
        setAudioSrc(resourcePath);
        setFileName(file.name.replace(/\.[^/.]+$/, "").toUpperCase());
        setCurrentTime(0);
        setDuration(0);
      }
    } else if (files.length > 0) {
      const file = files[0];
      const fileExt = file.name.split('.').pop().toLowerCase();
      
      if (!['wav', 'mp3', 'mp4'].includes(fileExt)) {
        return;
      }

      const audio = audioRef.current;
      if (audio && isPlaying) {
        audio.pause();
        setIsPlaying(false);
      }

      const objectUrl = URL.createObjectURL(file);
      setAudioSrc(objectUrl);
      setFileName(file.name.replace(/\.[^/.]+$/, "").toUpperCase());
      setCurrentTime(0);
      setDuration(0);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Full-tab effect (Header-Safe FullTab standard)
  useEffect(() => {
    if (!isFullTab) return;

    const container = containerRef.current;
    if (!container) return;

    // 1. Locate nearest leaf content wrapper
    const leaf = container.closest('.workspace-leaf-content');
    if (!leaf) return;

    // 2. Select the view-content container below the header
    const contentWrapper = leaf.querySelector(':scope > .view-content') || leaf;
    const currentParent = container.parentNode;
    if (!currentParent) return;

    // 3. Setup placeholder in standard DOM layout
    stateRefs.originalParent = currentParent;
    const placeholder = document.createElement("div");
    placeholder.style.display = "none";
    if (container.nextSibling) {
      currentParent.insertBefore(placeholder, container.nextSibling);
    } else {
      currentParent.appendChild(placeholder);
    }
    stateRefs.placeholder = placeholder;

    // 4. Inject impeccable status bar suppression stylesheet
    const styleId = `sound-player-status-${instanceId}`;
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `
        /* Hide global status bar and view footers */
        .status-bar, .view-footer, .workspace-leaf-content-footer { 
            display: none !important; 
        }
        
        /* Expand workspace-leaf-content to edge-to-edge container */
        .workspace-leaf-content { 
            padding: 0 !important; 
            margin: 0 !important; 
            border-radius: 0 !important; 
        }
      `;
      document.head.appendChild(styleEl);
    }

    stateRefs.parentPositionInfo = {
      element: contentWrapper,
      originalInlinePosition: contentWrapper.style.position,
    };

    if (window.getComputedStyle(contentWrapper).position === 'static') {
      contentWrapper.style.position = "relative";
    }

    // 5. Append component to view-content
    contentWrapper.appendChild(container);

    requestAnimationFrame(() => {
      Object.assign(contentWrapper.style, {
        padding: "0",
        margin: "0",
        height: "100%",
        width: "100%",
        display: "block",
        overflow: "hidden"
      });
    });

    Object.assign(container.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      zIndex: "9998",
      overflow: "hidden",
      backgroundColor: "#000000",
    });

    // 6. Graceful cleanup on unmount or fulltab minimize toggle
    return () => {
      if (stateRefs.placeholder?.parentNode) {
        stateRefs.placeholder.parentNode.replaceChild(container, stateRefs.placeholder);
      } else if (stateRefs.originalParent) {
        stateRefs.originalParent.appendChild(container);
      }

      const el = document.getElementById(styleId);
      if (el) el.remove();

      if (stateRefs.parentPositionInfo?.element) {
        const { element, originalInlinePosition } = stateRefs.parentPositionInfo;
        element.style.position = originalInlinePosition || '';
        element.style.padding = '';
        element.style.margin = '';
        element.style.height = '';
        element.style.width = '';
        element.style.overflow = '';
      }

      container.removeAttribute("style");
    };
  }, [isFullTab]);

  const handleExitFullTab = (e) => {
    e.stopPropagation();
    setIsFullTab(false);
  };

  const handleEnterFullTab = () => setIsFullTab(true);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <style>{STYLES.hoverEffectStyle}</style>
      <AudioControls
        dc={dc}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
        currentTime={currentTime}
        duration={duration}
        formatTime={formatTime}
        handleProgressClick={handleProgressClick}
        volume={volume}
        handleVolumeChange={handleVolumeChange}
        fileName={fileName}
        isDragging={isDragging}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        isFullTab={isFullTab}
        handleExitFullTab={handleExitFullTab}
        handleEnterFullTab={handleEnterFullTab}
        STYLES={STYLES}
        uniqueWrapperClass={uniqueWrapperClass}
      />
      <audio ref={audioRef} src={audioSrc} />
    </div>
  );
}

return { App };
