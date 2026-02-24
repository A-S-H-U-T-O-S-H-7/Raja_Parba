import HeroBackground from './HeroBackground';
import HeroContent from './HeroContent';
import HeroActions from './HeroActions';
import SponsorPerformerSection from '../sponsor-perfomer/Sponsor-performer-section';
import CardSection from './CardSection';
import ExperienceSection from './festiveSection';
import TicketSection from './TicketSection';
import DonationBanner from './DonationBanner';
import BookingSection from './BookingSection';
import GallerySection from './GallerySection';

function HeroSection({ user }) {
  return (
    <>
    <HeroContent />
    <HeroActions user={user} />

    <CardSection/>
    <ExperienceSection/>
    <TicketSection/>
    <GallerySection/>
    {/* <SponsorPerformerSection /> */}
    <DonationBanner user={user}/>
    <BookingSection user={user} />



      
    </>
  );
}

export default HeroSection;