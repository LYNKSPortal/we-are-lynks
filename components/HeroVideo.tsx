'use client';

import MuxPlayer from '@mux/mux-player-react';
import type { MuxPlayerCSSProperties } from '@mux/mux-player-react';

const style: MuxPlayerCSSProperties = {
  width: '100%',
  height: '100%',
  '--controls': 'none',
  '--media-object-fit': 'cover',
  pointerEvents: 'none',
};

export default function HeroVideo({ playbackId }: { playbackId: string }) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      streamType="on-demand"
      autoPlay="muted"
      muted
      loop
      playsInline
      disableTracking
      style={style}
    />
  );
}
