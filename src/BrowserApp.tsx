import {useEffect, useRef, useState} from "react";
import {createRoot} from "react-dom/client";
import {BrowserScene} from "./Scene";
import {cueAtFrame, FPS, TITLE} from "./data";
import "./styles.css";

const BrowserApp = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [duration, setDuration] = useState(208.414);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update(); mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    let id = 0;
    const tick = () => {
      if (audioRef.current) setFrame(Math.floor(audioRef.current.currentTime * FPS));
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);
  const restart = async () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    try { await audioRef.current.play(); setPlaying(true); } catch { setPlaying(false); }
  };
  const toggle = async () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) { try { await audioRef.current.play(); setPlaying(true); } catch { setPlaying(false); } }
    else { audioRef.current.pause(); setPlaying(false); }
  };
  const cue = cueAtFrame(frame);
  const progress = duration ? frame / FPS / duration : 0;
  return <main className="browser-shell">
    <div className="mv-stage">
      <img className="cover-backdrop" src="/cover.png" />
      <div className="cover-shade" />
      <BrowserScene frame={frame} reduced={reduced} />
      <div className="vignette" />
      <header className="mv-heading"><span className="eyebrow">AI MUSIC · CREATIVE LEARNING</span><span className="heading-title">{TITLE}</span></header>
      {cue ? <div className="lyric-wrap" aria-live="off">
        {Array.from(cue.text).map((glyph, index) => {
          const elapsed = frame - cue.startFrame;
          const progressGlyph = reduced ? 1 : Math.max(0, Math.min(1, (elapsed - index * 2) / 17));
          const eased = 1 - Math.pow(1 - progressGlyph, 3);
          return <span key={`${cue.start}-${index}`} className="glyph" style={{opacity: Math.min(1, progressGlyph * 1.8), transform: `translate3d(0, ${(1 - eased) * 75}px, ${(1 - eased) * 440}px) rotateX(${(1 - eased) * -36}deg)`, filter: `blur(${(1 - progressGlyph) * 7}px)`}}>{glyph === " " ? "\u00a0" : glyph}</span>;
        })}
      </div> : <div className="intro-title"><span>舟神課程</span><small>每一步，都向前</small></div>}
      <div className="bottom-mark"><span>舟神課程</span><i /><span>{String(Math.floor(frame / FPS / 60)).padStart(2, "0")}:{String(Math.floor((frame / FPS) % 60)).padStart(2, "0")}</span></div>
    </div>
    <section className="player-controls" aria-label="影片控制">
      <audio ref={audioRef} src="/song.mp3" preload="metadata" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)} onEnded={() => setPlaying(false)} />
      <button className="play-button" onClick={toggle} aria-label={playing ? "暫停" : "播放"}>{playing ? "Ⅱ" : "▶"}</button>
      <button className="restart-button" onClick={restart}>重新播放</button>
      <input aria-label="播放進度" type="range" min="0" max="1" step="0.0001" value={progress} onChange={(e) => { if (audioRef.current) { audioRef.current.currentTime = Number(e.target.value) * duration; setFrame(Math.floor(audioRef.current.currentTime * FPS)); } }} />
      <span className="player-time">{String(Math.floor(frame / FPS / 60)).padStart(2, "0")}:{String(Math.floor((frame / FPS) % 60)).padStart(2, "0")}</span>
      <span className="motion-note">{reduced ? "已減少動態" : "支援系統減少動態設定"}</span>
    </section>
  </main>;
};

createRoot(document.getElementById("root")!).render(<BrowserApp />);
