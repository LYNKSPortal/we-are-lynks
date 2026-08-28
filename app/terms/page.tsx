import { Construction } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0c0f17] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#dbf72c]/10 mb-6">
          <Construction className="text-[#dbf72c]" size={40} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Terms & Conditions
        </h1>
        <p className="text-xl text-gray-400">
          We&apos;re currently updating this page. Please check back soon.
        </p>
      </div>
    </div>
  );
}
