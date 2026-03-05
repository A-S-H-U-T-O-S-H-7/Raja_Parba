"use client";

import { useMemo, useState } from "react";
import { Radio, Video } from "lucide-react";
import { Playfair_Display, Cinzel } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const VIDEO_LINKS = [
  "https://youtu.be/SmADJifjDJ0?si=pYBrkbXdLU82EArx",
  "https://youtu.be/HWF7iuU9BU8?si=IUcEgUxJz3bmzHy_",
  "https://youtu.be/SqfiB0mDkXQ?si=Cj-ytO4f7aw-Matd",
  "https://youtu.be/2FrVkhvrfDA?si=2y05eRT08mZADJtk",
  "https://www.youtube.com/live/mOlQ-hEJ-ZQ?si=1Nx4tsEEhrYudz-u",
  "https://www.youtube.com/live/GKUQDPZzJws?si=_PVp7wWwd7Wsv8Ze",
  "https://www.youtube.com/live/nJWZExWUb-c?si=y-V4Irf61ZstyytL",
  "https://youtube.com/shorts/tChXS16hhP8?si=A_1guIwxKv1MorWv",
  "https://youtube.com/shorts/Uk0EN8akTec?si=NIrZj6J5f99OHh0n",
  "https://youtu.be/wNZVx-0CC4A?si=q1CU2_i3C3EPjyCZ",
];

const extractYouTubeId = (rawUrl) => {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace("www.", "");
    const path = url.pathname;

    if (host === "youtu.be") {
      return path.slice(1).split("/")[0] || null;
    }

    if (host.includes("youtube.com")) {
      if (path.startsWith("/watch")) {
        return url.searchParams.get("v");
      }
      if (path.startsWith("/live/")) {
        return path.split("/")[2] || null;
      }
      if (path.startsWith("/shorts/")) {
        return path.split("/")[2] || null;
      }
      if (path.startsWith("/embed/")) {
        return path.split("/")[2] || null;
      }
    }
  } catch {
    return null;
  }

  return null;
};

const getType = (rawUrl) => {
  if (rawUrl.includes("/live/")) return "LIVE";
  if (rawUrl.includes("/shorts/")) return "SHORT";
  return "VIDEO";
};

export default function YouTubeVideosSection() {
  const videos = useMemo(
    () =>
      VIDEO_LINKS.map((url, index) => {
        const id = extractYouTubeId(url);
        return {
          id: id || `video-${index}`,
          youtubeId: id,
          type: getType(url),
          title: `Raja Parba Highlight ${index + 1}`,
        };
      }).filter((video) => Boolean(video.youtubeId)),
    []
  );

  const [activeVideoId, setActiveVideoId] = useState(videos[0]?.youtubeId || "");

  if (!videos.length) return null;

  const activeVideo = videos.find((video) => video.youtubeId === activeVideoId) || videos[0];
  const activeEmbedUrl = `https://www.youtube.com/embed/${activeVideo.youtubeId}?rel=0&modestbranding=1&playsinline=1`;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a120b] via-[#2a1a12] to-[#3a2114] px-4 py-8 md:px-6 md:py-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-10">
        <div className="h-full w-full bg-[linear-gradient(135deg,transparent_46%,rgba(251,146,60,0.55)_50%,transparent_54%),linear-gradient(-135deg,transparent_46%,rgba(251,191,36,0.5)_50%,transparent_54%)] bg-[length:46px_46px]" />
      </div>
      <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-amber-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -top-20 right-0 h-64 w-64 rounded-full bg-amber-400/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-5 text-center md:mb-6">
          <div>
            <h2 className={`${cinzel.className} text-2xl font-semibold tracking-wide text-amber-200 md:text-3xl`}>
              Raja Celebration in Motion
            </h2>
            <p className={`${playfair.className} mt-1 text-sm text-amber-100/85 md:text-base`}>
              Festival moments, live vibes, and timeless memories
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-amber-300/45 bg-black/25 p-2 shadow-xl md:p-3">
          <div className="h-60 overflow-hidden rounded-xl border border-amber-200/40 bg-black md:h-72">
            <iframe
              className="h-full w-full"
              src={activeEmbedUrl}
              title="Raja Parba YouTube video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:mt-5 md:grid-cols-5 md:gap-3">
          {videos.map((video) => {
            const isActive = video.youtubeId === activeVideo.youtubeId;
            const thumbnail = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;

            return (
              <button
                key={video.id}
                type="button"
                onClick={() => setActiveVideoId(video.youtubeId)}
                className={`group overflow-hidden rounded-xl border text-left transition ${
                  isActive
                    ? "border-amber-300 bg-amber-400/15 shadow-lg shadow-amber-700/25"
                    : "border-amber-200/40 bg-white/5 hover:border-amber-300/70"
                }`}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/15" />
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-white">
                    {video.type === "LIVE" ? <Radio className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                    {video.type}
                  </span>
                </div>
                <div className="px-2 py-2">
                  <p className="truncate text-xs font-semibold text-amber-100">{video.title}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
