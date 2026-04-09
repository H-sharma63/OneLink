'use client';

import { useEffect, useRef, useState } from 'react';
import type QRCodeStyling from 'qr-code-styling';
import type { Options } from 'qr-code-styling';

// We define the types manually to avoid strict issues if types aren't fully loaded
export type QRPreset = 'obsidian' | 'notion' | 'cherry-blossom';

interface QRCodeGeneratorProps {
  data: string;
  preset?: QRPreset;
  size?: number;
  canvasRef?: React.RefObject<HTMLDivElement>;
}

export const PRESETS: Record<QRPreset, Partial<Options>> = {
  obsidian: {
    dotsOptions: {
      color: '#6366f1',
      type: 'rounded',
    },
    backgroundOptions: {
      color: '#0a0a0a',
    },
    cornersSquareOptions: {
      color: '#a855f7',
      type: 'extra-rounded',
    },
    cornersDotOptions: {
      color: '#ec4899',
      type: 'dot',
    },
  },
  notion: {
    dotsOptions: {
      color: '#000000',
      type: 'square',
    },
    backgroundOptions: {
      color: '#ffffff',
    },
    cornersSquareOptions: {
      color: '#000000',
      type: 'square',
    },
    cornersDotOptions: {
      color: '#000000',
      type: 'square'
    }
  },
  'cherry-blossom': {
    dotsOptions: {
      color: '#ff69b4',
      type: 'classy',
    },
    backgroundOptions: {
      color: '#fff0f5',
    },
    cornersSquareOptions: {
      color: '#ff1493',
      type: 'dot',
    },
    cornersDotOptions: {
      color: '#ff69b4',
      type: 'dot',
    },
  },
};

export default function QRCodeGenerator({ 
  data, 
  preset = 'obsidian', 
  size = 300,
  canvasRef: externalRef 
}: QRCodeGeneratorProps) {
  const localRef = useRef<HTMLDivElement>(null);
  const containerRef = externalRef || localRef;
  const qrCodeInstance = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR errors
    const initQR = async () => {
      const { default: QRCodeStyling } = await import('qr-code-styling');
      
      const options: Options = {
        width: size,
        height: size,
        data: data,
        margin: 10,
        type: 'svg',
        ...PRESETS[preset],
      };

      if (!qrCodeInstance.current) {
        qrCodeInstance.current = new QRCodeStyling(options);
        if (containerRef.current) {
          qrCodeInstance.current.append(containerRef.current);
        }
      } else {
        qrCodeInstance.current.update(options);
      }
    };

    initQR();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        qrCodeInstance.current = null;
      }
    };
  }, [data, preset, size, containerRef]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-zinc-900/50 rounded-2xl border border-white/5">
      <div 
        ref={containerRef} 
        className="rounded-xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.02]"
      />
    </div>
  );
}
