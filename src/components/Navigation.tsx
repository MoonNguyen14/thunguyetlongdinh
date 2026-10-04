import React from 'react';
import {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface NavigationProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'faq':
        return HelpCircle;
      case 'download':
        return Smartphone;
      case 'game':
        return Gamepad2;
      case 'savings':
        return PiggyBank;
      case 'loan':
        return Calculator;
      case 'products':
        return Sparkles;
      case 'branches':
        return MapPin;
      default:
        return HelpCircle;
    }
  };

  return (
    <div className="w-full bg-slate-900 text-white sticky top-20 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-none no-scrollbar">
          {contentData.navItems.map((item, idx) => {
            const Icon = getIcon(item.id);
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#005596] text-white shadow-sm ring-1 ring-sky-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-white/20' : 'bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span>
                  <span className="font-mono text-sky-400 mr-1 opacity-70">0{idx + 1}.</span>
                  {item.title}
                </span>
                {item.id === 'game' && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#ED1C24] text-white rounded-full animate-bounce">
                    Quà
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
