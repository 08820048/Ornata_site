import { AbsoluteFill, Img, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { featureItems } from '../src/content/features';

const background = '#0b0b0d';
const surface = '#141417';
const text0 = '#f2f2f3';
const text1 = '#a5a6ab';

function Intro() {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(frame, [0, 20], [12, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background, justifyContent: 'center', padding: 80 }}>
      <div style={{ opacity, transform: `translateY(${translateY}px)` }}>
        <div style={{ fontSize: 18, letterSpacing: 2, textTransform: 'uppercase', color: text1 }}>
          Ornata
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05, color: text0, marginTop: 16 }}>
          Features
        </div>
        <div style={{ fontSize: 18, lineHeight: 1.6, color: text1, marginTop: 24, maxWidth: 820 }}>
          A lightweight Markdown editor for technical writing — fast, focused, and designed to stay out of your way.
        </div>
      </div>
    </AbsoluteFill>
  );
}

function FeatureSlide(props: { title: string; description: string; image: string; index: number }) {
  const frame = useCurrentFrame();

  const inStart = 0;
  const inEnd = 18;
  const outStart = 72;
  const outEnd = 90;

  const inProgress = interpolate(frame, [inStart, inEnd], [0, 1], { extrapolateRight: 'clamp' });
  const outProgress = interpolate(frame, [outStart, outEnd], [0, 1], { extrapolateLeft: 'clamp' });

  const opacity = interpolate(inProgress - outProgress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(inProgress, [0, 1], [18, 0], { extrapolateRight: 'clamp' });

  const accent = ['#f97316', '#22c55e', '#38bdf8', '#a78bfa', '#f43f5e'][props.index % 5];

  return (
    <AbsoluteFill style={{ background, padding: 64 }}>
      <div
        style={{
          display: 'flex',
          gap: 48,
          alignItems: 'center',
          height: '100%',
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 999,
              background: surface,
              border: `1px solid ${accent}33`,
              color: text1,
              fontSize: 14,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: accent,
                boxShadow: `0 0 0 6px ${accent}22`,
              }}
            />
            Feature {props.index + 1} / {featureItems.length}
          </div>
          <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.1, color: text0, marginTop: 22 }}>
            {props.title}
          </div>
          <div style={{ fontSize: 18, lineHeight: 1.7, color: text1, marginTop: 18, maxWidth: 560 }}>
            {props.description}
          </div>
        </div>

        <div
          style={{
            width: 520,
            height: 390,
            borderRadius: 22,
            background: surface,
            border: '1px solid rgba(255,255,255,0.06)',
            padding: 18,
            boxShadow: '0 30px 80px rgba(0,0,0,0.45)',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 16,
              overflow: 'hidden',
              background: '#0f0f12',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Img
              src={staticFile(props.image)}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

export function FeaturesPromo() {
  const introDuration = 60;
  const slideDuration = 90;

  return (
    <AbsoluteFill style={{ background }}>
      <Sequence from={0} durationInFrames={introDuration}>
        <Intro />
      </Sequence>
      {featureItems.map((item, idx) => (
        <Sequence
          key={item.title}
          from={introDuration + idx * slideDuration}
          durationInFrames={slideDuration}
        >
          <FeatureSlide title={item.title} description={item.description} image={item.image} index={idx} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

