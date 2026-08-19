import { useEffect, useState } from "react";

const INITIAL_TIME = 3600;

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return {
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(remainingSeconds).padStart(2, "0"),
  };
}

function App() {
  const [seconds, setSeconds] = useState(INITIAL_TIME);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || seconds === 0) return;

    const interval = setInterval(() => {
      setSeconds((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, seconds]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        setIsPaused((current) => !current);
      }

      if (event.key.toLowerCase() === "r") {
        setSeconds(INITIAL_TIME);
        setIsPaused(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const time = formatTime(seconds);

  const handleReset = () => {
    setSeconds(INITIAL_TIME);
    setIsPaused(false);
  };

  return (
    <main className="app">
      <p className="label">COUNTDOWN</p>

      <section className="timer" aria-label="Countdown timer">
        <span>{time.hours}</span>
        <span>:</span>
        <span>{time.minutes}</span>
        <span>:</span>
        <span>{time.seconds}</span>
      </section>

      <div className="controls">
        <button onClick={() => setIsPaused((current) => !current)}>
          {isPaused ? "RESUME" : "PAUSE"}
        </button>

        <button onClick={handleReset}>RESET</button>
      </div>

      <p className="shortcuts">SPACE TO PAUSE · R TO RESET</p>
    </main>
  );
}

export default App;