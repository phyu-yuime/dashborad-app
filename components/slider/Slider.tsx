import React from "react";

const images = [
    "/images/sample1.jpg",
    "/images/sample2.jpg",
    "/images/sample3.jpg",
];

export default function CustomSlider() {
    const [currentSlide, setCurrentSlide] = React.useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    // Auto-play functionality
    React.useEffect(() => {
        const interval = setInterval(nextSlide, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full">
            <div className="relative bg-white overflow-hidden">
                {/* Main slider container */}
                <div className="relative h-96 overflow-hidden">
                    <div
                        className="flex transition-transform duration-500 ease-in-out h-full"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {images.map((src, idx) => (
                            <div key={idx} className="min-w-full h-full relative">
                                <img
                                    src={src}
                                    alt={`Slide ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                        ))}
                    </div>

                    {/* Navigation arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Dots indicator */}
                <div className="flex justify-center items-center py-6 bg-gradient-to-r from-gray-50 to-gray-100">
                    {images.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => goToSlide(idx)}
                            className={`mx-2 w-3 h-3 rounded-full transition-all duration-300 ${idx === currentSlide
                                ? 'bg-blue-500 scale-125 shadow-lg'
                                : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                        />
                    ))}
                </div>

                {/* Slide counter */}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {currentSlide + 1} / {images.length}
                </div>
            </div>

            {/* Title and description */}
            <div className="text-center mt-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Beautiful Image Gallery</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Explore our stunning collection of images with smooth transitions and elegant controls.
                </p>
            </div>
        </div>
    );
}