'use client';

import { useState } from 'react';
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
    const reviews = [
      {
        initials: 'CI',
        name: 'Cinnamon Indian Restaurant',
        meta: 'IM • 1 review • May 29, 2026',
        title: 'We love working with these guys!',
        body: 'We love working with these guys, they’ve helped us so much with our menus our website and done a few photoshoots for us! Whenever we’ve had issues, they’ve always come running to help us. 5 Stars!',
      },
      {
        initials: 'KC',
        name: 'Kayomi Carter',
        meta: 'GB • 3 reviews • May 29, 2026',
        title: 'I cannot recommend LYNKS highly enough',
        body: 'I cannot recommend LYNKS highly enough! From the very beginning, they took the time to understand my vision and transformed it into a brand and website that perfectly reflects what I wanted to achieve.\n\nThe team helped me develop my branding, ensuring it was professional, memorable, and truly represented my business. They then created a website that not only looks amazing but is also fully functional and tailored to all of my business needs. Every detail was considered, and nothing was too much trouble.\n\nThe customer service throughout the entire process was outstanding. The team was responsive, knowledgeable, supportive, and always willing to make adjustments to ensure everything was exactly right.\n\nSince working with LYNKS, my brand has gained much greater visibility, and I feel confident that my business now has a strong online presence that stands out from the crowd.\n\nThank you to the whole team for your hard work, creativity, and dedication. I am absolutely delighted with the results and would highly recommend LYNKS to anyone looking to elevate their brand and online presence.',
      },
      {
        initials: 'DL',
        name: 'Deborah Leece',
        meta: 'IM • 2 reviews • May 29, 2026',
        title: 'I can’t recommend these guys highly enough…',
        body: `I can’t recommend these guys highly enough. They have been absolutely amazing in helping me set up my coaching business, supporting me with everything from website and IT issues to marketing and all the countless little things that come with starting a business.\n\nTheir knowledge, patience, and willingness to go above and beyond have made such a difference. Nothing is ever too much trouble, and they always find a solution while making everything easy to understand.\n\nNot only are they incredibly skilled, but they’re also genuinely supportive and invested in helping others succeed. I’m so grateful for all their help and would highly recommend them to anyone looking for someone reliable, knowledgeable, and a pleasure to work with.`,
      },
    ];

    function truncateWords(text: string, maxWords: number) {
      const words = text.trim().split(/\s+/);
      if (words.length <= maxWords) return text;
      return words.slice(0, maxWords).join(' ') + '...';
    }

    function ReviewCard({ review }: { review: typeof reviews[number] }) {
      const [expanded, setExpanded] = useState(false);
      const wordCount = review.body.trim().split(/\s+/).length;
      const isLong = wordCount > 30;
      const displayText = expanded || !isLong ? review.body : truncateWords(review.body, 30);

      return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-lg flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-sm">
              {review.initials}
            </div>
            <div>
              <h3 className="text-white font-semibold">{review.name}</h3>
              <p className="text-sm text-gray-400">{review.meta}</p>
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
            {review.title}
          </h4>

          <p className="text-gray-300 leading-relaxed whitespace-pre-line flex-grow">
            {displayText}
          </p>

          {isLong && (
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="mt-4 text-left text-[#dbf72c] font-medium hover:underline focus:outline-none"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>

        <p className="text-center text-sm mt-8">
          <a
            href="https://www.trustpilot.com/review/wearelynks.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#dbf72c] hover:underline font-medium"
          >
            View on Trustpilot
          </a>
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
