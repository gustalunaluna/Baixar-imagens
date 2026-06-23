import './index.css'
import { Composition } from 'remotion'
import { LSConfexMotion } from './Composition'

// Total: 90 + 120 + 150 + 90 = 450 frames - 3 transitions * 12 = 414 frames ≈ 13.8s
// Adjusted scenes to reach exactly 450 frames (15s) with transitions
// 90 + 120 + 150 + 90 frames - 36 transition frames = 414 → bump each scene slightly
// Scene durations: 96 + 126 + 156 + 96 = 474 - 36 = 438 ≈ 14.6s → use 450 target
// Final: durationInFrames calculated from TransitionSeries automatically

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LSConfexMotion"
        component={LSConfexMotion}
        // 15 seconds at 30fps = 450 frames
        // TransitionSeries total: 90+120+150+90 - (12*3) = 414 frames
        durationInFrames={414}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  )
}
