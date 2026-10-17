import React from "react";
import {Audio, Img, staticFile} from "remotion";
import {cueAtFrame, DURATION_IN_FRAMES, FPS, TITLE} from "./data";
import {RenderScene} from "./Scene";
import "./styles.css";

export const LyricVideo: React.FC<{frame: number}> = ({frame}) => {
  const cue = cueAtFrame(frame);
  const elapsed = cue ? frame - cue.startFrame : 0;
  const fadeOut = cue ? Math.min(1, Math.max(0, (cue.endFrame - frame) / 12)) : 0;
  return (
    <div className="mv-stage mv-render">
      <Img className="cover-backdrop" src={staticFile("cover.png")} />
      <div className="cover-shade" />
      <RenderScene frame={frame} />
      <div className="vignette" />
      <header className="mv-heading"><span className="eyebrow">AI MUSIC · CREATIVE LEARNING</span><span className="heading-title">{TITLE}</span></header>
      {cue ? (
        <div className="lyric-wrap" style={{opacity: fadeOut}} aria-live="off">
          {Array.from(cue.text).map((glyph, index) => {
            const progress = Math.max(0, Math.min(1, (elapsed - index * 2) / 17));
            const eased = 1 - Math.pow(1 - progress, 3);
            return <span key={`${cue.start}-${index}`} className="glyph" style={{opacity: Math.min(1, progress * 1.8), transform: `translate3d(0, ${(1 - eased) * 75}px, ${(1 - eased) * 440}px) rotateX(${(1 - eased) * -36}deg)`, filter: `blur(${(1 - progress) * 7}px)`}}>{glyph === " " ? "\u00a0" : glyph}</span>;
          })}
        </div>
      ) : null}
      {!cue ? <div className="intro-title"><span>舟神課程</span><small>每一步，都向前</small></div> : null}
      <div className="bottom-mark"><span>舟神課程</span><i /><span>{String(Math.floor(frame / FPS / 60)).padStart(2, "0")}:{String(Math.floor((frame / FPS) % 60)).padStart(2, "0")}</span></div>
      <Audio src={staticFile("song.mp3")} />
    </div>
  );
};

export const COMPOSITION_FPS = FPS;
export const COMPOSITION_DURATION = DURATION_IN_FRAMES;
