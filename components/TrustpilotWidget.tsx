'use client';

import Script from 'next/script';
import { Star } from 'lucide-react';

interface TrustpilotWidgetProps {
  businessUnitId?: string;
  templateId?: string;
  locale?: string;
  height?: string;
  theme?: 'light' | 'dark';
}

const DEFAULT_TEMPLATE_ID = '53aa8807dec1e10d38f539f1';

export default function TrustpilotWidget({
  businessUnitId,
  templateId = DEFAULT_TEMPLATE_ID,
  locale = 'en-GB',
  height = '500px',
  theme = 'dark',
}: TrustpilotWidgetProps) {
  if (!businessUnitId) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-sm">
              CI
            </div>
            <div>
              <h3 className="text-white font-semibold">Cinnamon Indian Restaurant</h3>
              <p className="text-sm text-gray-400">IM • 1 review • May 29, 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-3" aria-label="Rated 5 out of 5 stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-[#00b67a] text-[#00b67a]"
              />
            ))}
          </div>

          <h4 className="text-lg font-bold text-white mb-2">
            We love working with these guys!
          </h4>
          <p className="text-gray-300 leading-relaxed">
            We love working with these guys, they’ve helped us so much with our menus our website and done a few photoshoots for us! Whenever we’ve had issues, they’ve always come running to help us. 5 Stars!
          </p>

          <div className="mt-6 flex items-center gap-6 text-sm text-gray-400">
            <span>Useful</span>
            <span>Share</span>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Live Trustpilot feed will appear here once the Business Unit ID is configured.
        </p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
        strategy="lazyOnload"
      />
      <div
        className="trustpilot-widget"
        data-locale={locale}
        data-template-id={templateId}
        data-businessunit-id={businessUnitId}
        data-style-height={height}
        data-style-width="100%"
        data-theme={theme}
      >
        <a
          href="https://www.trustpilot.com/review/wearelynks.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Trustpilot
        </a>
      </div>
    </>
  );
}
