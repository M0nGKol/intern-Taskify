"use client";

import React, { useState } from "react";
import Image from "next/image";
import { testimonials } from "@/app/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

const cardsPerView = 3;

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalSlides = testimonials.length - cardsPerView + 1;

  const goToPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - cardsPerView : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev + cardsPerView >= testimonials.length
        ? 0
        : (prev + 1) % testimonials.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const getVisibleCards = () => {
    const visibleCards = [];
    for (let i = 0; i < cardsPerView; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visibleCards.push(testimonials[index]);
    }
    return visibleCards;
  };

  return (
    <section
      id="testimonials"
      className="flex flex-col items-center text-center rounded-lg"
    >
      <div className="container px-4 md:px-6 text-center">
        <h2>What Our Users Say</h2>

        <div className="relative">
          <button
            onClick={goToPrev}
            className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 p-2 text-white bg-[#113F67] rounded-full shadow"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 object-fit">
            {getVisibleCards().map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg border border-[#113F67] flex flex-col items-center text-center transition-all h-64 gap-4"
              >
                <div className="flex flex-col items-center">
                  <Image
                    src={item.image}
                    width={64}
                    height={64}
                    alt={item.name}
                    className="rounded-full mb-2 object-cover object-center"
                  />
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                </div>
                <p className="text-muted-foreground italic text-sm">
                  "{item.quote}"
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={goToNext}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 p-2 text-white bg-[#113F67] rounded-full shadow"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center space-x-2 mt-8">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "bg-[#113F67] scale-110"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
