import HeroBackground from './HeroBackground';
import HeroContent from './HeroContent';
import HeroActions from './HeroActions';
import HeroDetails from './HeroDetails';
import SponsorPerformerSection from '../sponsor-perfomer/Sponsor-performer-section';
import EventParticipation from './EventParticipation';
import CardSection from './CardSection';
import FestiveSection from './festiveSection';
import ExperienceSection from './festiveSection';
import TicketSection from './TicketSection';
import Demo from './Demo';
import GallerySection from './GallerySection';
import Banner from '../donation/Banner';
import DonationBanner from './DonationBanner';
import BookingSection from './BookingSection';

function HeroSection({ user }) {
  return (
    <>
    <HeroContent />
    <CardSection/>
    <ExperienceSection/>
    <TicketSection/>
    <GallerySection/>
    <SponsorPerformerSection />
    <BookingSection user={user} />



      {/* Hero Section */}
      <section className="relative  flex items-center overflow-hidden">
        <HeroBackground />

        
      </section>

      {/* <HeroActions user={user} /> */}

      {/* <EventParticipation /> */}
                                      <DonationBanner/>

      {/* <HeroDetails /> */}
    </>
  );
}

export default HeroSection;