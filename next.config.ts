import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bgoagwkfmylovjpthcim.supabase.co',
        pathname: '/storage/v1/object/public/festival-posters/**',
      },
    ],
  },
};

export default nextConfig;
