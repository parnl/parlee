"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/**
 * MVP Shadowing Player (YouGlish-style)
 * - YouTube embed via IFrame Player API
 * - Transcript panel OUTSIDE the video
 * - Highlights current caption line (phrase-level)
 * - Click a line to seek
 * - Optional slow playback 0.75x
 *
 * NOTE: Word-by-word highlighting requires word-level timestamps (V2).
 */

const VIDEO_ID = "dQw4w9WgXcQ"; // TODO: заменить на реальный id видео

// MVP transcript with phrase-level timing (секунды)
// В будущем это будет приходить из базы/пайплайна.
const TRANSCRIPT = [
  { start: 0.0, end: 3.2, text: "Today I’m going to talk about one simple idea." },
  { start: 3.2, end: 6.4, text: "Most people quit because they have to prepare every day." },
  { start: 6.4, end: 9.5, text: "With Parlee, everything is ready — you just show up." },
  { start: 9.5, end: 13.0, text: "Listen, read, repeat. That’s the whole loop." },
];

function formatTime(sec) {
  const s = Math.max(0, Math.floor(sec));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function ShadowingPage() {
  const playerHostRef = useRef(null);
  const playerRef = useRef(null);
  const tickRef = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const activeIndex = useMemo(() => {
    const t = currentTime;
    const idx = TRANSCRIPT.findIndex((row) => t >= row.start && t < row.end);
    return idx === -1 ? null : idx;
  }, [currentTime]);

  // Load YouTube IFrame API + init player
  useEffect(() => {
    const ensureYouTubeAPI = () =>
      new Promise((resolve) => {
        if (window.YT && window.YT.Player) return resolve();

        const existing = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
        if (existing) {
          // Wait until it becomes available
          const check = setInterval(() => {
            if (window.YT && window.YT.Player) {
              clearInterval(check);
              resolve();
            }
          }, 50);
          return;
        }

        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);

        // YouTube calls this global when ready
        window.onYouTubeIframeAPIReady = () => resolve();
      });

    let cancelled = false;

    (async () => {
      await ensureYouTubeAPI();
      if (cancelled) return;

      if (!playerHostRef.current) return;

      playerRef.current = new window.YT.Player(playerHostRef.current, {
        videoId: VIDEO_ID,
        playerVars: {
          // controls are OK for MVP
          controls: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onReady: () => {
            setIsReady(true);
            try {
              playerRef.current.setPlaybackRate(1);
            } catch {}
            // Poll current time for transcript highlight
            tickRef.current = setInterval(() => {
              try {
                const t = playerRef.current?.getCurrentTime?.();
                if (typeof t === "number") setCurrentTime(t);
              } catch {}
            }, 150);
          },
        },
      });
    })();

    return () => {
      cancelled = true;
      if (tickRef.current) clearInterval(tickRef.current);
      tickRef.current = null;
      try {
        playerRef.current?.destroy?.();
      } catch {}
      playerRef.current = null;
    };
  }, []);

  const seekTo = (sec) => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(sec, true);
    playerRef.current.playVideo?.();
  };

  const toggleSlow = () => {
    if (!playerRef.current) return;
    const next = playbackRate === 1 ? 0.75 : 1;
    setPlaybackRate(next);
    try {
      playerRef.current.setPlaybackRate(next);
    } catch {}
  };

  const replayActive = () => {
    if (activeIndex == null) return;
    const row = TRANSCRIPT[activeIndex];
    seekTo(row.start);
  };

  return (
    <div style={{ minHeight: "100vh", padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 700 }}>Shadowing</div>
          <div style={{ opacity: 0.7, marginTop: 4 }}>
            Clip 1 of 7 · ~12 minutes total · {formatTime(currentTime)}
          </div>
        </div>

        {/* Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 18,
            alignItems: "start",
          }}
        >
          {/* Video */}
          <div
            style={{
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 16,
              overflow: "hidden",
              background: "white",
            }}
          >
            <div style={{ padding: 12, display: "flex", gap: 10, alignItems: "center" }}>
              <button
                onClick={toggleSlow}
                disabled={!isReady}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "white",
                  cursor: isReady ? "pointer" : "not-allowed",
                  fontWeight: 600,
                }}
                title="Slow playback (0.75x)"
              >
                {playbackRate === 1 ? "0.75×" : "1.0×"}
              </button>

              <button
                onClick={replayActive}
                disabled={activeIndex == null || !isReady}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "white",
                  cursor: activeIndex != null && isReady ? "pointer" : "not-allowed",
                  fontWeight: 600,
                }}
              >
                Replay line
              </button>

              <div style={{ marginLeft: "auto", opacity: 0.7, fontSize: 14 }}>
                {isReady ? "Ready" : "Loading player…"}
              </div>
            </div>

            <div style={{ aspectRatio: "16 / 9", background: "#000" }}>
              <div ref={playerHostRef} style={{ width: "100%", height: "100%" }} />
            </div>
          </div>

          {/* Transcript panel (outside video) */}
          <div
            style={{
              border: "1px solid rgba(0,0,0,0.08)",
              borderRadius: 16,
              padding: 14,
              background: "white",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Transcript</div>
            <div style={{ opacity: 0.7, marginBottom: 12, fontSize: 14 }}>
              Listen → read → repeat. Click a line to jump.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {TRANSCRIPT.map((row, i) => {
                const active = i === activeIndex;
                return (
                  <button
                    key={`${row.start}-${i}`}
                    onClick={() => seekTo(row.start)}
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: active ? "1px solid rgba(0,0,0,0.22)" : "1px solid rgba(0,0,0,0.10)",
                      background: active ? "rgba(0,0,0,0.04)" : "white",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontSize: 12, opacity: 0.65, marginBottom: 4 }}>
                      {formatTime(row.start)}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: active ? 700 : 600 }}>{row.text}</div>
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 14, fontSize: 13, opacity: 0.65 }}>
              MVP note: word-by-word highlighting requires word-level timestamps (planned for V2).
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 18, opacity: 0.7 }}>
          Tip: Try to copy rhythm and intonation, not just the words.
        </div>
      </div>
    </div>
  );
}
