'use client';

import { useState } from 'react';

export default function FloatingConnect() {
  const [isExpanded, setIsExpanded] = useState(false);

  const contacts = [
    { name: 'WhatsApp', icon: '💬', link: 'https://wa.me/82', color: 'bg-green-500' },
    { name: 'WeChat', icon: '💭', link: '#', color: 'bg-green-600' },
    { name: 'Telegram', icon: '✈️', link: 'https://t.me/', color: 'bg-blue-500' },
    { name: 'KakaoTalk', icon: '💛', link: '#', color: 'bg-yellow-400' },
    { name: 'Email', icon: '📧', link: 'mailto:contact@goodmangls.com', color: 'bg-orange-500' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Menu */}
      {isExpanded && (
        <div className="absolute bottom-20 right-0 bg-white rounded-lg shadow-2xl p-4 w-64 animate-fade-in-up">
          <p className="text-sm font-semibold mb-3 text-gray-700">Connect With Us</p>
          <div className="space-y-2">
            {contacts.map((contact) => (
              <a
                key={contact.name}
                href={contact.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-2xl">{contact.icon}</span>
                <span className="font-medium text-gray-800">{contact.name}</span>
              </a>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
            Business Development Team
            <br />
            Available Mon-Fri 9:00-18:00 KST
          </div>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Contact us" className={`${
          isExpanded ? 'bg-gray-700' : 'bg-gradient-primary'
        } text-white rounded-full p-5 shadow-2xl motion-safe:hover:scale-110 transition-colors transition-transform duration-300 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#FF6B35]/50 focus-visible:outline-none`}
      >
        {isExpanded ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg className="w-6 h-6 motion-safe:animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
