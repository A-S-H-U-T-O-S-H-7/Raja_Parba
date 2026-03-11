"use client";

import { Share2 } from "lucide-react";
import { toast } from "react-hot-toast";

const SHARE_TITLE = "Raja Parba 2026";
const SHARE_TEXT =
  "Come celebrate 🎉 the joy, colour, culture, and warmth of Odisha Raja Parba 2026 with us. 🌸 Cultural shows, free passes, festive moments, and beautiful memories are waiting for you. ✨ \n\nJoin us : https://rajaparba.svsamiti.com/";

export default function FloatingShareButton() {
  const shareMessage = SHARE_TEXT;

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: SHARE_TITLE,
          text: SHARE_TEXT,
        });
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareMessage);
        toast.success("Share text copied");
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share"
      className="fixed bottom-6 right-4 z-[70] inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(244,114,182,0.35)] transition-all duration-200 hover:scale-105 sm:bottom-8 sm:right-6"
    >
      <Share2 className="h-4 w-4" />
      <span>Share</span>
    </button>
  );
}
