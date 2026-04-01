import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const testimonials = [
  {
    id: 1,
    name: "Arjun Mehta",
    date: "10:30AM, 5 Jan, 2025",
    avatar: "assets/images/vendors-list/vendor-profile.png",
    review:
      "Hargun Musicals delivered my Yamaha keyboard in perfect condition and ahead of schedule. The packaging was excellent and the instrument was exactly as described. Will definitely order again!",
  },
  {
    id: 2,
    name: "Priya Sharma",
    date: "02:15PM, 18 Feb, 2025",
    avatar: "assets/images/vendors-list/vendor-profile.png",
    review:
      "I bought my first acoustic guitar from Hargun Musicals. Their team helped me pick the right one for a beginner. The free shipping and easy return policy made it a completely stress-free experience.",
  },
  {
    id: 3,
    name: "Rajan Kapoor",
    date: "09:00AM, 3 Mar, 2025",
    avatar: "assets/images/vendors-list/vendor-profile.png",
    review:
      "Best musical instrument store online. Got my Roland electronic drum kit within 3 days. The quality is outstanding and the price was very competitive. Highly recommend Hargun Musicals!",
  },
];

const TestimonialHome = () => {
  return (
    <>
      {/* Testimonial Section */}
      <section className="pb-[70px]">
        <div className="lg:bg-white bg-[#A0E2E0] py-12 lg:pt-0 lg:pb-[23px] text-center lg:max-w-[704px] mx-auto lg:rounded-[164px] lg:-mb-[103px] relative z-10 lg:before:bg-[#A0E2E0] lg:after:bg-[#A0E2E0] lg:before:absolute lg:before:bottom-0 lg:before:left-0 lg:before:h-full lg:before:w-[145px] lg:before:bg-[url('../images/slider-left-shape.png')] lg:before:bg-no-repeat lg:before:z-11 lg:after:absolute lg:after:bottom-0 lg:after:right-0 lg:after:h-full lg:after:w-[145px] lg:after:bg-[url('../images/slider-right-shape.png')] lg:after:bg-no-repeat lg:after:z-11">
          <h3 className="mb-2">Trusted by Customers</h3>
          <p>Join thousands of happy musicians around the world</p>
        </div>

        <div className="xl:max-w-[1728px] w-full mx-auto relative bg-[#A0E2E0] xl:rounded-5xl pb-[70px] lg:pt-[172px]">
          <div className="container">
            <div className="about-us-testimonial-wrapper grid grid-cols-12">
              <div className="col-start-2 col-end-12 -mx-3">
                <Swiper
                  modules={[Navigation]}
                  navigation={{
                    nextEl: ".about-us-testimonial-slider-nav .next",
                    prevEl: ".about-us-testimonial-slider-nav .prev",
                  }}
                  spaceBetween={24}
                  slidesPerView={2}
                  breakpoints={{
                    0: { slidesPerView: 1 },
                    1025: { slidesPerView: 2 },
                  }}
                >
                  {testimonials.map((t) => (
                    <SwiperSlide key={t.id}>
                      <div className="bg-white rounded-3xl p-10 mx-3">
                        <div className="flex items-center gap-x-4 pb-6">
                          <img
                            src={t.avatar}
                            alt={t.name}
                            className="rounded-full size-12"
                          />
                          <div>
                            <p className="pb-1 font-semibold">{t.name}</p>
                            <p className="text-sm">{t.date}</p>
                          </div>
                        </div>
                        <p>{t.review}</p>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="about-us-testimonial-slider-nav mt-12 flex items-center justify-center gap-x-6 col-span-12">
                <button className="prev">⬅</button>
                <button className="next">➡</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TestimonialHome;
