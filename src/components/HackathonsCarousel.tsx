"use client";
import HackathonCard, {
  type HackathonCardProps,
} from "~/components/HackathonCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import AutoPlay from "embla-carousel-autoplay";

interface HackathonsCarouselProps {
  hackathons: HackathonCardProps[];
}

const HackathonsCarousel = ({ hackathons }: HackathonsCarouselProps) => {
  return (
    <Carousel
      plugins={[
        AutoPlay({
          delay: 2000,
          stopOnFocusIn: true,
        }),
      ]}
      className="w-full max-w-xs"
    >
      <CarouselContent>
        {[...hackathons!, ...hackathons!]?.map((hackathon) => (
          <CarouselItem key={hackathon.id}>
            <HackathonCard
              id={hackathon.id}
              name={hackathon.name}
              startDate={hackathon.startDate}
              photo={hackathon.photo}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default HackathonsCarousel;
