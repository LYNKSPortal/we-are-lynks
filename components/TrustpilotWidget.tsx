'use client';

import Script from 'next/script';

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
      <div className="text-center p-8 border-2 border-dashed border-gray-700 rounded-2xl">
        <p className="text-gray-400 mb-2">
          Trustpilot reviews will appear here once the Business Unit ID is configured.
        </p>
        <a
          href="https://www.trustpilot.com/review/wearelynks.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#dbf72c] hover:underline font-medium"
        >
          See reviews on Trustpilot
        </a>
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
