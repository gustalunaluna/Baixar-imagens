import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Sequence, Img } from 'remotion'
import { loadFont as loadBarlowCondensed } from '@remotion/google-fonts/BarlowCondensed'
import { loadFont as loadBarlow } from '@remotion/google-fonts/Barlow'

const { fontFamily: condensed } = loadBarlowCondensed('normal', { weights: ['700', '900'], subsets: ['latin'] })
const { fontFamily: barlow } = loadBarlow('normal', { weights: ['400'], subsets: ['latin'] })

// Product images from the static site
const CLIPS = [
  'https://lsconfex.com.br/imagens/produto-pochete-tatica.webp',
  'https://lsconfex.com.br/imagens/produto-mochila-tricolor.jpeg',
  'https://lsconfex.com.br/imagens/produto-shoulder-bicolor.jpeg',
  'https://lsconfex.com.br/imagens/destaque-slingbag.webp',
]

const ClipFrame: React.FC<{ src: string; index: number; totalFrames: number }> = ({ src, index, totalFrames }) => {
  const frame = useCurrentFrame()

  const opacity = interpolate(frame, [0, 8, totalFrames - 8, totalFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })

  // Parallax/slow pan
  const direction = index % 2 === 0 ? 1 : -1
  const panX = interpolate(frame, [0, totalFrames], [0, direction * 40], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
  const scaleVal = interpolate(frame, [0, totalFrames], [1.12, 1.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{
        position: 'absolute',
        inset: -60,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Img
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            scale: String(scaleVal),
            translate: `${panX}px 0px`,
            filter: 'brightness(0.45) contrast(1.1)',
          }}
        />
      </div>
    </AbsoluteFill>
  )
}

export const Scene2Fabricacao: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const clipFrames = fps * 1  // 1s per clip at 30fps

  // Text animations
  const textOpacity = interpolate(frame, [fps * 0.5, fps * 1.2], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })
  const textY = interpolate(frame, [fps * 0.5, fps * 1.2], [40, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })

  const subOpacity = interpolate(frame, [fps * 1, fps * 1.8], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })

  return (
    <AbsoluteFill style={{ background: '#080808' }}>
      {/* Cycling clips */}
      {CLIPS.map((src, i) => (
        <Sequence key={i} from={i * clipFrames} durationInFrames={clipFrames * 1.5}>
          <ClipFrame src={src} index={i} totalFrames={clipFrames * 1.5} />
        </Sequence>
      ))}

      {/* Dark gradient overlay for text readability */}
      <AbsoluteFill style={{
        background: 'linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.3) 60%, rgba(8,8,8,0.7) 100%)',
      }} />

      {/* Side accent bar */}
      <div style={{
        position: 'absolute',
        left: 72,
        bottom: 220,
        width: 4,
        height: interpolate(frame, [fps * 0.3, fps * 0.9], [0, 160], {
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        background: '#e8ff00',
      }} />

      {/* Text block */}
      <div style={{
        position: 'absolute',
        left: 96,
        right: 72,
        bottom: 180,
        opacity: textOpacity,
        translate: `0px ${textY}px`,
      }}>
        <div style={{
          fontFamily: barlow,
          fontSize: 32,
          fontWeight: 400,
          color: '#e8ff00',
          letterSpacing: 6,
          textTransform: 'uppercase',
          marginBottom: 12,
          opacity: subOpacity,
        }}>
          FABRICAÇÃO PERSONALIZADA
        </div>
        <div style={{
          fontFamily: condensed,
          fontSize: 96,
          fontWeight: 900,
          color: '#ffffff',
          lineHeight: 0.95,
          textTransform: 'uppercase',
          letterSpacing: -1,
        }}>
          CRIAMOS{'\n'}ACESSÓRIOS
        </div>
        <div style={{
          fontFamily: condensed,
          fontSize: 96,
          fontWeight: 900,
          color: '#e8ff00',
          lineHeight: 0.95,
          textTransform: 'uppercase',
          letterSpacing: -1,
        }}>
          PERSONALIZADOS
        </div>
      </div>
    </AbsoluteFill>
  )
}
