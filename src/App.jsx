import React, { useCallback, useEffect, useMemo, useState } from "react";
import { chapterContent, questions } from "./questions";
import { sfx, toggleMuted, isMuted } from "./sfx";
import { loadProgress, saveProgress, clearProgress } from "./storage";
import "./App.css";

const DECRYPT_DELAY_MS = 1600;

function SoundToggle() {
  const [muted, setMuted] = useState(isMuted());
  return (
    <button
      type="button"
      className="sound-toggle"
      aria-label={muted ? "Unmute sound" : "Mute sound"}
      title={muted ? "Sound off" : "Sound on"}
      onClick={() => {
        const next = toggleMuted();
        setMuted(next);
        if (!next) sfx.click();
      }}
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}

function normalize(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()'\"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isCorrect(userInput, answer, acceptedAnswers) {
  const guess = normalize(userInput);
  if (!guess) return false;
  const targets = acceptedAnswers ? acceptedAnswers : [answer];
  return targets.some((target) => {
    const normalizedTarget = normalize(target);
    if (!normalizedTarget) return false;
    return (
      guess === normalizedTarget ||
      guess.includes(normalizedTarget) ||
      normalizedTarget.includes(guess)
    );
  });
}

function splitSentences(text) {
  return (text.match(/[^.!?]+[.!?]+(?:\s+|$)/g) || [text]).map((s) => s.trim()).filter(Boolean);
}

function TypedLines({ text, lineClassName = "", stackClassName = "", intervalMs = 850 }) {
  const lines = useMemo(() => splitSentences(text), [text]);
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    setVisibleCount(1);
  }, [text]);

  useEffect(() => {
    if (visibleCount >= lines.length) return undefined;
    const timer = window.setTimeout(() => {
      sfx.typeTick();
      setVisibleCount((v) => Math.min(lines.length, v + 1));
    }, intervalMs);
    return () => window.clearTimeout(timer);
  }, [visibleCount, lines.length, intervalMs]);

  return (
    <div className={stackClassName}>
      {lines.slice(0, visibleCount).map((line, i) => (
        <p
          key={i}
          className={`${lineClassName} typed-line ${i === visibleCount - 1 ? "typed-line-current" : ""}`.trim()}
        >
          {line}
        </p>
      ))}
    </div>
  );
}

function getChapterRank(correctCount, total, ladder) {
  if (total <= 0 || correctCount <= 0) return ladder[0];
  const idx = Math.min(ladder.length - 1, Math.max(0, Math.ceil((correctCount / total) * ladder.length) - 1));
  return ladder[idx];
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let curY = y;
  for (const word of words) {
    const testLine = `${line}${word} `;
    if (line && ctx.measureText(testLine).width > maxWidth) {
      ctx.fillText(line.trim(), x, curY);
      line = `${word} `;
      curY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) {
    ctx.fillText(line.trim(), x, curY);
    curY += lineHeight;
  }
  return curY;
}

function getFinalRank(correctCount, total) {
  if (total <= 0) return { label: "Field Agent" };
  const ratio = correctCount / total;
  if (ratio < 1 / 3) return { label: "Field Agent" };
  if (ratio < 2 / 3) return { label: "Senior Agent" };
  return { label: "Master Agent" };
}

function PosterIllustration() {
  return (
    <svg
      className="poster-illustration"
      viewBox="0 0 220 190"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M18 30 L92 18 L162 30 L150 158 L78 172 L10 158 Z"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M40 42 Q60 60 42 84 Q26 104 46 128" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
      <path d="M70 34 Q90 50 78 70" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
      <path d="M112 40 L138 46 M108 60 L134 64 M60 140 L86 148 M96 152 L118 158" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
      <path d="M40 112 q14 -10 28 0 q14 10 0 18 q-14 8 -22 -2" stroke="currentColor" strokeWidth="1.6" strokeDasharray="4 4" opacity="0.7" />
      <path d="M120 100 L134 112" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M128 118 L108 96" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />

      <g>
        <circle cx="130" cy="82" r="40" stroke="currentColor" strokeWidth="6" fill="rgba(246,236,217,0.9)" />
        <circle cx="130" cy="82" r="31" stroke="currentColor" strokeWidth="2" opacity="0.5" />
        <path
          d="M130 66 c8 0 13 6 13 13 c0 9 -13 20 -13 20 c0 0 -13 -11 -13 -20 c0 -7 5 -13 13 -13 Z"
          fill="currentColor"
        />
        <circle cx="130" cy="79" r="4.5" fill="rgba(246,236,217,0.95)" />
      </g>

      <path
        d="M158 110 L190 150"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
      />
      <path
        d="M158 110 L190 150"
        stroke="rgba(246,236,217,0.4)"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BackButton({ onClick }) {
  return (
    <button type="button" className="back-button" onClick={onClick}>
      ← Back
    </button>
  );
}

function HomeButton({ onClick }) {
  return (
    <button type="button" className="back-button home-button" onClick={onClick}>
      ⌂ Home
    </button>
  );
}

function SubjectPhoto() {
  return (
    <svg viewBox="0 0 80 80" className="subject-photo-art" aria-hidden="true">
      <circle cx="40" cy="30" r="16" fill="currentColor" opacity="0.85" />
      <path d="M10 74c2-20 16-30 30-30s28 10 30 30" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

function DecryptIcon() {
  return (
    <svg viewBox="0 0 64 64" className="decrypt-icon-art" aria-hidden="true">
      <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="2.5" opacity="0.5" />
      <circle cx="32" cy="32" r="17" stroke="currentColor" strokeWidth="2" opacity="0.7" />
      <path d="M32 8 L32 16 M32 48 L32 56 M8 32 L16 32 M48 32 L56 32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="32" r="4" fill="currentColor" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 48 48" className="document-icon-art" aria-hidden="true">
      <path d="M14 6 H30 L36 12 V42 H14 Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <path d="M30 6 V12 H36" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <path d="M19 22 H31 M19 28 H31 M19 34 H26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.75" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg viewBox="0 0 48 48" className="compass-icon-art" aria-hidden="true">
      <circle cx="24" cy="24" r="19" stroke="currentColor" strokeWidth="2.2" fill="none" />
      <path d="M31 17 L21 21 L17 31 L27 27 Z" fill="currentColor" opacity="0.85" />
      <circle cx="24" cy="24" r="2.4" fill="currentColor" />
    </svg>
  );
}

function ImageFrame({ src, alt, className = "" }) {
  const [errored, setErrored] = useState(false);
  const resolved = src && !errored ? src : null;

  return (
    <div className={`image-frame ${className}`.trim()}>
      {resolved ? (
        <img src={resolved} alt={alt} loading="lazy" onError={() => setErrored(true)} />
      ) : (
        <div className="image-placeholder" aria-label="Image placeholder">
          <DocumentIcon />
        </div>
      )}
    </div>
  );
}

function StoryCard({ story, onContinue, theme }) {
  const lines = useMemo(() => splitSentences(story.body), [story.body]);
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    setVisibleCount(1);
  }, [story.title]);

  useEffect(() => {
    if (visibleCount >= lines.length) return undefined;
    const timer = window.setTimeout(() => {
      sfx.typeTick();
      setVisibleCount((v) => Math.min(lines.length, v + 1));
    }, 700);
    return () => window.clearTimeout(timer);
  }, [visibleCount, lines.length]);

  const complete = visibleCount >= lines.length;

  const handleNext = () => {
    sfx.click();
    if (!complete) {
      setVisibleCount(lines.length);
      return;
    }
    onContinue();
  };

  return (
    <div className={`story-card ${theme}`}>
      <div className="story-paper">
        <p className="story-eyebrow">Recovered Document</p>
        <h2>{story.title}</h2>
        <ImageFrame src={`${import.meta.env.BASE_URL}images/${story.image}`} alt={story.title} className="story-image" />

        <div className="story-body-stack">
          {lines.slice(0, visibleCount).map((line, i) => (
            <p
              key={i}
              className={`story-body-line typed-line ${i === visibleCount - 1 ? "typed-line-current" : ""}`.trim()}
            >
              {line}
            </p>
          ))}
        </div>
        <button className="cmd-button primary" type="button" onClick={handleNext}>
          {complete ? "Continue" : "Skip ▸"}
        </button>
      </div>
    </div>
  );
}

function QuestionCard({ question, state, onSubmit, onAdvance, theme, stampText }) {
  const [value, setValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [shake, setShake] = useState(false);
  const solved = state?.status === "correct";

  useEffect(() => {
    setValue("");
    setSelectedOption("");
    setShake(false);
  }, [question.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (solved) return;

    const safeValue = question.type === "multiple_choice" ? selectedOption : value;
    const correct = onSubmit(question, safeValue);
    if (!correct) {
      sfx.wrong();
      setShake(true);
      if (question.type === "multiple_choice") {
        setSelectedOption("");
      }
      setTimeout(() => setShake(false), 500);
    } else {
      sfx.correct();
      // The stamp slams down a beat after the correct chime.
      setTimeout(() => sfx.stamp(), 260);
      setValue("");
      setSelectedOption("");
    }
  };

  return (
    <div className={`card ${theme} ${solved ? "card-solved" : ""} ${shake ? "card-shake" : ""}`}>
      <div className="card-inner">
        <div className="question-block">
          <p className="card-label">{question.label}</p>
          <p className="card-question">{question.question}</p>
          {solved && (
            <div className="stamp-wrap" aria-hidden="true">
              <div className="stamp-ring">
                <span className="stamp-text-top">{stampText}</span>
                <span className="stamp-icon">✦</span>
                <span className="stamp-text-bottom">{state?.rank?.label}</span>
              </div>
            </div>
          )}
        </div>
        <ImageFrame src={`${import.meta.env.BASE_URL}images/${question.image}`} alt={question.label} className="question-image" />


        {question.type === "multiple_choice" ? (
          <div className="choice-list" role="list">
            {question.options.map((option, index) => {
              const optionKey = String.fromCharCode(65 + index);
              return (
                <button
                  key={option}
                  type="button"
                  className={`choice-button ${selectedOption === optionKey ? "active" : ""}`}
                  onClick={() => {
                    sfx.click();
                    setSelectedOption(optionKey);
                  }}
                  disabled={solved}
                >
                  <span className="choice-key">{optionKey}</span>
                  <span className="choice-text">{option}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <form className="card-form" onSubmit={handleSubmit}>
            <input
              className="card-input"
              type="text"
              placeholder="Type your answer"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="off"
              aria-label={question.label}
              disabled={solved}
            />
            <button className="card-submit" type="submit">
              Submit
            </button>
          </form>
        )}

        {question.type === "multiple_choice" && !solved && (
          <button className="card-submit inline" type="button" onClick={handleSubmit} disabled={!selectedOption}>
            Submit
          </button>
        )}

        {!solved && state?.status === "wrong" && <p className="card-feedback">Try again.</p>}

        {solved && (
          <button className="card-advance" type="button" onClick={onAdvance}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.1,
        duration: 2.2 + Math.random() * 1.6,
        rotate: Math.random() * 360,
        colorClass: `c${(i % 5) + 1}`,
      })),
    []
  );

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className={`confetti-piece ${piece.colorClass}`}
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${piece.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [saved] = useState(() => loadProgress());

  const [screen, setScreen] = useState(() => {
    const s = saved?.screen;
    if (!s || s === "decrypting") return saved ? "home" : "intro";
    return s;
  });
  const [activeChapter, setActiveChapter] = useState(() => saved?.activeChapter || 1);
  const [segmentIndex, setSegmentIndex] = useState(() => saved?.segmentIndex || 0);
  const [questionIndex, setQuestionIndex] = useState(() => saved?.questionIndex || 0);
  const defaultChapterAnswers = useMemo(
    () => Object.fromEntries(Object.keys(chapterContent).map((id) => [id, {}])),
    []
  );
  const [chapterAnswers, setChapterAnswers] = useState(() => saved?.chapterAnswers || defaultChapterAnswers);
  const [completedChapters, setCompletedChapters] = useState(() => saved?.completedChapters || []);
  const [chapterProgress, setChapterProgress] = useState(() => saved?.chapterProgress || {});
  const [rankUp, setRankUp] = useState(null);
  const [pendingUnlock, setPendingUnlock] = useState(null);
  const [agentName, setAgentName] = useState("");

  const showBackButton = screen !== "intro" && screen !== "home" && screen !== "decrypting";

  const handleBack = useCallback(() => {
    sfx.pageTurn();
    setScreen(screen === "lunaDossier" ? "intro" : "home");
  }, [screen]);

  const handleGoToIntro = useCallback(() => {
    sfx.pageTurn();
    setScreen("intro");
  }, []);

  const chapterConfig = chapterContent[activeChapter];
  const currentSegment = chapterConfig?.segments?.[segmentIndex];
  const currentQuestion = currentSegment?.questions?.[questionIndex];
  const chapterQuestionTotal = chapterConfig?.segments?.reduce((total, segment) => total + segment.questions.length, 0) || 0;
  const chapterCorrectCount = useMemo(() => {
    const chapterState = chapterAnswers[activeChapter] || {};
    return Object.values(chapterState).filter((entry) => entry?.status === "correct").length;
  }, [activeChapter, chapterAnswers]);
  const chapterRank = getChapterRank(chapterCorrectCount, chapterQuestionTotal, chapterConfig?.rankLadder || []);
  const combinedCorrectCount = useMemo(() => {
    return Object.values(chapterAnswers).reduce((sum, chapterState) => {
      return sum + Object.values(chapterState).filter((entry) => entry?.status === "correct").length;
    }, 0);
  }, [chapterAnswers]);
  const finalRank = getFinalRank(combinedCorrectCount, questions.length);

  useEffect(() => {
    if (!rankUp) return undefined;
    sfx.rankUp();
    const timer = window.setTimeout(() => setRankUp(null), 1400);
    return () => window.clearTimeout(timer);
  }, [rankUp]);

  useEffect(() => {
    if (screen === "finale" || screen === "chapterComplete") sfx.stamp();
    if (screen === "finale") sfx.finale();
  }, [screen]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  // Remember exactly where the player was within a mission, so "Resume Operation" continues there.
  useEffect(() => {
    if (screen !== "chapterIntro" && screen !== "story" && screen !== "question") return;
    setChapterProgress((prev) => {
      const existing = prev[activeChapter];
      if (existing && existing.segmentIndex === segmentIndex && existing.questionIndex === questionIndex) return prev;
      return { ...prev, [activeChapter]: { segmentIndex, questionIndex } };
    });
  }, [screen, activeChapter, segmentIndex, questionIndex]);

  // Auto-save progress on this device after every change.
  useEffect(() => {
    saveProgress({
      screen,
      activeChapter,
      segmentIndex,
      questionIndex,
      chapterAnswers,
      completedChapters,
      chapterProgress,
    });
  }, [screen, activeChapter, segmentIndex, questionIndex, chapterAnswers, completedChapters, chapterProgress]);

  // "Decrypting..." transition between finishing a mission and unlocking the next one.
  useEffect(() => {
    if (screen !== "decrypting" || !pendingUnlock) return undefined;
    const timer = window.setTimeout(() => {
      if (pendingUnlock.type === "finale") {
        sfx.pageTurn();
        setScreen("finale");
      } else {
        const progress = chapterProgress[pendingUnlock.chapterId] || { segmentIndex: 0, questionIndex: 0 };
        sfx.pageTurn();
        setActiveChapter(pendingUnlock.chapterId);
        setSegmentIndex(progress.segmentIndex);
        setQuestionIndex(progress.questionIndex);
        setScreen("chapterIntro");
      }
      setPendingUnlock(null);
    }, DECRYPT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [screen, pendingUnlock, chapterProgress]);

  const handleOpenMissionBoard = useCallback(() => {
    sfx.pageTurn();
    setScreen("lunaDossier");
  }, []);

  const handleContinueToMissionBoard = useCallback(() => {
    sfx.pageTurn();
    setScreen("home");
  }, []);

  const handleStartChapter = useCallback((chapterId) => {
    sfx.pageTurn();
    const progress = chapterProgress[chapterId] || { segmentIndex: 0, questionIndex: 0 };
    setActiveChapter(chapterId);
    setSegmentIndex(progress.segmentIndex);
    setQuestionIndex(progress.questionIndex);
    setScreen("chapterIntro");
  }, [chapterProgress]);

  const handleEnterChapterStory = useCallback(() => {
    sfx.click();
    setScreen("story");
  }, []);

  const handleContinueStory = useCallback(() => {
    sfx.pageTurn();
    setScreen("question");
  }, []);

  const handleSubmitAnswer = useCallback(
    (question, value) => {
      const correct = isCorrect(value, question.answer, question.acceptedAnswers);
      const previousCount = Object.values(chapterAnswers[activeChapter] || {}).filter((entry) => entry?.status === "correct").length;
      const previousRank = getChapterRank(previousCount, chapterQuestionTotal, chapterConfig?.rankLadder || []);

      setChapterAnswers((prev) => {
        const chapterState = prev[activeChapter] || {};
        const nextCount = Object.values(chapterState).filter((entry) => entry?.status === "correct").length + (correct ? 1 : 0);
        const nextRank = getChapterRank(nextCount, chapterQuestionTotal, chapterConfig?.rankLadder || []);
        return {
          ...prev,
          [activeChapter]: {
            ...chapterState,
            [question.id]: {
              status: correct ? "correct" : "wrong",
              rank: correct ? nextRank : chapterState[question.id]?.rank,
            },
          },
        };
      });

      if (correct) {
        const nextRank = getChapterRank(previousCount + 1, chapterQuestionTotal, chapterConfig?.rankLadder || []);
        if (nextRank !== previousRank) {
          setRankUp({ chapterId: activeChapter, rank: nextRank, previousRank });
        }
      }

      return correct;
    },
    [activeChapter, chapterAnswers, chapterConfig?.rankLadder, chapterQuestionTotal]
  );

  const handleAdvanceQuestion = useCallback(() => {
    if (!currentSegment || !chapterConfig) return;
    sfx.pageTurn();

    if (questionIndex + 1 < currentSegment.questions.length) {
      setQuestionIndex((prev) => prev + 1);
      return;
    }

    if (segmentIndex + 1 < chapterConfig.segments.length) {
      setSegmentIndex((prev) => prev + 1);
      setQuestionIndex(0);
      setScreen("story");
      return;
    }

    setCompletedChapters((prev) => (prev.includes(activeChapter) ? prev : [...prev, activeChapter]));
    setScreen("chapterComplete");
  }, [activeChapter, chapterConfig, currentSegment, questionIndex, segmentIndex]);

  const handleReset = useCallback(() => {
    sfx.click();
    clearProgress();
    setScreen("intro");
    setActiveChapter(1);
    setSegmentIndex(0);
    setQuestionIndex(0);
    setChapterAnswers({ 1: {}, 2: {} });
    setCompletedChapters([]);
    setChapterProgress({});
    setRankUp(null);
    setPendingUnlock(null);
  }, []);

  const handleDownloadCertificate = useCallback(async () => {
    sfx.click();
    if (document.fonts?.load) {
      await Promise.all([
        document.fonts.load('14.5px "Special Elite"'),
        document.fonts.load('bold 30px "Special Elite"'),
        document.fonts.load('18px "Bebas Neue"'),
      ]);
    }

    const width = 640;
    const height = 540;
    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);

    // Warm parchment ground, matching the app's card palette.
    const bgGradient = ctx.createRadialGradient(
      width / 2, height * 0.32, 40,
      width / 2, height * 0.32, width * 0.85
    );
    bgGradient.addColorStop(0, "#f6ecc9");
    bgGradient.addColorStop(0.55, "#e9d5a1");
    bgGradient.addColorStop(1, "#c9a96e");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Soft edge vignette for depth.
    const vignette = ctx.createRadialGradient(
      width / 2, height / 2, height * 0.35,
      width / 2, height / 2, height * 0.75
    );
    vignette.addColorStop(0, "rgba(74, 55, 40, 0)");
    vignette.addColorStop(1, "rgba(74, 55, 40, 0.18)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    // Fine paper grain.
    ctx.save();
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 900; i += 1) {
      ctx.fillStyle = Math.random() > 0.5 ? "#2b1f14" : "#fffbe8";
      ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
    }
    ctx.restore();

    // Ornamental double border.
    ctx.strokeStyle = "rgba(74, 55, 40, 0.55)";
    ctx.lineWidth = 2.5;
    ctx.strokeRect(16, 16, width - 32, height - 32);
    ctx.strokeStyle = "rgba(184, 138, 74, 0.7)";
    ctx.lineWidth = 1;
    ctx.strokeRect(22, 22, width - 44, height - 44);

    // Brass corner rivets.
    [[30, 30], [width - 30, 30], [30, height - 30], [width - 30, height - 30]].forEach(([rx, ry]) => {
      const rivet = ctx.createRadialGradient(rx - 1.5, ry - 1.5, 0.5, rx, ry, 4.5);
      rivet.addColorStop(0, "#f2e2b0");
      rivet.addColorStop(0.7, "#b8925a");
      rivet.addColorStop(1, "#6b4f30");
      ctx.fillStyle = rivet;
      ctx.beginPath();
      ctx.arc(rx, ry, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    const centerX = width / 2;
    const textMaxWidth = width - 140;
    let y = 62;

    ctx.textAlign = "center";
    ctx.fillStyle = "#8a6a3a";
    ctx.font = '13px "Special Elite", monospace';
    ctx.fillText("CIEE INTELLIGENCE DIVISION  ·  CERTIFICATE OF COMPLETION", centerX, y);

    y += 36;
    ctx.fillStyle = "#2b1f14";
    ctx.font = '28px "Special Elite", monospace';
    ctx.fillText("MISSION COMPLETE", centerX, y);

    // Gold rule under the title.
    y += 16;
    ctx.strokeStyle = "rgba(184, 138, 74, 0.75)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(centerX - 90, y);
    ctx.lineTo(centerX + 90, y);
    ctx.stroke();

    y += 30;
    ctx.font = '14.5px "Special Elite", monospace';
    ctx.fillStyle = "#4a3d24";
    ctx.fillText(`Final Rank: ${finalRank.label}`, centerX, y);

    y += 34;
    ctx.fillStyle = "#6b5a34";
    ctx.fillText("This certifies that Agent", centerX, y);

    y += 34;
    const displayName = agentName.trim() || "Field Agent";
    let nameFontSize = 24;
    ctx.font = `${nameFontSize}px "Special Elite", monospace`;
    while (ctx.measureText(displayName).width > textMaxWidth && nameFontSize > 14.5) {
      nameFontSize -= 1;
      ctx.font = `${nameFontSize}px "Special Elite", monospace`;
    }
    ctx.fillStyle = "#7c2c26";
    ctx.fillText(displayName, centerX, y);

    y += 32;
    ctx.font = '14.5px "Special Elite", monospace';
    ctx.fillStyle = "#4a3d24";
    ctx.fillText("has completed Luna's trail and verified", centerX, y);
    y += 21;
    ctx.fillText(`${combinedCorrectCount} / ${questions.length} field reports.`, centerX, y);

    y += 34;
    ctx.fillStyle = "#3a2f1c";
    const dedication =
      "In honor of Luna's journey through the Seoul Museum of History and Gyeonghuigung Palace, and the great-grandfather whose footsteps she traced.";
    y = drawWrappedText(ctx, dedication, centerX, y, textMaxWidth, 21);

    // Signature line, bottom-left — a diploma-style flourish.
    const sigY = height - 56;
    ctx.strokeStyle = "rgba(74, 55, 40, 0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(56, sigY);
    ctx.lineTo(206, sigY);
    ctx.stroke();
    ctx.textAlign = "left";
    ctx.font = '10px "Special Elite", monospace';
    ctx.fillStyle = "#8a6a3a";
    ctx.fillText("FIELD DIRECTOR — CIEE", 56, sigY + 14);

    ctx.textAlign = "left";
    const dateStr = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    ctx.font = '11px "Special Elite", monospace';
    ctx.fillStyle = "#6b5a34";
    ctx.fillText(dateStr, 56, sigY - 10);

    // Rotated ink-stamp seal, bottom-right — the "graded" authenticity mark.
    ctx.save();
    ctx.translate(width - 96, height - 90);
    ctx.rotate((-11 * Math.PI) / 180);
    ctx.globalCompositeOperation = "multiply";

    const sealFill = ctx.createRadialGradient(0, 0, 4, 0, 0, 46);
    sealFill.addColorStop(0, "rgba(158, 59, 50, 0.18)");
    sealFill.addColorStop(0.7, "rgba(158, 59, 50, 0.09)");
    sealFill.addColorStop(1, "rgba(158, 59, 50, 0)");
    ctx.fillStyle = sealFill;
    ctx.beginPath();
    ctx.arc(0, 0, 46, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#9e3b32";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, 46, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, 38, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#9e3b32";
    ctx.textAlign = "center";
    ctx.font = '9px "Bebas Neue", "Special Elite", monospace';
    ctx.fillText("★ VERIFIED ★", 0, -10);
    ctx.font = '18px "Bebas Neue", "Special Elite", monospace';
    ctx.fillText("✦", 0, 6);
    ctx.font = '9px "Bebas Neue", "Special Elite", monospace';
    ctx.fillText(finalRank.label.toUpperCase(), 0, 22);
    ctx.restore();

    const link = document.createElement("a");
    const fileSlug = displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "field-agent";
    link.download = `mission-certificate-${fileSlug}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [agentName, combinedCorrectCount, finalRank.label]);

  const chapterIds = useMemo(
    () => Object.keys(chapterContent).map(Number).sort((a, b) => a - b),
    []
  );

  const handleContinueAfterChapter = useCallback(() => {
    sfx.click();
    const idx = chapterIds.indexOf(activeChapter);
    const nextChapterId = chapterIds[idx + 1];
    if (nextChapterId) {
      setPendingUnlock({ type: "chapter", chapterId: nextChapterId });
    } else {
      setPendingUnlock({ type: "finale" });
    }
    setScreen("decrypting");
  }, [activeChapter, chapterIds]);

  if (screen === "intro") {
    return (
      <div className="app intro-screen">
        <SoundToggle />
        <div className="briefing-frame reveal reveal-1">
          <span className="briefing-rivet tl" aria-hidden="true" />
          <span className="briefing-rivet tr" aria-hidden="true" />
          <span className="briefing-rivet bl" aria-hidden="true" />
          <span className="briefing-rivet br" aria-hidden="true" />
          <span className="classified-stamp reveal reveal-2" aria-hidden="true">Classified</span>

          <p className="briefing-eyebrow reveal reveal-1">CIEE Intelligence Division</p>
          <p className="briefing-tag reveal reveal-1">Eyes Only — Field Recruitment</p>

          <h1 className="briefing-title reveal reveal-2">
            SCAVENGER
            <br />
            HUNT
          </h1>

          <div className="briefing-illustration-wrap reveal reveal-3">
            <PosterIllustration />
          </div>

          <p className="briefing-tagline reveal reveal-4">Investigate · Decrypt · Report</p>

          <p className="briefing-note reveal reveal-4">
            Before your trip, you received a strange email — one sentence, no subject line:
            “You're the only one who can finish what Luna started.”
          </p>

          <button
            className="cmd-button primary reveal reveal-5"
            type="button"
            onClick={handleOpenMissionBoard}
          >
            Open Mission File
          </button>
        </div>
      </div>
    );
  }

  if (screen === "lunaDossier") {
    return (
      <div className="app intro-screen">
        <SoundToggle />
        {showBackButton && <BackButton onClick={handleBack} />}
        <div className="case-file reveal reveal-1">
          <span className="classified-stamp case-stamp reveal reveal-2" aria-hidden="true">Confidential</span>

          <div className="case-file-topline reveal reveal-1">
            <span>REF. LK-1998-0623</span>
            <span>ARCHIVE NO. 87-2211</span>
          </div>

          <div className="case-file-status reveal reveal-1">
            <div className="case-file-status-row">
              <span>STATUS</span>
              <strong>Missing in Action</strong>
            </div>
            <div className="case-file-status-row">
              <span>LAST KNOWN LOCATION</span>
              <strong>Seoul, South Korea</strong>
            </div>
            <div className="case-file-status-row">
              <span>CASE NO.</span>
              <strong>#LK-1998</strong>
            </div>
          </div>

          <hr className="case-file-rule" />

          <div className="mission-briefing your-assignment reveal reveal-2">
            <p className="mission-briefing-eyebrow">Your Role</p>
            <p className="mission-briefing-title">Your Assignment</p>
            <TypedLines
              text="You've been recruited as an agent to finish Luna's unfinished operation."
              lineClassName="mission-briefing-copy"
              stackClassName="typed-lines-stack"
            />
          </div>

          <hr className="case-file-rule" />

          <div className="subject-background reveal reveal-3">
            <div className="case-file-subject">
              <div>
                <p className="subject-eyebrow">Subject Background</p>
                <h2 className="case-file-title">Luna Shim</h2>
              </div>
              <div className="subject-photo">
                <SubjectPhoto />
              </div>
            </div>

            <div className="case-file-fields">
              <div className="case-file-field">
                <dt>Origin</dt>
                <dd>Korean-American</dd>
              </div>
              <div className="case-file-field">
                <dt>Born</dt>
                <dd>1998</dd>
              </div>
              <div className="case-file-field">
                <dt>Unit</dt>
                <dd>Allied Heritage Corps</dd>
              </div>
              <div className="case-file-field">
                <dt>Role</dt>
                <dd>Field Operative</dd>
              </div>
            </div>

            <TypedLines
              text="While serving in Korea, Luna learned her great-grandfather 'Kai' had fought in the Korean War. She began tracing his footsteps. With leaving documents behind, she disappeared on a mission."
              lineClassName="case-file-note"
              stackClassName="highlighted-note typed-lines-stack"
            />
          </div>

          <button
            className="cmd-button primary reveal reveal-5"
            type="button"
            onClick={handleContinueToMissionBoard}
          >
            Proceed to Mission File
          </button>
        </div>
      </div>
    );
  }

  if (screen === "home") {
    return (
      <div className="app mission-screen">
        <SoundToggle />
        {showBackButton && <BackButton onClick={handleBack} />}
        <HomeButton onClick={handleGoToIntro} />
        <header className="top-bar">
          <div className="top-bar-title-row">
            <span className="header-icon"><CompassIcon /></span>
            <div>
              <p className="app-eyebrow">CIEE Intelligence Division</p>
              <h1 className="app-title">Mission File</h1>
            </div>
          </div>
          <div className="clearance-badge">
            <span className="clearance-badge-label">Clearance Level</span>
            <strong>{finalRank.label}</strong>
          </div>
        </header>

        <main className="chapter-board">
          {chapterIds.map((chapterId) => {
            const chapter = chapterContent[chapterId];
            const completed = completedChapters.includes(chapterId);
            const started = Object.keys(chapterAnswers[chapterId] || {}).length > 0;
            const operationStatus = completed ? "Complete" : started ? "Active" : "Pending";
            const totalForChapter = chapter.segments.reduce((sum, segment) => sum + segment.questions.length, 0);
            const chapterCorrect = Object.values(chapterAnswers[chapterId] || {}).filter((entry) => entry?.status === "correct").length;

            return (
              <article key={chapterId} className={`chapter-card ${chapter.theme} ${completed ? "completed" : ""}`}>
                {completed && <span className="cleared-seal" aria-hidden="true">Cleared</span>}
                <div className="chapter-card-head">
                  <span className={`status-pill status-${operationStatus.toLowerCase()}`}>{operationStatus}</span>
                  <p className="chapter-codename">{chapter.codename}</p>
                </div>
                <h2 className="chapter-card-title">
                  <span className="header-icon inline"><DocumentIcon /></span>
                  {chapter.title}
                </h2>

                <dl className="dossier-fields">
                  <div className="dossier-field">
                    <dt>Threat Level</dt>
                    <dd>{chapter.threatLevel}</dd>
                  </div>
                  <div className="dossier-field">
                    <dt>Current Objective</dt>
                    <dd>{chapter.introCopy}</dd>
                  </div>
                  <div className="dossier-field">
                    <dt>Last Known Location</dt>
                    <dd>{chapter.lastKnownLocation}</dd>
                  </div>
                  <div className="dossier-field">
                    <dt>Evidence Collected</dt>
                    <dd>{chapterCorrect} / {totalForChapter}</dd>
                  </div>
                  <div className="dossier-field">
                    <dt>Operation Status</dt>
                    <dd>{operationStatus}</dd>
                  </div>
                </dl>

                <button className="cmd-button" type="button" onClick={() => handleStartChapter(chapterId)}>
                  {completed ? "Review Case File" : started ? "Resume Operation" : "Deploy"}
                </button>
              </article>
            );
          })}
        </main>
      </div>
    );
  }

  if (screen === "chapterIntro") {
    const chapter = chapterConfig;
    return (
      <div className="app intro-screen">
        <SoundToggle />
        {showBackButton && <BackButton onClick={handleBack} />}
        <div className={`intro-card chapter-dossier ${chapter?.theme || ""}`}>
          <p className="intro-eyebrow reveal reveal-1">{chapter?.subtitle}</p>
          <h1 className="intro-title reveal reveal-2">{chapter?.introTitle}</h1>
          <p className="intro-copy reveal reveal-3">{chapter?.introCopy}</p>
          <ImageFrame src={`${import.meta.env.BASE_URL}images/${chapter?.introImage}`} alt={chapter?.introTitle} className="chapter-intro-image reveal reveal-4" />
          <button className="cmd-button primary reveal reveal-5" type="button" onClick={handleEnterChapterStory}>
            Begin Operation
          </button>
        </div>
      </div>
    );
  }

  if (screen === "story") {
    return (
      <div className="app story-screen">
        <SoundToggle />
        {showBackButton && <BackButton onClick={handleBack} />}
        <StoryCard story={currentSegment.story} onContinue={handleContinueStory} theme={chapterConfig.theme} />
      </div>
    );
  }

  if (screen === "question") {
    return (
      <div className="app">
        <SoundToggle />
        {showBackButton && <BackButton onClick={handleBack} />}
        <header className="top-bar compact">
          <div>
            <p className="app-eyebrow">{chapterConfig.subtitle}</p>
            <h1 className="app-title">{chapterConfig.title}</h1>
          </div>
          <div className="clearance-badge compact">
            <span className="clearance-badge-label">Current Rank</span>
            <strong>{chapterRank.label}</strong>
          </div>
        </header>

        <main className="card-stage">
          {currentQuestion && (
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              state={chapterAnswers[activeChapter]?.[currentQuestion.id]}
              onSubmit={handleSubmitAnswer}
              onAdvance={handleAdvanceQuestion}
              theme={chapterConfig.theme}
              stampText={chapterConfig.stampText}
            />
          )}
        </main>
      </div>
    );
  }

  if (screen === "chapterComplete") {
    const chapter = chapterConfig;
    return (
      <div className="app finale-screen">
        <SoundToggle />
        {showBackButton && <BackButton onClick={handleBack} />}
        <div className="finale-card pop-in">
          <div className="finale-stamp">
            <div className="stamp-ring">
              <span className="stamp-text-top">Mission</span>
              <span className="stamp-icon">✦</span>
              <span className="stamp-text-bottom">Complete</span>
            </div>
          </div>
          <p className="finale-eyebrow">{chapter.subtitle}</p>
          <h1 className="finale-rank">{chapter.completionTitle}</h1>
          <p className="finale-copy">{chapter.completionCopy}</p>
          <p className="finale-copy secondary">{chapter.completionHint}</p>
          <p className="finale-score">
            Chapter rank: {chapterRank.label}
          </p>
          <button className="cmd-button primary" type="button" onClick={handleContinueAfterChapter}>
            {chapterIds.indexOf(activeChapter) + 1 < chapterIds.length ? "Continue to Next Mission" : "View Final Rank"}
          </button>
          <button className="cmd-button secondary" type="button" onClick={handleReset}>
            Return to Mission File
          </button>
        </div>
      </div>
    );
  }

  if (screen === "decrypting") {
    return (
      <div className="app decrypt-screen">
        <div className="decrypt-panel pop-in">
          <span className="decrypt-icon" aria-hidden="true">
            <DecryptIcon />
          </span>
          <p className="decrypt-title">
            {pendingUnlock?.type === "finale" ? "Compiling Final Debrief" : "Decrypting New Intelligence"}
          </p>
          <div className="decrypt-bar">
            <span className="decrypt-bar-fill" />
          </div>
        </div>
      </div>
    );
  }

  if (screen === "finale") {
    return (
      <div className="app finale-screen">
        <Confetti />
        <SoundToggle />
        {showBackButton && <BackButton onClick={handleBack} />}
        <div className="finale-card pop-in">
          <p className="finale-eyebrow">Mission complete</p>
          <div className="finale-stamp">
            <div className="stamp-ring big">
              <span className="stamp-text-top">Final rank</span>
              <span className="stamp-icon">✦</span>
              <span className="stamp-text-bottom">{finalRank.label}</span>
            </div>
          </div>
          <h1 className="finale-rank">{finalRank.label}</h1>
          <p className="finale-copy">
            One trail, walked to the end. Luna's service and yours are complete.
          </p>
          <p className="finale-score">
            {combinedCorrectCount} / {questions.length} answers verified
          </p>

          <div className="agent-name-field">
            <label htmlFor="agent-name">Agent Name (for your certificate)</label>
            <input
              id="agent-name"
              className="agent-name-input"
              type="text"
              placeholder="Enter your name"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              autoComplete="off"
            />
          </div>

          <button className="cmd-button secondary" type="button" onClick={handleDownloadCertificate}>
            Download Certificate
          </button>
          <button className="cmd-button primary" type="button" onClick={handleReset}>
            Start New Operation
          </button>
        </div>
      </div>
    );
  }

  return null;
}
