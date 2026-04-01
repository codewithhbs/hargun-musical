import React from 'react'
import a1 from './man-woman.jpg'
import a2 from './two-women.webp'

const stats = [
  { value: "25", suffix: "+", label: "Years of Experience" },
  { value: "500", suffix: "K+", label: "Instruments Delivered" },
  { value: "50", suffix: "K+", label: "Verified 5-Star Reviews" },
  { value: "98", suffix: "%", label: "Customer Satisfaction Rate" },
];

const AboutHome = () => {
  return (
    <>
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
    </>
  )
}

export default AboutHome
