import cues from "./lyrics.json";

export type LyricCue = {start: number; end: number; text: string};
export const LYRIC_CUES = cues as LyricCue[];
export const FPS = 30;
export const DURATION_IN_FRAMES = 6253;
export const TITLE = "舟神課程";

export const cueAtFrame = (frame: number): (LyricCue & {startFrame: number; endFrame: number}) | undefined => {
  const seconds = frame / FPS;
  const cue = LYRIC_CUES.find((item) => seconds >= item.start && seconds < item.end);
  return cue ? {...cue, startFrame: Math.round(cue.start * FPS), endFrame: Math.round(cue.end * FPS)} : undefined;
};
