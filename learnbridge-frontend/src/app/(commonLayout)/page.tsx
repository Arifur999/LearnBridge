export const dynamic = "force-dynamic";

import Hero from "./Home/Hero";
import StatsSection from "@/components/modules/home/StatsSection";
import GlobalVisionaries from "@/components/modules/home/GlobalVisionaries";
import FeaturedTutors from "@/components/modules/home/FeaturedTutors";
import LatestCourses from "@/components/modules/home/LatestCourses";
import WhyChooseUs from "@/components/modules/home/WhyChooseUs";
import HowItWorks from "@/components/modules/home/HowItWorks";
import Testimonials from "@/components/modules/home/Testimonials";
import TrustedPartners from "@/components/modules/home/TrustedPartners";
import FAQ from "@/components/modules/home/FAQ";
import CTA from "@/components/modules/home/CTA";

export default function Page() {
  return (
    <>
      <Hero />
      <GlobalVisionaries />
      <StatsSection />
      <FeaturedTutors />
      <LatestCourses />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <TrustedPartners />
      <FAQ />
      <CTA />
    </>
  );
}
