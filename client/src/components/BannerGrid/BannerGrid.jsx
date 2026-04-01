import React from "react";
import promo3 from './promobanner3.png'
import promo1 from './promobanner1.png'
import promo2 from './promobanner2.png'

const BannerGrid = () => {
  return (
    <section className="pb-[70px]">
      <div className="container">
        <div className="grid grid-cols-12 gap-6">
          <div
            className="col-span-12 xl:col-span-4 wow animate__animated animate__fadeInUp"
            data-wow-delay=".2s"
          >
            <div className="flex lg:flex-row xl:flex-col flex-col lg:gap-x-6 xl:gap-x-0 gap-y-6">
              <div style={{ backgroundImage: `url(${promo1})` }} className="w-full px-8 py-[78px] rounded-3xl bg-center bg-cover bg-no-repeat lg:w-1/2 xl:w-full">
                <div className="flex flex-col gap-y-[6px] justify-center">
                  <span style={{color:"transparent"}} className="text-light-primary-text w-fit inline-flex items-center justify-center px-[13px] py-1 rounded-full text-base leading-6 font-semibold">
                    Enjoy 20% savings
                  </span>

                  <h3 style={{color:"transparent"}} >Your Daily Store.</h3>
                  <p style={{color:"transparent"}} className="mb-2.5 text-light-primary-text">
                    Essentials, deals, and more.
                  </p>
                  <a
                  style={{color:"transparent",backgroundColor:'transparent'}} 
                    className="btn btn-primary text-white font-semibold btn-large gap-x-3 w-fit rounded-[60px] text-sm leading-[22px] group py-1.5 pl-4 pr-3"
                    href="/shop"
                  >
                    Shop Now
                    <span style={{color:"transparent",backgroundColor:'transparent'}} className="size-8 bg-white inline-flex items-center justify-center rounded-full rotate-[-40deg] transform group-hover:rotate-0 transition-all duration-300">
                      <i style={{color:"transparent",backgroundColor:'transparent'}} className="hgi hgi-stroke hgi-arrow-right-02 text-2xl leading-6 text-light-primary-text"></i>
                    </span>
                  </a>
                </div>
              </div>
              <div style={{ backgroundImage: `url(${promo2})` }} className="px-8 py-[78px] rounded-3xl bg-center bg-no-repeat bg-cover w-full lg:w-1/2 xl:w-full">
                <div className="flex flex-col gap-y-[6px] justify-center">
                  <span style={{color:"transparent",backgroundColor:'transparent'}} className="text-light-primary-text bg-warning-light w-fit inline-flex items-center justify-center px-[13px] py-1 rounded-full text-base leading-6 font-semibold">
                    Enjoy 20% savings
                  </span>

                  <h3 style={{color:"transparent"}}>Your Cart. Your Way.</h3>
                  <p style={{color:"transparent"}} className="mb-2.5 text-light-primary-text">
                    All your favorites, in one click.
                  </p>
                  <a
                  style={{color:"transparent",backgroundColor:'transparent'}}
                    className="btn btn-primary text-white font-semibold btn-large gap-x-3 w-fit rounded-[60px] text-sm leading-[22px] group py-1.5 pl-4 pr-3"
                    href="/shop"
                  >
                    Shop Now
                    <span style={{color:"transparent",backgroundColor:'transparent'}} className="size-8 bg-white inline-flex items-center justify-center rounded-full rotate-[-40deg] transform group-hover:rotate-0 transition-all duration-300">
                      {/* <i className="hgi hgi-stroke hgi-arrow-right-02 text-2xl leading-6 text-light-primary-text"></i> */}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div
            className="xl:col-span-8 col-span-12 wow animate__animated animate__fadeInUp"
            data-wow-delay=".3s"
          >
            <div className="max-h-[688px] xl:h-[688px] rounded-3xl">
              <img
                src={promo3}
                alt="Banana Yogurt"
                className="h-full w-full object-cover rounded-3xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerGrid;
