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
  hackathons: HackathonCardProps[] | null;
}

const HackathonsCarousel = ({ hackathons }: HackathonsCarouselProps) => {
  return (
    <Carousel
      plugins={[
        AutoPlay({
          //   delay: 2000,
          stopOnFocusIn: true,
        }),
      ]}
      opts={{ loop: true, align: "center" }}
      className="ml-10 mt-4 h-72 w-full max-w-6xl"
    >
      <CarouselContent className="ml-20 h-72">
        {hackathons &&
          hackathons?.map((hackathon) => (
            <CarouselItem
              key={hackathon.id}
              className="-pl-10 md:basis-1/2 lg:basis-1/3"
            >
              <HackathonCard
                id={hackathon.id}
                title={hackathon.title}
                start_date={hackathon.start_date}
                photo={hackathon.photo}
              />
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious className="-left-12" />
      <CarouselNext />
    </Carousel>
  );
};

export default HackathonsCarousel;
