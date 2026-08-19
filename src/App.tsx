import { useEffect, useState } from "react";

function App() {
  const [seconds, setSeconds] = useState(3600);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
  if (isPaused) return;
    const interval = setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => clearInterval(interval);
}, [isPaused]);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return (
    <main className="app">
      <p className="label">COUNTDOWN</p>

      <section className="timer" aria-label="Countdown timer">
        <span>{String(hours).padStart(2, "0")}</span>
        <span>:</span>
        <span>{String(minutes).padStart(2, "0")}</span>
        <span>:</span>
        <span>{String(remainingSeconds).padStart(2, "0")}</span>
      </section>
    </main>
  );
}

export default App;