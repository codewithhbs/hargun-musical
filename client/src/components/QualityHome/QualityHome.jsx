import React from 'react'

const qualityCards = [
  { icon: "hgi-container-truck", title: "Free Shipping", desc: "Enjoy free shipping on every instrument order across India" },
  { icon: "hgi-customer-support", title: "Expert Support", desc: "Our music experts are available 24x7 to help you choose the right instrument" },
  { icon: "hgi-delivery-return-02", title: "30 Days Return", desc: "Not satisfied? Return any instrument within 30 days, hassle-free" },
];

const QualityHome = () => {
  return (
    <>
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
    </>
  )
}

export default QualityHome
