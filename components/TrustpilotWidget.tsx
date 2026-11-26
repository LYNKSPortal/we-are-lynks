'use client';

import { useState } from 'react';
import Image from 'next/image';
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
        initials: 'WS',
        name: 'Philip Littlejohns',
        meta: '(Western Swimming Pools)',
        title: 'Exceeded expectations',
        body: 'Understood our needs, delivered exactly what we were looking for and, in fact, exceeded expectations. Would highly recommend!',
      },
      {
        initials: 'KQ',
        name: 'Kevin Quirk',
        meta: '(AI Brdige Solutions)',
        title: 'Outstanding Experience from Start to Finish',
        body: 'Working with Lynks has been one of the best decisions we’ve made for our business. From the beginning, the team took the time to understand our goals, challenges, and vision, and they went above and beyond to support us every step of the way.\n\nTheir professionalism, communication, and dedication have been exceptional, and they have genuinely made a positive impact on our business growth and operations. Nothing ever felt like too much trouble, and their expertise and guidance gave us confidence throughout the process.\n\nIf you’re looking for a company that truly cares about its clients and delivers real value, I would highly recommend them. Thank you to the whole team for everything you’ve done for us.',
      },
      {
        initials: 'DL',
        name: 'Deborah Leece',
        meta: '(Coached By Debs)',
        title: 'I can’t recommend these guys highly enough…',
        body: `I can’t recommend these guys highly enough. They have been absolutely amazing in helping me set up my coaching business, supporting me with everything from website and IT issues to marketing and all the countless little things that come with starting a business.\n\nTheir knowledge, patience, and willingness to go above and beyond have made such a difference. Nothing is ever too much trouble, and they always find a solution while making everything easy to understand.\n\nNot only are they incredibly skilled, but they’re also genuinely supportive and invested in helping others succeed. I’m so grateful for all their help and would highly recommend them to anyone looking for someone reliable, knowledgeable, and a pleasure to work with.`,
      },
      {
        initials: 'CL',
        name: 'Christos Loizidies',
        meta: '(University of Chester)',
        title: 'Uni student stuck with coding',
        body: `I'm an Economics student in Chester and was really struggling with my Econometrics module. I had no idea which software to use, STATA or something else and honestly, the coding part scared me…\n\nA friend recommended that I look at “We Are LYNKS”. They were upfront that econometrics wasn't their normal field, and we both knew that going in. But they still went through with it and managed to help me anyway. They did their research and showed me why STATA was the right choice, walked me through the code step by step, as this was what was bothering me the most, and taught me how to actually understand my data and read the results, not just stare at numbers.\n\nThe biggest relief is that they helped me turn all that into actual assignments and presentations I felt confident about. It felt like a massive hurdle I couldn't overcome, they just helped me get past it. As I'm a Uni student, they were fair on pricing too!\n\nIf you're a student stuck with code, I would seriously reach out to We Are LYNKS for guidance.\n\nWould 100% recommend them, as they could have easily turned around and said, "This is not for us."\n\n5 Stars from me!`,
      },
      {
        initials: 'MF',
        name: 'Massimo Formby',
        meta: '(Dazzler)',
        title: 'The websites are cool',
        body: 'The websites are cool, clean and sleek and make things easier to handle for busy owners managing their online presence',
      },
      {
        initials: 'KC',
        name: 'Kayomi Carter',
        meta: '(House of Kayos)',
        title: 'I cannot recommend LYNKS highly enough',
        body: 'I cannot recommend LYNKS highly enough! From the very beginning, they took the time to understand my vision and transformed it into a brand and website that perfectly reflects what I wanted to achieve.\n\nThe team helped me develop my branding, ensuring it was professional, memorable, and truly represented my business. They then created a website that not only looks amazing but is also fully functional and tailored to all of my business needs. Every detail was considered, and nothing was too much trouble.\n\nThe customer service throughout the entire process was outstanding. The team was responsive, knowledgeable, supportive, and always willing to make adjustments to ensure everything was exactly right.\n\nSince working with LYNKS, my brand has gained much greater visibility, and I feel confident that my business now has a strong online presence that stands out from the crowd.\n\nThank you to the whole team for your hard work, creativity, and dedication. I am absolutely delighted with the results and would highly recommend LYNKS to anyone looking to elevate their brand and online presence.',
      },
      {
        initials: 'NY',
        name: 'Nadeem Younus',
        meta: '(Cinnamon Indian Restaurant)',
        title: 'We love working with these guys!',
        body: 'We love working with these guys, they’ve helped us so much with our menus our website and done a few photoshoots for us! Whenever we’ve had issues, they’ve always come running to help us. 5 Stars!',
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
              {review.meta && <p className="text-sm text-gray-400">{review.meta}</p>}
            </div>
          </div>

          <div className="flex items-center gap-1 mb-3" aria-label="Rated 5 out of 5 stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-[#dbf72c] text-[#dbf72c]"
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>

        <div className="text-center mt-8 flex flex-col items-center">
          <a
            href="https://www.trustpilot.com/review/wearelynks.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#dbf72c] hover:underline font-medium text-sm"
          >
            View On
          </a>
          <Image
            src="/trust-pilot-neon-logo.png"
            alt="Trustpilot"
            width={1000}
            height={246}
            className="w-[200px] h-auto opacity-80"
          />
        </div>
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
