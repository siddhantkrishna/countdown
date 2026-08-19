import { useEffect, useState } from "react";

const DEFAULT_TIME = 3600;

type SavedState = {
  targetTime: number | null;
  isPaused: boolean;
  eventName: string;
};

function getRemainingSeconds(targetTime: number) {
  return Math.max(Math.ceil((targetTime - Date.now()) / 1000), 0);
}

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
  const [targetTime, setTargetTime] = useState<number | null>(() => {
    const saved = localStorage.getItem("countdown-state");

    if (!saved) return null;

    try {
      const state: SavedState = JSON.parse(saved);
      return state.targetTime ?? null;
    } catch {
      return null;
    }
  });

  const [seconds, setSeconds] = useState(() => {
    const saved = localStorage.getItem("countdown-state");

    if (!saved) return DEFAULT_TIME;

    try {
      const state = JSON.parse(saved);

      if (state.targetTime) {
        return getRemainingSeconds(state.targetTime);
      }

      return DEFAULT_TIME;
    } catch {
      return DEFAULT_TIME;
    }
  });

  const [isPaused, setIsPaused] = useState(() => {
    const saved = localStorage.getItem("countdown-state");

    if (!saved) return false;

    try {
      return JSON.parse(saved).isPaused ?? false;
    } catch {
      return false;
    }
  });

  const [eventName, setEventName] = useState(() => {
    const saved = localStorage.getItem("countdown-state");

    if (!saved) return "MISSION";

    try {
      return JSON.parse(saved).eventName || "MISSION";
    } catch {
      return "MISSION";
    }
  });

  const [showSetup, setShowSetup] = useState(false);
  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");

  useEffect(() => {
    const state: SavedState = {
      targetTime,
      isPaused,
      eventName,
    };

    localStorage.setItem("countdown-state", JSON.stringify(state));
  }, [targetTime, isPaused, eventName]);

  useEffect(() => {
    if (isPaused || !targetTime) return;

    const update = () => {
      setSeconds(getRemainingSeconds(targetTime));
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [isPaused, targetTime]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        setIsPaused((current) => !current);
      }

      if (event.key.toLowerCase() === "r") {
        setTargetTime(null);
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
    setTargetTime(null);
    setSeconds(DEFAULT_TIME);
    setIsPaused(false);
  };

  const handleSetTarget = () => {
    if (!dateInput || !timeInput) return;

    const target = new Date(`${dateInput}T${timeInput}`).getTime();

    if (Number.isNaN(target) || target <= Date.now()) return;

    setTargetTime(target);
    setSeconds(getRemainingSeconds(target));
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

          <div className="date-time">
            <input
              type="date"
              value={dateInput}
              onChange={(event) => setDateInput(event.target.value)}
              aria-label="Target date"
            />

            <input
              type="time"
              value={timeInput}
              onChange={(event) => setTimeInput(event.target.value)}
              aria-label="Target time"
            />
          </div>

          <button className="apply" onClick={handleSetTarget}>
            SET TARGET
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