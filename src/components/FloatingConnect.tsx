'use client';

import { useState } from 'react';

export default function FloatingConnect() {
  const [isExpanded, setIsExpanded] = useState(false);

  const contacts = [
    { name: 'WhatsApp', icon: '💬', link: 'https://wa.me/82' },
    { name: 'WeChat', icon: '💭', link: '#' },
    { name: 'Telegram', icon: '✈️', link: 'https://t.me/' },
    { name: 'KakaoTalk', icon: '💛', link: '#' },
    { name: 'Email', icon: '📧', link: 'mailto:contact@goodmangls.com' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Menu */}
      {isExpanded && (
        <div className="absolute bottom-20 right-0 bg-canvas rounded-md shadow-[0_12px_48px_rgba(0,0,0,0.15)] p-6 w-72 animate-in fade-in slide-in-from-bottom-4 border border-hairline">
          <span className="eyebrow block mb-4 text-ink/40">Connect</span>
          <div className="space-y-1">
            {contacts.map((contact) => (
              <a
                key={contact.name}
                href={contact.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-md hover:bg-surface-soft transition-colors group"
              >
                <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{contact.icon}</span>
                <span className="body-default font-medium text-ink">{contact.name}</span>
              </a>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-hairline">
            <p className="body-sm text-ink/40">
              Business Development Team <br />
              Mon-Fri 9:00-18:00 KST
            </p>
          </div>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
          isExpanded ? 'bg-ink text-canvas rotate-90' : 'bg-ink text-canvas hover:scale-110'
        }`}
      >
        {isExpanded ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </div>
  );
}
