import { MyComposition } from "./Composition";
import { Composition } from "remotion";
import {DURATION_IN_FRAMES, FPS} from "./data";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ZhouShenLyricMV"
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        component={MyComposition}
      />
    </>
  );
};
