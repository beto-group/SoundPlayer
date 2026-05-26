function AudioControls({
  dc,
  isPlaying,
  togglePlay,
  currentTime,
  duration,
  formatTime,
  handleProgressClick,
  volume,
  handleVolumeChange,
  fileName,
  isDragging,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  isFullTab,
  handleExitFullTab,
  handleEnterFullTab,
  STYLES,
  uniqueWrapperClass
}) {
  if (!isFullTab) {
    return (
      <div style={STYLES.compactWrapper}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {dc && <dc.Icon icon="music" style={{ fontSize: "16px", color: "#8b5cf6" }} />}
          <p style={STYLES.compactText}>Sound Player</p>
        </div>
        <button 
          style={STYLES.button} 
          onClick={handleEnterFullTab}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {dc && <dc.Icon icon="maximize" style={{ fontSize: "14px" }} />}
            <span>Enter Full Tab</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div style={STYLES.fullTabWrapper} className={uniqueWrapperClass}>
      <div
        style={STYLES.exitIcon}
        className="subtle-icon"
        onClick={handleExitFullTab}
      >
        {dc && <dc.Icon icon="minimize" style={{ fontSize: "20px" }} />}
        <span className="exit-tooltip" style={STYLES.tooltip}>
          Close Full Mode
        </span>
      </div>

      <div style={STYLES.playerContainer}>
        <div>
          <div style={STYLES.title}>⦿ SOUND PLAYER ⦿</div>
          <div style={STYLES.subtitle}>B E T O . 8 8 8</div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          style={{
            ...STYLES.dropZone,
            ...(isDragging ? STYLES.dropZoneActive : {})
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div style={{ fontSize: "32px", marginBottom: "10px", color: isDragging ? "#8b5cf6" : "#6b7280" }}>
            {isDragging ? (
              dc && <dc.Icon icon="circle-dot" style={{ fontSize: "32px" }} />
            ) : (
              dc && <dc.Icon icon="upload" style={{ fontSize: "32px" }} />
            )}
          </div>
          <div style={{ letterSpacing: "2px" }}>
            {isDragging ? "DROP FILE HERE" : "DRAG & DROP AUDIO FILE"}
          </div>
          <div style={{ fontSize: "11px", marginTop: "8px", color: "#4b5563", display: "flex", gap: "8px", alignItems: "center", justifyContent: "center" }}>
            {dc && <dc.Icon icon="file-audio" style={{ fontSize: "12px" }} />}
            <span>.WAV • .MP3 • .MP4</span>
          </div>
        </div>

        {/* Current Track */}
        <div style={{ 
          textAlign: "center", 
          color: "#8b5cf6", 
          fontSize: "13px", 
          fontFamily: "monospace",
          letterSpacing: "1px",
          padding: "10px",
          backgroundColor: "#000000",
          borderRadius: "6px",
          border: "1px solid #2d2d2d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px"
        }}>
          {dc && <dc.Icon icon="music" style={{ fontSize: "16px" }} />}
          <span>NOW PLAYING: {fileName}</span>
        </div>

        {/* Play/Pause Button */}
        <div
          style={{
            ...STYLES.playButton,
            ...(isPlaying ? {
              backgroundColor: "#2d1f3d",
              boxShadow: "0 0 30px rgba(139, 92, 246, 0.6)",
            } : {})
          }}
          onClick={togglePlay}
        >
          {isPlaying ? (
            dc && <dc.Icon icon="pause" style={{ fontSize: "28px" }} />
          ) : (
            dc && <dc.Icon icon="play" style={{ fontSize: "28px", marginLeft: "4px" }} />
          )}
        </div>

        {/* Progress Bar */}
        <div>
          <div style={STYLES.progressContainer} onClick={handleProgressClick}>
            <div
              style={{
                ...STYLES.progressBar,
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
              }}
            />
          </div>
          <div style={STYLES.timeDisplay}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div style={STYLES.volumeContainer}>
          {dc && <dc.Icon icon="volume-2" style={{ fontSize: "18px", color: "#8b5cf6" }} />}
          <div style={STYLES.volumeSlider} onClick={handleVolumeChange}>
            <div
              style={{
                ...STYLES.volumeBar,
                width: `${volume * 100}%`,
              }}
            />
          </div>
          <span style={{ fontSize: "12px", color: "#6b7280", fontFamily: "monospace", minWidth: "40px" }}>
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}

return { AudioControls };
