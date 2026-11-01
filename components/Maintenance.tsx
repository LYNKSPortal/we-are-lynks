import { Construction } from 'lucide-react';

interface MaintenanceProps {
  title?: string;
  message?: string;
}

export default function Maintenance({
  title = 'Under Maintenance',
  message = "This will be back soon. We're just doing some much-needed updates for our Terms & Conditions and Privacy Policy pages.",
}: MaintenanceProps) {
  return (
    <div className="min-h-screen bg-[#0c0f17] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#dbf72c]/10 mb-6">
          <Construction className="text-[#dbf72c]" size={40} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h1>
        <p className="text-xl text-gray-400">
          {message}
        </p>
      </div>
    </div>
  );
}
