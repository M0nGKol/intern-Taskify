"use client";

import React, { useState } from "react";
import Image from "next/image";
import { testimonials } from "@/app/constants";
import { ChevronLeft, ChevronRight } from "lucide-react";

const cardsPerView = 3;

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const getVisibleCards = () => {
    // Loop back to start if overflow
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
      className="flex flex-col items-center text-center p-6 rounded-lg"
    >
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-8">
          What Our Users Say
        </h2>

        <div className="relative">
          <button
            onClick={goToPrev}
            className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-100"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {getVisibleCards().map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-all"
              >
                <Image
                  src={item.image}
                  width={64}
                  height={64}
                  alt={item.name}
                  className="rounded-full mb-2 object-cover object-center"
                />
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {item.title}
                </p>
                <p className="text-muted-foreground italic">"{item.quote}"</p>
              </div>
            ))}
          </div>

          <button
            onClick={goToNext}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow hover:bg-gray-100"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
