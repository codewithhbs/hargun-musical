import React from 'react'
import a3 from './female-green-bg.webp'

const satisfactionFeatures = [
  "Expert Guidance: Our trained staff helps you pick the right instrument for your skill level.",
  "Genuine Products: Every instrument is sourced directly from verified brands and manufacturers.",
  "After-Sale Support: From tuning tips to maintenance advice, we are with you long after purchase.",
];

const FeatureHome = () => {
  return (
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
  )
}

export default FeatureHome
