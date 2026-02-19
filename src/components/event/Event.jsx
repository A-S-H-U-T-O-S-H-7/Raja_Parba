import EventAttractionsSection from "./Eventattractionssection";
import EventHeroSection from "./EventHeroSection";
import EventScheduleSection from "./EventScheduleSection";
import EventVenueSection from "./Eventvenuesection";
import NabaKalebarSection from "./Nabakalebarsection";
import RajaKumariSection from "./Rajakumarisection";


export const metadata = {
  title: "Raja Mahotsav 2026 — Odisha Cultural Fest, Noida NCR",
  description:
    "Celebrate Raja Mahotsav 2026 at Ram Leela Ground, Noida. 3 days of Odia food, music, dance, Raja Doli, Raja Kumari competition, Nabakalebar film preview & more. Free Entry.",
};

export default function EventPage() {
  return (
    <main>
      <EventHeroSection />

      <EventScheduleSection />

      <EventAttractionsSection />

      <NabaKalebarSection />

      {/* <RajaKumariSection /> */}

      <EventVenueSection />
    </main>
  );
}