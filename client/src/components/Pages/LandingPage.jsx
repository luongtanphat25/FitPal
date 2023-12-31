import React from "react";
import HeroImage from "../TitleCards/HeroImage";
import LandingCard from "../LandingCard";

import featureData from "../../mocks/featureData";

export default function LandingPage(){
  const features = featureData.map(data =>
    <LandingCard 
      key={data.id} 
      id={data.id}
      title={data.title} 
      description={data.description}
      image_source={data.image_source}
      image_left={data.image_left}
    />);

  return (
    <div>
      <HeroImage />
      
      {features}
    </div>
  )
}