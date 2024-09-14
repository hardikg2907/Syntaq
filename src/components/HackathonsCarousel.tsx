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
import { Skeleton } from "./ui/skeleton";

interface HackathonsCarouselProps {
  hackathons: HackathonCardProps[] | null;
  isLoading: boolean;
}

const HackathonsCarousel = ({
  hackathons,
  isLoading,
}: HackathonsCarouselProps) => {
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
        {isLoading ? (
          <>
            {[...Array(3)].map((a, i) => (
              <CarouselItem
                key={i}
                className="-pl-10 md:basis-1/2 lg:basis-1/3"
              >
                <Skeleton className="h-60 w-[250px] rounded-xl border border-gray-300 bg-gray-50 shadow-md shadow-gray-900 dark:border-0 dark:bg-gray-900/40" />
              </CarouselItem>
            ))}
          </>
        ) : (
          <>
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
          </>
        )}
      </CarouselContent>
      <CarouselPrevious className="-left-12" />
      <CarouselNext />
    </Carousel>
  );
};

export default HackathonsCarousel;
