import React from 'react';
import { Composition } from 'remotion';
import { FeaturesPromo } from './Composition';
import { featureItems } from '../src/content/features';

export const RemotionRoot: React.FC = () => {
  const introDuration = 60;
  const slideDuration = 90;
  const durationInFrames = introDuration + featureItems.length * slideDuration;

  return (
    <>
      <Composition
        id="FeaturesPromo"
        component={FeaturesPromo}
        durationInFrames={durationInFrames}
        fps={30}
        width={1280}
        height={720}
        defaultProps={{}}
      />
    </>
  );
};

