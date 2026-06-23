import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions'
import { fade } from '@remotion/transitions/fade'
import { wipe } from '@remotion/transitions/wipe'
import { slide } from '@remotion/transitions/slide'
import { Scene1Logo } from './Scene1Logo'
import { Scene2Fabricacao } from './Scene2Fabricacao'
import { Scene3Produtos } from './Scene3Produtos'
import { Scene4CTA } from './Scene4CTA'

const TRANSITION_FRAMES = 12

export const LSConfexMotion: React.FC = () => {
  return (
    <TransitionSeries>
      {/* CENA 1 — Logo (3s = 90f) */}
      <TransitionSeries.Sequence durationInFrames={90}>
        <Scene1Logo />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={wipe({ direction: 'from-right' })}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      {/* CENA 2 — Fabricação (4s = 120f) */}
      <TransitionSeries.Sequence durationInFrames={120}>
        <Scene2Fabricacao />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-bottom' })}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_FRAMES })}
      />

      {/* CENA 3 — Produtos (5s = 150f) */}
      <TransitionSeries.Sequence durationInFrames={150}>
        <Scene3Produtos />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />

      {/* CENA 4 — CTA (3s = 90f) */}
      <TransitionSeries.Sequence durationInFrames={90}>
        <Scene4CTA />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  )
}
