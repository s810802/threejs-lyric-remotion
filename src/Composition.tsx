import React from "react";
import {useCurrentFrame} from "remotion";
import {LyricVideo} from "./LyricVideo";

export const MyComposition: React.FC = () => <LyricVideo frame={useCurrentFrame()} />;
