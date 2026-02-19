import GalleryHeroSection from "./Galleryherosection";
import GalleryGridSection from "./Gallerygridsection";


export const metadata = {
  title: "Gallery — Raja Mahotsav 2026",
  description:
    "Photographs from Raja Mahotsav — the colours, the joy, the sacred moments of Odisha's most beloved festival celebrated in Delhi NCR.",
};

export default function GalleryPage() {
  return (
    <main>
      <GalleryHeroSection />
      <GalleryGridSection />
    </main>
  );
}