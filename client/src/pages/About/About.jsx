import React from "react";
import Subscribe from "../../components/Subscribe/Subscribe";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import a1 from './man-woman.jpg'
import a2 from './two-women.webp'
import a3 from './female-green-bg.webp'

import "swiper/css";
import "swiper/css/navigation";

// ===================== DATA =====================

const stats = [
  { value: "25", suffix: "+", label: "Years of Experience" },
  { value: "500", suffix: "K+", label: "Instruments Delivered" },
  { value: "50", suffix: "K+", label: "Verified 5-Star Reviews" },
  { value: "98", suffix: "%", label: "Customer Satisfaction Rate" },
];

const qualityCards = [
  { icon: "hgi-container-truck", title: "Free Shipping", desc: "Enjoy free shipping on every instrument order across India" },
  { icon: "hgi-customer-support", title: "Expert Support", desc: "Our music experts are available 24x7 to help you choose the right instrument" },
  { icon: "hgi-delivery-return-02", title: "30 Days Return", desc: "Not satisfied? Return any instrument within 30 days, hassle-free" },
];

const deliveryFeatures = [
  "Absolutely Free: No shipping fees on instruments across India — no hidden charges.",
  "Real-Time Tracking: Stay updated at every step with live order tracking.",
  "Trusted Delivery Partners: We work with reliable couriers to ensure safe instrument delivery.",
  "Weekend & Evening Slots: Receive your instrument when it is most convenient for you.",
];

const satisfactionFeatures = [
  "Expert Guidance: Our trained staff helps you pick the right instrument for your skill level.",
  "Genuine Products: Every instrument is sourced directly from verified brands and manufacturers.",
  "After-Sale Support: From tuning tips to maintenance advice, we are with you long after purchase.",
];

const testimonials = [
  {
    id: 1,
    name: "Arjun Mehta",
    date: "10:30AM, 5 Jan, 2025",
    avatar: "assets/images/vendors-list/vendor-profile.png",
    review: "Hargun Musicals delivered my Yamaha keyboard in perfect condition and ahead of schedule. The packaging was excellent and the instrument was exactly as described. Will definitely order again!",
  },
  {
    id: 2,
    name: "Priya Sharma",
    date: "02:15PM, 18 Feb, 2025",
    avatar: "assets/images/vendors-list/vendor-profile.png",
    review: "I bought my first acoustic guitar from Hargun Musicals. Their team helped me pick the right one for a beginner. The free shipping and easy return policy made it a completely stress-free experience.",
  },
  {
    id: 3,
    name: "Rajan Kapoor",
    date: "09:00AM, 3 Mar, 2025",
    avatar: "assets/images/vendors-list/vendor-profile.png",
    review: "Best musical instrument store online. Got my Roland electronic drum kit within 3 days. The quality is outstanding and the price was very competitive. Highly recommend Hargun Musicals!",
  },
];

// ===================== COMPONENT =====================

const About = () => {
  return (
    <>
      {/* Breadcrumb */}
      <div className="py-12">
        <div className="container">
          <div className="breadcrumb">
            <ul>
              <li>
                <a href="/">
                  <span>
                    <i className="hgi hgi-stroke hgi-home-01 text-[20px]"></i>
                  </span>
                  Home
                </a>
              </li>
              <li className="text-light-disabled-text">&#8226;</li>
              <li>
                <span>About Us</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pb-[70px]">
        <div className="container">
          <div className="grid grid-cols-12 gap-x-[30px]">
            <div className="xl:col-span-8 col-span-12">
              <div className="md:flex justify-between">
                <div className="lg:w-[644px] md:w-[400px] w-full md:pt-[56px] pb-10 order-2 md:order-1">
                  <h2
                    className="pb-6 wow animate__animated animate__fadeInUp"
                    data-wow-delay=".2s"
                  >
                    India's Most Trusted Musical Instrument Store
                  </h2>
                  <div
                    className="pb-4 wow animate__animated animate__fadeInUp"
                    data-wow-delay=".3s"
                  >
                    <h5 className="pb-3">Our Mission</h5>
                    <p>
                      At Hargun Musicals, our mission is to make world-class
                      musical instruments accessible, affordable, and reliable
                      for every musician — from beginners picking up their first
                      guitar to professionals performing on stage. We are
                      committed to nurturing a love for music across India,
                      one instrument at a time.
                    </p>
                  </div>
                  <div
                    className="wow animate__animated animate__fadeInUp"
                    data-wow-delay=".4s"
                  >
                    <h5 className="pb-3">Our Vision</h5>
                    <p>
                      To become India's most trusted destination for musical
                      instruments — empowering musicians of all ages and skill
                      levels to discover, learn, and perform with the finest
                      instruments available. We believe music has the power to
                      transform lives, and we are here to help you play yours.
                    </p>
                  </div>
                </div>
                <div
                  className="md:w-[255px] lg:max-h-[340px] order-1 md:order-2 wow animate__animated animate__fadeInUp"
                  data-wow-delay=".2s"
                >
                  <img
                    src={a1}
                    alt="Hargun Musicals Team"
                    className="rounded-2xl h-full object-cover"
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="md:flex justify-between lg:p-10 p-4 border border-gray-300 rounded-2xl lg:mt-0 mt-10 lg:mb-[53px] mb-10">
                {stats.map((stat, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && (
                      <div
                        className="border-r border-gray-300 wow animate__animated animate__fadeInUp"
                        data-wow-delay={`.${3 + i}s`}
                      ></div>
                    )}
                    <div
                      className={`${i > 0 ? 'md:pb-0 pb-2 md:pt-0 pt-2 md:border-none border-b border-gray-300 xl:px-0 lg:px-6 md:px-4' : 'md:pb-0 pb-2 md:border-none border-b border-gray-300 xl:pr-0 lg:pr-6 md:pr-4'} wow animate__animated animate__fadeInUp`}
                      data-wow-delay={`.${2 + i}s`}
                    >
                      <div className="flex items-center justify-center">
                        <h3 className="about-us-counter">{stat.value}</h3>
                        <h3>{stat.suffix}</h3>
                      </div>
                      <p className="text-center">{stat.label}</p>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div
              className="xl:col-span-4 col-span-12 wow animate__animated animate__fadeInUp"
              data-wow-delay=".2s"
            >
              <img
                src={a2}
                alt="Hargun Musicals Store"
                className="rounded-2xl xl:h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section className="mb-[70px]">
        <div className="lg:bg-white bg-[#FFD6EF] py-12 lg:pt-0 lg:pb-[23px] text-center lg:max-w-[704px] mx-auto lg:rounded-[164px] lg:-mb-[103px] relative z-10 lg:before:bg-[#FFD6EF] lg:after:bg-[#FFD6EF] lg:before:absolute lg:before:bottom-0 lg:before:left-0 lg:before:h-full lg:before:w-[145px] lg:before:bg-[url('../images/slider-left-shape.png')] lg:before:bg-no-repeat lg:before:z-11 lg:after:absolute lg:after:bottom-0 lg:after:right-0 lg:after:h-full lg:after:w-[145px] lg:after:bg-[url('../images/slider-right-shape.png')] lg:after:bg-no-repeat lg:after:z-11">
          <h3
            className="mb-2 wow animate__animated animate__fadeInUp"
            data-wow-delay=".2s"
          >
            Quality Instruments
          </h3>
          <p
            className="wow animate__animated animate__fadeInUp"
            data-wow-delay=".2s"
          >
            Because every musician deserves the best instrument to express themselves.
          </p>
        </div>
        <div className="xl:max-w-[1728px] w-full mx-auto relative bg-[#A0E2E0] xl:rounded-5xl pb-12 lg:pt-[172px]">
          <div className="container">
            <div className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-x-6 gap-y-6">
              {qualityCards.map((card, i) => (
                <div
                  key={i}
                  className="p-6 border-gray-300 border bg-white rounded-2xl text-center lg:w-[390px] w-full wow animate__animated animate__fadeInUp"
                  data-wow-delay={`.${2 + i}s`}
                >
                  <span className="inline-flex items-center justify-center size-14 bg-warning-lighter rounded-full">
                    <i className={`hgi hgi-stroke ${card.icon} text-3xl text-light-primary-text`}></i>
                  </span>
                  <h5 className="pt-3 pb-0.5">{card.title}</h5>
                  <p>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Faster Delivery Section */}
      {/* <section className="pb-[70px]">
        <div className="container">
          <div className="grid grid-cols-12 items-center lg:gap-x-[70px]">
            <div className="col-span-12 lg:col-span-6 lg:max-w-[762px] row-start-1 lg:row-start-auto">
              <div
                className="wow animate__animated animate__fadeInUp"
                data-wow-delay=".2s"
              >
                <p className="text-primary bg-[#00AB5514] py-0.5 px-3 inline-flex gap-x-2.5 items-center rounded-full font-semibold">
                  <span className="w-[15px] h-[15px] rounded-full bg-primary"> </span>
                  Features
                </p>
              </div>
              <h3
                className="pt-4 pb-10 wow animate__animated animate__fadeInUp"
                data-wow-delay=".3s"
              >
                Fast & Free Instrument Delivery
              </h3>
              <p
                className="pb-6 wow animate__animated animate__fadeInUp"
                data-wow-delay=".4s"
              >
                At Hargun Musicals, we know how excited you are to get your
                hands on your new instrument. That's why we have built a
                delivery experience that is fast, free, and completely
                transparent. From guitars to drum kits, your instrument reaches
                you safely and on time — every time. Here is why musicians love
                shopping with us:
              </p>
              <ul
                className="pb-6 space-y-4 wow animate__animated animate__fadeInUp"
                data-wow-delay=".5s"
              >
                {deliveryFeatures.map((feature, i) => (
                  <li key={i} className="flex gap-x-4">
                    <span className="inline-flex flex-none items-center justify-center size-6 bg-primary text-white rounded-full">
                      <i className="hgi hgi-stroke hgi-tick-02"></i>
                    </span>
                    <p>{feature}</p>
                  </li>
                ))}
              </ul>
              <p
                className="wow animate__animated animate__fadeInUp"
                data-wow-delay=".6s"
              >
                Say goodbye to waiting. At Hargun Musicals, your music should
                not have to wait — and with our free fast delivery, it never
                will.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-6 row-start-2 lg:row-start-auto">
              <div className="xl:flex items-center gap-x-6">
                <img
                  src="assets/images/about/woman-on-phone.jpg"
                  alt="Customer receiving instrument"
                  className="rounded-2xl lg:max-w-[450px] w-full min-h-[570px] object-cover xl:mb-0 mb-6 lg:mt-0 mt-6 wow animate__animated animate__fadeInUp"
                  data-wow-delay=".2s"
                />
                <div>
                  <img
                    src="assets/images/about/woman-bg.png"
                    alt="Musician playing guitar"
                    className="rounded-2xl w-full xl:max-w-[306px] min-h-[414px] object-cover xl:object-left wow animate__animated animate__fadeInUp"
                    data-wow-delay=".3s"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Customer Satisfaction Section */}
      <section className="pb-[70px]">
        <div className="container">
          <div className="grid grid-cols-12 items-center lg:gap-x-[70px]">
            <div
              className="col-span-12 lg:col-span-6 row-start-2 lg:row-start-auto relative wow animate__animated animate__fadeInUp"
              data-wow-delay=".2s"
            >
              <img
                src={a3}
                alt="Musician performing"
                className="rounded-3xl w-full min-h-[570px] object-cover xl:mb-0 mb-6 lg:mt-0 mt-6"
              />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                {/* <a
                  className="about-us-popup-youtube"
                  href="https://www.youtube.com/watch?v=rkpzYNB6xks"
                >
                  <i className="hgi hgi-stroke hgi-play-circle text-white text-[86px]"></i>
                </a> */}
              </span>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:max-w-[762px] row-start-1 lg:row-start-auto">
              <div
                className="wow animate__animated animate__fadeInUp"
                data-wow-delay=".2s"
              >
                <p className="text-primary bg-[#00AB5514] py-0.5 px-3 inline-flex gap-x-2.5 items-center rounded-full font-semibold">
                  <span className="w-[15px] h-[15px] rounded-full bg-primary"> </span>
                  Features
                </p>
              </div>
              <h3
                className="pt-4 pb-10 wow animate__animated animate__fadeInUp"
                data-wow-delay=".3s"
              >
                Your Satisfaction is Our Encore
              </h3>
              <p
                className="pb-6 wow animate__animated animate__fadeInUp"
                data-wow-delay=".4s"
              >
                At Hargun Musicals, every purchase is backed by our commitment
                to your complete satisfaction. We do not just sell instruments —
                we help you find the right one, support you after purchase, and
                make sure your music journey is as smooth as possible. Here is
                what sets us apart:
              </p>
              <ul
                className="pb-6 space-y-4 wow animate__animated animate__fadeInUp"
                data-wow-delay=".5s"
              >
                {satisfactionFeatures.map((feature, i) => (
                  <li key={i} className="flex gap-x-4">
                    <span className="inline-flex flex-none items-center justify-center size-6 bg-primary text-white rounded-full">
                      <i className="hgi hgi-stroke hgi-tick-02"></i>
                    </span>
                    <p>{feature}</p>
                  </li>
                ))}
              </ul>
              <p
                className="wow animate__animated animate__fadeInUp"
                data-wow-delay=".6s"
              >
                Hargun Musicals is not just a store — it is a community of
                music lovers. We are passionate about instruments, and that
                passion shows in everything we do, from sourcing to delivery to
                after-sale care.
              </p>
            </div>
          </div>
        </div>
      </section>

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

      {/* Subscribe */}
      <Subscribe />
    </>
  );
};

export default About;