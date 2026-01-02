'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/database';

interface ProductSliderProps {
  products: Product[];
  autoSlide?: boolean;
  slideInterval?: number;
}

export function ProductSlider({ products, autoSlide = true, slideInterval = 5000 }: ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoSlide || products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, slideInterval);

    return () => clearInterval(interval);
  }, [products.length, autoSlide, slideInterval]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  if (products.length === 0) {
    return null;
  }

  const currentProduct = products[currentIndex];

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900" />
      
      <img
        src={currentProduct.image_url || 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=1200'}
        alt={currentProduct.name}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-70"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-green-900/40 to-transparent" />

      <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16">
        <div className="text-center text-white max-w-2xl sm:max-w-3xl">
          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 drop-shadow-2xl animate-gradient">
            {currentProduct.name}
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-gray-100 mb-4 sm:mb-6 line-clamp-2 drop-shadow-lg">
            {currentProduct.description}
          </p>
          <div className="inline-block bg-gradient-to-r from-green-500/30 to-emerald-500/30 backdrop-blur-md rounded-full px-4 sm:px-6 md:px-8 py-2 sm:py-3 border-2 border-white/20 shadow-xl">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
              ${currentProduct.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-green-600/30 to-emerald-600/30 hover:from-green-600/50 hover:to-emerald-600/50 backdrop-blur-md text-white rounded-full h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 transition-all border-2 border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl transform hover:scale-110"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-600/30 to-green-600/30 hover:from-emerald-600/50 hover:to-green-600/50 backdrop-blur-md text-white rounded-full h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 transition-all border-2 border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl transform hover:scale-110"
        onClick={goToNext}
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>

      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            className={`h-2.5 sm:h-3 rounded-full transition-all transform hover:scale-125 ${
              index === currentIndex 
                ? 'w-6 sm:w-8 bg-gradient-to-r from-green-400 to-emerald-400' 
                : 'w-2.5 sm:w-3 bg-white/30 hover:bg-white/50'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
