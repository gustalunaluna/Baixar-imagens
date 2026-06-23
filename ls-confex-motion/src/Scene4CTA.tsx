import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, Img } from 'remotion'
import { loadFont as loadBarlowCondensed } from '@remotion/google-fonts/BarlowCondensed'
import { loadFont as loadBarlow } from '@remotion/google-fonts/Barlow'

const { fontFamily: condensed } = loadBarlowCondensed('normal', { weights: ['700', '900'], subsets: ['latin'] })
const { fontFamily: barlow } = loadBarlow('normal', { weights: ['400', '500', '600'], subsets: ['latin'] })

export const Scene4CTA: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Background image
  const bgOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })

  // Logo
  const logoOpacity = interpolate(frame, [fps * 0.3, fps * 0.9], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })
  const logoY = interpolate(frame, [fps * 0.3, fps * 0.9], [-30, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })

  // Tagline
  const tagOpacity = interpolate(frame, [fps * 0.6, fps * 1.2], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })

  // CTA button
  const btnScale = interpolate(frame, [fps * 1, fps * 1.5], [0.7, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.34, 1.56, 0.64, 1), // overshoot spring feel
  })
  const btnOpacity = interpolate(frame, [fps * 1, fps * 1.4], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })

  // Button shine sweep
  const sweep = interpolate(
    frame,
    [fps * 1.5, fps * 2.2, fps * 2.5, fps * 10],
    [-300, 700, 700, 700],
    { extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1) }
  )

  // Pulsing glow
  const glow = 0.4 + 0.3 * Math.sin((frame / fps) * Math.PI * 2)

  return (
    <AbsoluteFill style={{
      background: '#080808',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      {/* Background product collage - blurred */}
      <AbsoluteFill style={{ opacity: bgOpacity * 0.25 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', width: '100%', height: '100%' }}>
          {[
            'https://lsconfex.com.br/imagens/produto-pochete-tatica.webp',
            'https://lsconfex.com.br/imagens/destaque-mochila-esportiva.jpg',
            'https://lsconfex.com.br/imagens/destaque-crossbody-puffer.jpeg',
            'https://lsconfex.com.br/imagens/destaque-slingbag.webp',
          ].map((src, i) => (
            <Img key={i} src={src} style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(8px) brightness(0.3)',
            }} />
          ))}
        </div>
      </AbsoluteFill>

      {/* Dark center overlay */}
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center, rgba(8,8,8,0.6) 0%, rgba(8,8,8,0.92) 70%)',
      }} />

      {/* Content */}
      <div style={{
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 40,
        padding: '0 80px',
      }}>
        {/* Logo */}
        <div style={{
          opacity: logoOpacity,
          translate: `0px ${logoY}px`,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: condensed,
            fontSize: 120,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: -3,
            lineHeight: 1,
            textTransform: 'uppercase',
          }}>
            LS <span style={{ color: '#e8ff00' }}>CONFEX</span>
          </div>
          <div style={{
            width: 100,
            height: 3,
            background: '#e8ff00',
            margin: '16px auto 0',
          }} />
        </div>

        {/* Tagline */}
        <div style={{
          opacity: tagOpacity,
          fontFamily: barlow,
          fontSize: 38,
          fontWeight: 500,
          color: '#bbbbbb',
          letterSpacing: 3,
          textAlign: 'center',
          textTransform: 'uppercase',
        }}>
          Produtos que representam
          <br />
          <span style={{ color: '#ffffff', fontWeight: 600 }}>sua marca.</span>
        </div>

        {/* CTA Button */}
        <div style={{
          opacity: btnOpacity,
          scale: String(btnScale),
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Glow behind button */}
          <div style={{
            position: 'absolute',
            inset: -12,
            background: '#e8ff00',
            opacity: glow * 0.25,
            filter: 'blur(24px)',
            borderRadius: 8,
          }} />

          <div style={{
            position: 'relative',
            background: '#e8ff00',
            paddingLeft: 72,
            paddingRight: 72,
            paddingTop: 32,
            paddingBottom: 32,
            overflow: 'hidden',
          }}>
            <div style={{
              fontFamily: condensed,
              fontSize: 52,
              fontWeight: 900,
              color: '#080808',
              letterSpacing: 4,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              SOLICITE SEU ORÇAMENTO
            </div>

            {/* Shine sweep */}
            <div style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: sweep,
              width: 100,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
              pointerEvents: 'none',
            }} />
          </div>
        </div>

        {/* Contact */}
        <div style={{
          opacity: tagOpacity,
          fontFamily: barlow,
          fontSize: 34,
          fontWeight: 400,
          color: '#666',
          letterSpacing: 2,
          textAlign: 'center',
        }}>
          lsconfex.com.br
        </div>
      </div>
    </AbsoluteFill>
  )
}
