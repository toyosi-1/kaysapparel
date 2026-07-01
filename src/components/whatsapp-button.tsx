"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 1500);
    const tooltipTimer = setTimeout(() => {
      if (!tooltipDismissed) setShowTooltip(true);
    }, 3000);
    const hideTooltip = setTimeout(() => setShowTooltip(false), 8000);
    return () => {
      clearTimeout(timer);
      clearTimeout(tooltipTimer);
      clearTimeout(hideTooltip);
    };
  }, [tooltipDismissed]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-5 z-[100] flex flex-col items-end gap-2">
      {/* Tooltip bubble */}
      {showTooltip && !tooltipDismissed && (
        <div className="relative flex items-center gap-2 bg-white text-gray-800 text-xs font-medium px-4 py-2.5 rounded-2xl shadow-lg border border-gray-100 max-w-[200px] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span>Chat with us on WhatsApp!</span>
          <button
            onClick={() => { setShowTooltip(false); setTooltipDismissed(true); }}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="h-3 w-3" />
          </button>
          {/* Arrow */}
          <span className="absolute -bottom-1.5 right-5 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45" />
        </div>
      )}

      {/* Main button */}
      <a
        href="https://wa.me/2348136642570?text=Hi%20KaysApparel%2C%20I%20saw%20your%20website%20and%20I%27d%20like%20to%20enquire%20about%20your%20products."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="relative group flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] shadow-[0_4px_20px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_28px_rgba(37,211,102,0.6)] transition-all duration-300 hover:scale-110 active:scale-95"
      >
        {/* WhatsApp SVG */}
        <svg
          className="relative z-10 h-7 w-7"
          viewBox="0 0 360 362"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="white" fillRule="evenodd" d="M307.546 52.566C273.709 18.684 228.706.017 180.756 0 81.951 0 1.538 80.404 1.504 179.235c-.017 31.594 8.242 62.432 23.928 89.609L0 361.736l95.024-24.925c26.179 14.285 55.659 21.805 85.655 21.814h.077c98.788 0 179.21-80.413 179.244-179.244.017-47.898-18.608-92.926-52.454-126.807v-.008Zm-126.79 275.788h-.06c-26.73-.008-52.952-7.194-75.831-20.765l-5.44-3.231-56.391 14.791 15.05-54.981-3.542-5.638c-14.912-23.721-22.793-51.139-22.776-79.286.035-82.14 66.867-148.973 149.051-148.973 39.793.017 77.198 15.53 105.328 43.695 28.131 28.157 43.61 65.596 43.593 105.398-.035 82.149-66.867 148.982-148.982 148.982v.008Zm81.719-111.577c-4.478-2.243-26.497-13.073-30.606-14.568-4.108-1.496-7.09-2.243-10.073 2.243-2.982 4.487-11.568 14.577-14.181 17.559-2.613 2.991-5.226 3.361-9.704 1.117-4.477-2.243-18.908-6.97-36.02-22.226-13.313-11.878-22.304-26.54-24.916-31.027-2.613-4.486-.275-6.91 1.959-9.136 2.011-2.011 4.478-5.234 6.721-7.847 2.244-2.613 2.983-4.486 4.478-7.469 1.496-2.991.748-5.603-.369-7.847-1.118-2.243-10.073-24.289-13.812-33.253-3.636-8.732-7.331-7.546-10.073-7.692-2.613-.13-5.595-.155-8.586-.155-2.991 0-7.839 1.118-11.947 5.604-4.108 4.486-15.677 15.324-15.677 37.361s16.047 43.344 18.29 46.335c2.243 2.991 31.585 48.225 76.51 67.632 10.684 4.615 19.029 7.374 25.535 9.437 10.727 3.412 20.49 2.931 28.208 1.779 8.604-1.289 26.498-10.838 30.228-21.298 3.73-10.46 3.73-19.433 2.613-21.298-1.117-1.865-4.108-2.991-8.586-5.234Z" clipRule="evenodd"/>
        </svg>

        {/* Ping animation ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping" />
      </a>
    </div>
  );
}
