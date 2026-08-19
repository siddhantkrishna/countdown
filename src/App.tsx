import { useEffect, useState } from "react";

const DEFAULT_TIME = 3600;

type SavedState = {
  seconds: number;
  isPaused: boolean;
  eventName: string;
};

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
  const [seconds, setSeconds] = useState(() => {
    const saved = localStorage.getItem("countdown-state");

    if (!saved) return DEFAULT_TIME;

    try {
      const state: SavedState = JSON.parse(saved);
      return state.seconds;
    } catch {
      return DEFAULT_TIME;
    }
  });

  const [isPaused, setIsPaused] = useState(() => {
    const saved = localStorage.getItem("countdown-state");

    if (!saved) return false;

    try {
      const state: SavedState = JSON.parse(saved);
      return state.isPaused;
    } catch {
      return false;
    }
  });

  const [eventName, setEventName] = useState(() => {
    const saved = localStorage.getItem("countdown-state");

    if (!saved) return "MISSION";

    try {
      const state: SavedState = JSON.parse(saved);
      return state.eventName || "MISSION";
    } catch {
      return "MISSION";
    }
  });

  const [showSetup, setShowSetup] = useState(false);
  const [inputHours, setInputHours] = useState("01");
  const [inputMinutes, setInputMinutes] = useState("00");
  const [inputSeconds, setInputSeconds] = useState("00");

  useEffect(() => {
    const state: SavedState = {
      seconds,
      isPaused,
      eventName,
    };

    localStorage.setItem("countdown-state", JSON.stringify(state));
  }, [seconds, isPaused, eventName]);

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
        setSeconds(DEFAULT_TIME);
        setIsPaused(false);
      }

      if (event.key.toLowerCase() === "s") {
        setShowSetup((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const time = formatTime(seconds);
  const isComplete = seconds === 0;

  const handleReset = () => {
    setSeconds(DEFAULT_TIME);
    setIsPaused(false);
  };

  const handleSetTimer = () => {
    const hours = Math.max(0, Number(inputHours) || 0);
    const minutes = Math.min(59, Math.max(0, Number(inputMinutes) || 0));
    const newSeconds = Math.min(59, Math.max(0, Number(inputSeconds) || 0));

    const totalSeconds = hours * 3600 + minutes * 60 + newSeconds;

    setSeconds(totalSeconds);
    setIsPaused(false);
    setShowSetup(false);
  };

  return (
    <main className="app">
      <header className="header">
        <span className="brand">T−</span>

        <div className="status-group">
          <span
            className={`indicator ${
              isPaused || isComplete ? "paused" : ""
            }`}
          />

          <span className="status">
            {isComplete ? "COMPLETE" : isPaused ? "PAUSED" : "ACTIVE"}
          </span>
        </div>
      </header>

      <section className="mission">
        <p className="mission-label">EVENT</p>
        <h1>{eventName || "MISSION"}</h1>
      </section>

      <section className="timer" aria-label="Countdown timer">
        <span>{time.hours}</span>
        <span>:</span>
        <span>{time.minutes}</span>
        <span>:</span>
        <span>{time.seconds}</span>
      </section>

      <div className="controls">
        <button
          onClick={() => setIsPaused((current) => !current)}
          disabled={isComplete}
        >
          {isPaused ? "RESUME" : "PAUSE"}
        </button>

        <button onClick={handleReset}>RESET</button>

        <button onClick={() => setShowSetup((current) => !current)}>
          SET
        </button>
      </div>

      {showSetup && (
        <section className="setup">
          <p className="setup-label">CONFIGURE</p>

          <input
            className="event-input"
            type="text"
            maxLength={32}
            value={eventName}
            onChange={(event) => setEventName(event.target.value)}
            placeholder="EVENT NAME"
            aria-label="Event name"
          />

          <div className="inputs">
            <input
              type="number"
              min="0"
              value={inputHours}
              onChange={(event) => setInputHours(event.target.value)}
              aria-label="Hours"
            />

            <span>:</span>

            <input
              type="number"
              min="0"
              max="59"
              value={inputMinutes}
              onChange={(event) => setInputMinutes(event.target.value)}
              aria-label="Minutes"
            />

            <span>:</span>

            <input
              type="number"
              min="0"
              max="59"
              value={inputSeconds}
              onChange={(event) => setInputSeconds(event.target.value)}
              aria-label="Seconds"
            />
          </div>

          <button className="apply" onClick={handleSetTimer}>
            APPLY
          </button>
        </section>
      )}

      <p className="shortcuts">
        SPACE TO PAUSE · R TO RESET · S TO SET
      </p>
    </main>
  );
}

export default App;