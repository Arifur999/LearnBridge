import Features from "./Home/Features";
import Hero from "./Home/Hero";

import PopularCourses from "./Home/PopularCourses";
import Stats from "./Home/Stats";
import TrainerCTA from "./Home/TrainerCTA";


export default function Page() {
  return (
    <>
      <Hero />
      <Stats />
      <Features/>
      <PopularCourses/>
      <TrainerCTA/>
  
   
    </>
  );
}
