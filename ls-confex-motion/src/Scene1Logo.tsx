import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion'
import { loadFont as loadBarlowCondensed } from '@remotion/google-fonts/BarlowCondensed'
import { loadFont as loadBarlow } from '@remotion/google-fonts/Barlow'

const { fontFamily: condensed } = loadBarlowCondensed('normal', { weights: ['700', '900'], subsets: ['latin'] })
const { fontFamily: barlow } = loadBarlow('normal', { weights: ['400', '500'], subsets: ['latin'] })

export const Scene1Logo: React.FC = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Logo fade + zoom
  const logoOpacity = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })
  const logoScale = interpolate(frame, [0, fps * 1], [0.85, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })

  // Light sweep across logo
  const sweep = interpolate(frame, [fps * 0.6, fps * 1.4], [-200, 600], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  })

  // Tagline appears after logo
  const tagOpacity = interpolate(frame, [fps * 1.2, fps * 2], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })
  const tagY = interpolate(frame, [fps * 1.2, fps * 2], [30, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })

  return (
    <AbsoluteFill style={{ background: '#080808', justifyContent: 'center', alignItems: 'center' }}>
      {/* Background grain */}
      <AbsoluteFill style={{
        background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #080808 70%)',
        opacity: 0.8,
      }} />

      {/* Accent lines */}
      <div style={{
        position: 'absolute',
        left: 80,
        right: 80,
        top: '50%',
        height: 1,
        background: 'linear-gradient(90deg, transparent, #e8ff00 50%, transparent)',
        opacity: logoOpacity * 0.3,
        transform: `translateY(-120px)`,
      }} />
      <div style={{
        position: 'absolute',
        left: 80,
        right: 80,
        top: '50%',
        height: 1,
        background: 'linear-gradient(90deg, transparent, #e8ff00 50%, transparent)',
        opacity: logoOpacity * 0.3,
        transform: `translateY(80px)`,
      }} />

      {/* Logo container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
        opacity: logoOpacity,
        scale: String(logoScale),
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Logo text */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{
            fontFamily: condensed,
            fontSize: 160,
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: -4,
            lineHeight: 1,
            textTransform: 'uppercase',
          }}>
            LS{' '}
            <span style={{ color: '#e8ff00' }}>CONFEX</span>
          </div>

          {/* Light sweep overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: sweep,
            width: 120,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Divider */}
        <div style={{
          width: 120,
          height: 3,
          background: '#e8ff00',
        }} />

        {/* Tagline */}
        <div style={{
          opacity: tagOpacity,
          translate: `0px ${tagY}px`,
          fontFamily: barlow,
          fontSize: 44,
          fontWeight: 500,
          color: '#cccccc',
          letterSpacing: 8,
          textTransform: 'uppercase',
          textAlign: 'center',
        }}>
          SUA MARCA MERECE
        </div>
        <div style={{
          opacity: tagOpacity,
          translate: `0px ${tagY}px`,
          fontFamily: condensed,
          fontSize: 72,
          fontWeight: 900,
          color: '#e8ff00',
          letterSpacing: 6,
          textTransform: 'uppercase',
          textAlign: 'center',
          marginTop: -20,
        }}>
          ALGO ÚNICO.
        </div>
      </div>
    </AbsoluteFill>
  )
}
