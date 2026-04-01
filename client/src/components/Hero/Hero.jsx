import React from "react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import bg1 from './bg.png'

// ===================== DATA =====================

const slides = [
  {
    id: 1,
    badge: "Exclusive Offer",
    discount: "25% OFF",
    heading: "Play Your Music, Your Way",
    subtext: "Explore India's widest range of guitars, keyboards, drums & more at unbeatable prices.",
    cta: "Shop Now",
  },
  {
    id: 2,
    badge: "Limited Time Deal",
    discount: "20% OFF",
    heading: "Premium Instruments, Delivered Free",
    subtext: "Top brands like Fender, Yamaha & Roland — now with free shipping across India.",
    cta: "Explore Deals",
  },
  {
    id: 3,
    badge: "New Arrivals",
    discount: "15% OFF",
    heading: "Find Your Perfect Instrument",
    subtext: "From beginners to professionals — Hargun Musicals has the right instrument for every musician.",
    cta: "Browse Collection",
  },
];

// ===================== COMPONENT =====================

const Hero = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-6">
        <div className="container">
          <div className="grid grid-cols-12 gap-x-6 gap-y-6">
            <div className="lg:col-span-12 col-span-12 slider-height">
              <div style={{ height: "100%" }} className="relative">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay, EffectFade]}
                  slidesPerView={1}
                  loop={true}
                  speed={800}
                  effect="fade"
                  autoplay={{ delay: 7000 }}
                  pagination={{ clickable: true }}
                  navigation={{
                    nextEl: ".custom-next",
                    prevEl: ".custom-prev",
                  }}
                  className="home-five-hero-slider rounded-3xl relative md:bg-transparent bg-primary-darker sellzy-slider"
                  style={{ height: "100%" }}
                >
                  {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                      <div
                        style={{ backgroundImage: `url(${bg1})` }}
                        className="lg:p-0 p-8 pb-15 h-full bg-center bg-no-repeat bg-cover rounded-3xl xl:pl-[112px] lg:pl-[100px] flex items-center md:h-[600px] h-[500px]"
                      >
                        <div className="single-hero-slider-content">
                          <div className="flex items-center gap-x-2">
                            <h6 className="text-white">{slide.badge}</h6>
                            <span className="px-2 py-px text-black text-xs leading-[18px] bg-warning-light rounded-[100px]">
                              {slide.discount}
                            </span>
                          </div>
                          <h2 className="py-3 text-white">{slide.heading}</h2>
                          <p className="text-white mb-6">{slide.subtext}</p>
                          <a className="btn btn-primary text-white btn-large rounded-[60px] group py-2 pl-5 pr-3">
                            {slide.cta}
                          </a>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Nav Buttons */}
                <div className="home-five-hero-slider-nav absolute top-1/2 -translate-y-1/2 right-0 w-full flex justify-between px-6 z-10">
                  <button className="custom-prev bg-white p-3 rounded-full shadow">←</button>
                  <button className="custom-next bg-white p-3 rounded-full shadow">→</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;