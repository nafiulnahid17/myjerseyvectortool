import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JerseyOS',
    short_name: 'JerseyOS',
    description: 'AI-Powered Full Operating System for Jersey Production',
    start_url: '/',
    display: 'standalone',
    background_color: '#020812',
    theme_color: '#020812',
    icons: [
      {
        src: '/brand/jerseyos-logo.png',
        sizes: '1254x1254',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
