import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Img } from 'remotion'
import { loadFont as loadBarlowCondensed } from '@remotion/google-fonts/BarlowCondensed'
import { loadFont as loadBarlow } from '@remotion/google-fonts/Barlow'

const { fontFamily: condensed } = loadBarlowCondensed('normal', { weights: ['700', '900'], subsets: ['latin'] })
const { fontFamily: barlow } = loadBarlow('normal', { weights: ['400', '500'], subsets: ['latin'] })

const PRODUCTS = [
  { src: 'https://lsconfex.com.br/imagens/categoria-ecobag.jpeg', label: 'ECO BAGS' },
  { src: 'https://lsconfex.com.br/imagens/brinde-mochila-executiva.jpeg', label: 'MOCHILAS' },
  { src: 'https://lsconfex.com.br/imagens/destaque-crossbody-puffer.jpeg', label: 'BOLSAS' },
  { src: 'https://lsconfex.com.br/imagens/produto-pochete-tatica.webp', label: 'POCHETES' },
]

const ProductCard: React.FC<{ src: string; label: string; delay: number }> = ({ src, label, delay }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const opacity = interpolate(frame, [delay, delay + fps * 0.5], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })
  const scale = interpolate(frame, [delay, delay + fps * 0.6], [0.88, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })
  const y = interpolate(frame, [delay, delay + fps * 0.6], [60, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })

  // Subtle rotation oscillation
  const rotate = interpolate(frame, [0, fps * 5], [0, 360], {
    extrapolateRight: 'clamp',
  })

  return (
    <div style={{
      opacity,
      scale: String(scale),
      translate: `0px ${y}px`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
    }}>
      <div style={{
        width: 420,
        height: 420,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid rgba(232,255,0,0.2)',
      }}>
        <Img
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            scale: `${1 + Math.sin((rotate / 360) * Math.PI * 2) * 0.02}`,
          }}
        />
        {/* Shine overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)',
        }} />
      </div>
      <div style={{
        fontFamily: condensed,
        fontSize: 40,
        fontWeight: 700,
        color: '#e8ff00',
        letterSpacing: 4,
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
    </div>
  )
}

export const Scene3Produtos: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleOpacity = interpolate(frame, [0, fps * 0.6], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })
  const titleY = interpolate(frame, [0, fps * 0.7], [-40, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })

  // Horizontal scroll through products
  const scrollX = interpolate(frame, [fps * 0.5, fps * 4.5], [0, -(420 + 40) * 3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  })

  return (
    <AbsoluteFill style={{
      background: '#0a0a0a',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingTop: 120,
    }}>
      {/* Background grid pattern */}
      <AbsoluteFill style={{
        backgroundImage: 'linear-gradient(rgba(232,255,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(232,255,0,0.04) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      {/* Title */}
      <div style={{
        opacity: titleOpacity,
        translate: `0px ${titleY}px`,
        textAlign: 'center',
        zIndex: 2,
        marginBottom: 60,
      }}>
        <div style={{
          fontFamily: barlow,
          fontSize: 32,
          color: '#e8ff00',
          letterSpacing: 8,
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>
          DO CONCEITO
        </div>
        <div style={{
          fontFamily: condensed,
          fontSize: 100,
          fontWeight: 900,
          color: '#ffffff',
          lineHeight: 0.9,
          textTransform: 'uppercase',
          letterSpacing: -2,
        }}>
          À FABRICAÇÃO
        </div>
      </div>

      {/* Scrolling products strip */}
      <div style={{
        overflow: 'hidden',
        width: 1080,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          gap: 40,
          paddingLeft: 100,
          translate: `${scrollX}px 0px`,
          transition: 'none',
          willChange: 'transform',
        }}>
          {PRODUCTS.map((p, i) => (
            <ProductCard key={i} src={p.src} label={p.label} delay={i * fps * 0.3} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  )
}
