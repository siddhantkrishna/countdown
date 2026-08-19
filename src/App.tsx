import { useEffect, useState } from "react";

const DEFAULT_TIME = 3600;

type SavedState = {
  targetTime: number | null;
  pausedSeconds: number;
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
  const [initialState] = useState<SavedState>(() => {
    const params = new URLSearchParams(window.location.search);
    const target = Number(params.get("target"));
    const event = params.get("event");

    if (target && !Number.isNaN(target)) {
      return {
        targetTime: target,
        pausedSeconds: getRemainingSeconds(target),
        isPaused: false,
        eventName: event || "MISSION",
      };
    }

    const saved = localStorage.getItem("countdown-state");

    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall through to default state.
      }
    }

    return {
      targetTime: Date.now() + DEFAULT_TIME * 1000,
      pausedSeconds: DEFAULT_TIME,
      isPaused: false,
      eventName: "MISSION",
    };
  });

  const [targetTime, setTargetTime] = useState<number | null>(
    initialState.targetTime
  );

  const [seconds, setSeconds] = useState(
    initialState.isPaused
      ? initialState.pausedSeconds
      : initialState.targetTime
        ? getRemainingSeconds(initialState.targetTime)
        : DEFAULT_TIME
  );

  const [isPaused, setIsPaused] = useState(initialState.isPaused);
  const [eventName, setEventName] = useState(initialState.eventName);

  const [showSetup, setShowSetup] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [dateInput, setDateInput] = useState("");
  const [timeInput, setTimeInput] = useState("");

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
    const state: SavedState = {
      targetTime,
      pausedSeconds: seconds,
      isPaused,
      eventName,
    };

    localStorage.setItem(
      "countdown-state",
      JSON.stringify(state)
    );
  }, [targetTime, seconds, isPaused, eventName]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        handlePauseToggle();
      }

      if (event.key.toLowerCase() === "r") {
        handleReset();
      }

      if (event.key.toLowerCase() === "s") {
        setShowSetup((current) => !current);
      }

      if (event.key.toLowerCase() === "f") {
        toggleFullscreen();
      }

      if (event.key === "Escape") {
        setShowSetup(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [seconds, targetTime, isPaused]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const handlePauseToggle = () => {
    if (seconds === 0) return;

    if (isPaused) {
      setTargetTime(Date.now() + seconds * 1000);
      setIsPaused(false);
      return;
    }

    const remaining = targetTime
      ? getRemainingSeconds(targetTime)
      : seconds;

    setSeconds(remaining);
    setIsPaused(true);
  };

  const handleReset = () => {
    const newTarget = Date.now() + DEFAULT_TIME * 1000;

    setTargetTime(newTarget);
    setSeconds(DEFAULT_TIME);
    setIsPaused(false);
  };

  const handleSetTarget = () => {
    if (!dateInput || !timeInput) return;

    const target = new Date(
      `${dateInput}T${timeInput}`
    ).getTime();

    if (Number.isNaN(target) || target <= Date.now()) return;

    setTargetTime(target);
    setSeconds(getRemainingSeconds(target));
    setIsPaused(false);
    setShowSetup(false);

    const params = new URLSearchParams();

    params.set("target", String(target));
    params.set("event", eventName || "MISSION");

    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: eventName || "Countdown",
        text: `Countdown to ${eventName || "MISSION"}`,
        url,
      });

      return;
    }

    await navigator.clipboard.writeText(url);
  };

  const time = formatTime(seconds);
  const isComplete = seconds === 0;

  return (
    <main className={`app ${isFullscreen ? "fullscreen" : ""}`}>
      <header className="header">
        <span className="brand">T−</span>

        <div className="status-group">
          <span
            className={`indicator ${
              isPaused || isComplete ? "paused" : ""
            }`}
          />

          <span className="status">
            {isComplete
              ? "COMPLETE"
              : isPaused
                ? "PAUSED"
                : "ACTIVE"}
          </span>
        </div>
      </header>

      <section className="mission">
        <p className="mission-label">EVENT</p>
        <h1>{eventName || "MISSION"}</h1>
      </section>

      <section
        className="timer"
        aria-label="Countdown timer"
      >
        <span>{time.hours}</span>
        <span>:</span>
        <span>{time.minutes}</span>
        <span>:</span>
        <span>{time.seconds}</span>
      </section>

      {!isFullscreen && (
        <>
          <div className="controls">
            <button
              onClick={handlePauseToggle}
              disabled={isComplete}
            >
              {isPaused ? "RESUME" : "PAUSE"}
            </button>

            <button onClick={handleReset}>
              RESET
            </button>

            <button
              onClick={() =>
                setShowSetup((current) => !current)
              }
            >
              SET
            </button>

            <button onClick={handleShare}>
              SHARE
            </button>

            <button onClick={toggleFullscreen}>
              FULLSCREEN
            </button>
          </div>

          {showSetup && (
            <section className="setup">
              <p className="setup-label">
                CONFIGURE
              </p>

              <input
                className="event-input"
                type="text"
                maxLength={32}
                value={eventName}
                onChange={(event) =>
                  setEventName(event.target.value)
                }
                placeholder="EVENT NAME"
                aria-label="Event name"
              />

              <div className="date-time">
                <input
                  type="date"
                  value={dateInput}
                  onChange={(event) =>
                    setDateInput(event.target.value)
                  }
                  aria-label="Target date"
                />

                <input
                  type="time"
                  value={timeInput}
                  onChange={(event) =>
                    setTimeInput(event.target.value)
                  }
                  aria-label="Target time"
                />
              </div>

              <button
                className="apply"
                onClick={handleSetTarget}
              >
                SET TARGET
              </button>
            </section>
          )}

          <footer className="footer">
            <span>COUNTDOWN SYSTEM</span>
            <span>LOCAL · SECURE · ACTIVE</span>
          </footer>
        </>
      )}
    </main>
  );
}

export default App;