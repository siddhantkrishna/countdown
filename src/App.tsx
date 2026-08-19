@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");

:root {
  font-family: "Inter", sans-serif;
  color: #ffffff;
  background: #000000;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background: #000000;
}

button,
input {
  font: inherit;
}

button {
  -webkit-tap-highlight-color: transparent;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.header {
  position: absolute;
  top: 32px;
  left: 40px;
  right: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.05em;
}

.status-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.indicator {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ffffff;
}

.indicator.paused {
  opacity: 0.35;
}

.status {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.16em;
  opacity: 0.5;
}

.timer {
  display: flex;
  align-items: baseline;
  font-size: clamp(64px, 14vw, 180px);
  font-weight: 400;
  letter-spacing: -0.06em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.timer span:nth-child(even) {
  margin: 0 0.08em;
}

.controls {
  display: flex;
  gap: 8px;
  margin-top: 40px;
}

.controls button {
  padding: 10px 18px;
  border: 1px solid #ffffff;
  background: transparent;
  color: #ffffff;
  cursor: pointer;
  font-size: 11px;
  letter-spacing: 0.12em;
  transition: background 150ms ease, color 150ms ease;
}

.controls button:hover {
  background: #ffffff;
  color: #000000;
}

.shortcuts {
  margin: 24px 0 0;
  font-size: 9px;
  letter-spacing: 0.14em;
  opacity: 0.45;
}

@media (max-width: 600px) {
  .app {
    padding: 24px;
  }

  .header {
    top: 24px;
    left: 24px;
    right: 24px;
  }

  .timer {
    font-size: clamp(48px, 16vw, 100px);
  }
}