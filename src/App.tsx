import { useEffect, useState } from "react";

function App() {
  const [seconds, setSeconds] = useState(3600);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || seconds === 0) return;

    const interval = setInterval(() => {
      setSeconds((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, seconds]);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const handleReset = () => {
    setSeconds(3600);
    setIsPaused(false);
  };

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

      <div className="controls">
        <button onClick={() => setIsPaused((current) => !current)}>
          {isPaused ? "RESUME" : "PAUSE"}
        </button>

        <button onClick={handleReset}>RESET</button>
      </div>
    </main>
  );
}

export default App;