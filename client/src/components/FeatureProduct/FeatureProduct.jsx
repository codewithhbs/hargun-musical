import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { useState } from "react";
import axios from "axios";

const FeatureProduct = () => {
  const [allProduct, setAllProduct] = useState([]);

  const handleFetchProduct = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:7500/api/v1/get-product",
      );
      setAllProduct(data.products);
    } catch (error) {
      console.log("Internal server error", error);
    }
  };

  useEffect(() => {
    handleFetchProduct();
  }, []);

  return (
    <section className="py-10 md:py-[70px]">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="md:flex md:justify-between md:items-center border-b border-gray-300 mb-6 md:mb-10">
          <div className="text-center md:text-left flex flex-col gap-y-2 pb-4 md:pb-6">
            <h3 className="text-xl md:text-2xl font-bold">Featured Products</h3>
          </div>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={12}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 2000 }}
          navigation
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            480: { slidesPerView: 1, spaceBetween: 12 },
            640: { slidesPerView: 2, spaceBetween: 14 },
            768: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3, spaceBetween: 18 },
            1280: { slidesPerView: 4, spaceBetween: 20 },
            1440: { slidesPerView: 4, spaceBetween: 20 },
          }}
        >
          {allProduct &&
            allProduct.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="mx-1 sm:mx-2 md:mx-3 mb-4">
                  <div className="border border-gray-300 rounded-2xl product-card-1 p-3 sm:p-4 group h-full">
                    {/* Image */}
                    <a href={`/product-detail/${item.slug}`}>
                      <div className="product-image-container relative">
                        <div
                          style={{ height: "350px" }}
                          className="product-image rounded-xl mb-3 sm:mb-4 overflow-hidden"
                        >
                          <img
                            src={item.ProductMainImage?.url}
                            alt={item.product_name}
                            className="group-hover:scale-110 transition-all transform group-hover:-rotate-3 ease-in-out duration-300 bg-[#F4F3F5] h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    </a>

                    {/* Content */}
                    <div className="product-content">
                      <span className="product-discount-badge inline-block relative bg-error text-warning-lighter font-medium text-xs sm:text-sm px-1 uppercase">
                        {item.tag}
                      </span>

                      <p className="py-2 sm:py-3 text-xs sm:text-sm text-gray-500">
                        {item.category?.name}
                      </p>

                      <h6 className="text-[15px] sm:text-[16px] md:text-[18px] font-bold pb-2 sm:pb-3 line-clamp-2">
                        {item.product_name}
                      </h6>

                      {/* Price */}
                      {/* Price */}
                      {(() => {
                        const firstVariant =
                          item.isVarient && item.Varient?.length > 0
                            ? item.Varient[0]
                            : null;
                        const currentPrice = firstVariant
                          ? (firstVariant.price_after_discount ??
                            firstVariant.price)
                          : item.afterDiscountPrice;
                        const oldPrice = firstVariant
                          ? firstVariant.price
                          : item.price;
                        const discount = firstVariant
                          ? firstVariant.discount_percentage
                          : item.discount;

                        return (
                          <div className="price-section flex flex-wrap items-center gap-x-2 sm:gap-x-3 mb-2">
                            <span className="current-price text-sm sm:text-base font-semibold text-light-primary-text">
                              ₹{currentPrice}
                            </span>
                            {discount > 0 && (
                              <>
                                <span className="old-price text-xs sm:text-sm font-normal text-light-disabled-text line-through">
                                  ₹{oldPrice}
                                </span>
                                <span className="discount-percentage text-xs sm:text-sm font-semibold text-error">
                                  {discount}%
                                </span>
                              </>
                            )}
                          </div>
                        );
                      })()}

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400"
                            style={{ width: item.soldPercent }}
                          />
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm mt-1 text-gray-500">
                          <span>Sold: {item.sold}</span>
                          <span>Available: {item.stock}</span>
                        </div>
                      </div>

                      {/* Button */}
                      <div className="flex items-center gap-x-3">
                        <a
                          href={`/product-detail/${item.slug}`}
                          className="btn btn-primary rounded-full text-xs sm:text-sm px-4 sm:px-6 py-2 flex-1 text-center"
                        >
                          View Product
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeatureProduct;
