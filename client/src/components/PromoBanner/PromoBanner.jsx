import React from "react";
import banner from './promo.png';

const PromoBanner = () => {
  return (
    <section className="pb-[70px]">
      <div className="container">
        <div
          style={{ backgroundImage: `url(${banner})` }}
          className="bg-black/20 bg-blend-overlay py-[120px] text-center bg-opacity-25 bg-center rounded-4xl wow animate__animated animate__fadeInUp"
          data-wow-delay=".2s"
        >
          <div
            className="md:w-[460px] w-full mx-auto wow animate__animated animate__fadeInUp"
            data-wow-delay=".3s"
          >
            <div>
              <p style={{color:"transparent",backgroundColor:'transparent'}} className="text-light-primary-text bg-warning-light py-1 px-3 inline-flex items-center rounded-full font-semibold">
                Deal of the day
              </p>
            </div>
            <h2 style={{color:"transparent",backgroundColor:'transparent'}} className="text-white pt-2.5 pb-6">
              Get up to 50% of on fresh shopping.
            </h2>
            <div className="home3-cta-section-countdown flex justify-between text-center pb-8 px-2.5 md:px-0 sellzy-countdown">
              <div>
                <h4 style={{color:"transparent",backgroundColor:'transparent'}} className="days bg-white rounded-full size-[70px] md:size-[100px] flex flex-col items-center justify-center">
                  00
                </h4>
                <p className="font-semibold pt-2" style={{color:"transparent",backgroundColor:'transparent'}}>Days</p>
              </div>
              <div>
                <h4 style={{color:"transparent",backgroundColor:'transparent'}} className="hours bg-white rounded-full size-[70px] md:size-[100px] flex flex-col items-center justify-center">
                  00
                </h4>
                <p style={{color:"transparent",backgroundColor:'transparent'}} className="font-semibold pt-2">Hours</p>
              </div>
              <div>
                <h4 style={{color:"transparent",backgroundColor:'transparent'}} className="minutes bg-white rounded-full size-[70px] md:size-[100px] flex flex-col items-center justify-center">
                  00
                </h4>
                <p style={{color:"transparent",backgroundColor:'transparent'}} className="font-semibold pt-2">Min</p>
              </div>
              <div>
                <h4 style={{color:"transparent",backgroundColor:'transparent'}} className="seconds bg-white rounded-full size-[70px] md:size-[100px] flex flex-col items-center justify-center">
                  00
                </h4>
                <p style={{color:"transparent",backgroundColor:'transparent'}} className="font-semibold pt-2">Sec</p>
              </div>
            </div>
            <a
            style={{color:"transparent",backgroundColor:'transparent'}}
              className="btn btn-primary btn-large rounded-[60px] group py-2 pl-5 pr-3"
              href="/product-detail"
            >
              Order Today
              <span style={{color:"transparent",backgroundColor:'transparent'}} className="size-8 bg-white inline-flex items-center justify-center rounded-full rotate-[-40deg] transform group-hover:rotate-0 transition-all duration-300">
                <i style={{color:"transparent"}} className="hgi hgi-stroke hgi-arrow-right-02 text-xl text-primary-darker"></i>
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
