import React from 'react'

const SidebarCart = () => {
  return (
    <div
        data-state="close"
        className="cart-sidebar flex fixed xl:top-[30px] xl:right-[22px] right-0 top-0 xl:h-[calc(100vh-52px)] h-full z-99 max-w-[600px] w-full bg-white xl:rounded-2xl rounded-none transition-all duration-250 ease-[cubic-bezier(0.645,0.045,0.355,1)] data-[state=open]:translate-x-0 data-[state=open]:opacity-100 data-[state=open]:visible data-[state=close]:translate-x-[200px] data-[state=close]:opacity-0 data-[state=close]:invisible"
      >
        <div className="cart-products xl:max-w-[600px] w-full h-full flex flex-col justify-between">
          <div className="cart-products-header pt-6 px-6 pb-4 border-b border-gray-300 flex flex-col gap-y-1 relative">
            <h5>Cart Products</h5>
            <p>1 Item in Cart</p>
            <button
              data-close-sidebar=".cart-sidebar"
              className="close-sidebar-btn absolute top-6 right-6 cursor-pointer inline-flex items-center justify-center size-9 rounded-full bg-[rgba(145,158,171,0.08)]"
            >
              <i className="hgi hgi-stroke hgi-multiplication-sign text-xl leading-5 text-light-primary-text"></i>
            </button>
          </div>
          <div className="cart-products-content p-6 flex flex-col gap-y-4 overflow-y-auto h-[calc(100%-250px)]">
            <div className="vendor-wise-cart-products border border-gray-300 rounded-2xl">
              <div className="vendor-wise-cart-products-header p-4 border-b border-gray-300 py-3 px-4">
                <div className="flex items-center gap-x-3">
                  <div className="has-[input:checked]:hover:bg-primary/8 hidden sm:flex items-center justify-center w-10 h-10 bg-transparent rounded-full hover:bg-[rgba(145,158,171,0.08)] transition-colors duration-300 ease-in-out">
                    <label className="relative inline-flex w-5 h-5 cursor-pointer items-center justify-center">
                      {/* <!-- Checkbox Input --> */}
                      <input
                        type="checkbox"
                        className="peer appearance-none w-full h-full border-2 focus:outline-none checked:border-none border-gray-300 rounded-sm bg-white checked:bg-primary transition-all"
                      />

                      {/* <!-- Checkbox Icon --> */}
                      <span className="absolute inset-0 inline-flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-all">
                        <i className="hgi hgi-stroke hgi-tick-02 text-[18px] leading-[18px]"></i>
                      </span>
                    </label>
                  </div>

                  <a
                    href="#"
                    className="inline-flex items-center justify-center gap-x-3 text-light-primary-text font-semibold group hover:text-primary transition-colors duration-300 ease-in-out"
                  >
                    <span className="inline-flex items-center justify-center">
                      <i className="hgi hgi-stroke hgi-store-01 leading-6 text-2xl group-hover:text-primary"></i>
                    </span>
                    Brand Name
                  </a>
                </div>
              </div>
              <div className="vendor-wise-cart-products-content p-4 flex flex-col gap-y-4">
                <div className="cart-product-item flex items-center gap-x-4">
                  <div className="has-[input:checked]:hover:bg-primary/8 hidden sm:flex items-center justify-center w-10 h-10 bg-transparent rounded-full hover:bg-[rgba(145,158,171,0.08)] transition-colors duration-300 ease-in-out">
                    <label className="relative inline-flex w-5 h-5 cursor-pointer items-center justify-center">
                      {/* <!-- Checkbox Input --> */}
                      <input
                        type="checkbox"
                        className="peer appearance-none w-full h-full border-2 focus:outline-none checked:border-none border-gray-300 rounded-sm bg-white checked:bg-primary transition-all"
                      />

                      {/* <!-- Checkbox Icon --> */}
                      <span className="absolute inset-0 inline-flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-all">
                        <i className="hgi hgi-stroke hgi-tick-02 text-[18px] leading-[18px]"></i>
                      </span>
                    </label>
                  </div>
                  <div className="cart-product-content-wrapper flex flex-col sm:flex-row items-center sm:gap-x-4 gap-y-2 sm:gap-y-0 p-4 border border-gray-300 rounded-2xl flex-1">
                    <div className="cart-product-item-image sm:w-[102px] sm:h-[102px] rounded-xl bg-[#F4F3F5] overflow-hidden relative">
                      <img
                        src="assets/images/home-3/watermelon.png"
                        alt="Product Image"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="cart-product-item-content flex flex-col gap-y-2 flex-1 w-full">
                      <div className="flex items-center justify-between gap-x-2">
                        <h6 className="text-base font-semibold">
                          Fresh Bask Basket Fruits
                        </h6>
                        <div className="cart-edit-remove flex items-center gap-x-3">
                          <button>
                            <i className="hgi hgi-stroke hgi-edit-02 text-xl text-light-primary-text"></i>
                          </button>
                          <button>
                            <i className="hgi hgi-stroke hgi-delete-01 text-xl text-light-primary-text"></i>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm leading-[22px]">
                        Color: Black, Size: 250 ML
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="price-section flex items-center gap-x-3">
                          <span className="current-price text-base font-semibold text-light-primary-text">
                            $27.49
                          </span>
                          <span className="old-price text-base text-light-disabled-text line-through">
                            $39.99
                          </span>
                        </div>
                        <div className="border border-gray-300 inline-flex items-center justify-center rounded-[80px] max-w-[108px] py-2.5 px-4">
                          <button className="inline-flex items-center justify-center hover:text-primary">
                            <i className="hgi hgi-stroke hgi-remove-circle text-2xl leading-6"></i>
                          </button>
                          <input
                            type="text"
                            readOnly=""
                            value="1"
                            className="border-0 w-full grow text-center focus:outline-none font-semibold"
                          />

                          <button className="inline-flex items-center justify-center hover:text-primary">
                            <i className="hgi hgi-stroke hgi-add-circle text-2xl leading-6"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cart-product-item flex items-center gap-x-4">
                  <div className="has-[input:checked]:hover:bg-primary/8 hidden sm:flex items-center justify-center w-10 h-10 bg-transparent rounded-full hover:bg-[rgba(145,158,171,0.08)] transition-colors duration-300 ease-in-out">
                    <label className="relative inline-flex w-5 h-5 cursor-pointer items-center justify-center">
                      {/* <!-- Checkbox Input --> */}
                      <input
                        type="checkbox"
                        className="peer appearance-none w-full h-full border-2 focus:outline-none checked:border-none border-gray-300 rounded-sm bg-white checked:bg-primary transition-all"
                      />

                      {/* <!-- Checkbox Icon --> */}
                      <span className="absolute inset-0 inline-flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-all">
                        <i className="hgi hgi-stroke hgi-tick-02 text-[18px] leading-[18px]"></i>
                      </span>
                    </label>
                  </div>
                  <div className="cart-product-content-wrapper flex flex-col sm:flex-row items-center sm:gap-x-4 gap-y-2 sm:gap-y-0 p-4 border border-gray-300 rounded-2xl flex-1">
                    <div className="cart-product-item-image sm:w-[102px] sm:h-[102px] rounded-xl bg-[#F4F3F5] overflow-hidden relative">
                      <img
                        src="assets/images/home-3/avocado.png"
                        alt="Product Image"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="cart-product-item-content flex flex-col gap-y-2 flex-1 w-full">
                      <div className="flex items-center justify-between gap-x-2">
                        <h6 className="text-base font-semibold">
                          Fresh Bask Basket Fruits
                        </h6>
                        <div className="cart-edit-remove flex items-center gap-x-3">
                          <button>
                            <i className="hgi hgi-stroke hgi-edit-02 text-xl text-light-primary-text"></i>
                          </button>
                          <button>
                            <i className="hgi hgi-stroke hgi-delete-01 text-xl text-light-primary-text"></i>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm leading-[22px]">
                        Color: Black, Size: 250 ML
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="price-section flex items-center gap-x-3">
                          <span className="current-price text-base font-semibold text-light-primary-text">
                            $27.49
                          </span>
                          <span className="old-price text-base text-light-disabled-text line-through">
                            $39.99
                          </span>
                        </div>
                        <div className="border border-gray-300 inline-flex items-center justify-center rounded-[80px] max-w-[108px] py-2.5 px-4">
                          <button className="inline-flex items-center justify-center hover:text-primary">
                            <i className="hgi hgi-stroke hgi-remove-circle text-2xl leading-6"></i>
                          </button>
                          <input
                            type="text"
                            readOnly=""
                            value="1"
                            className="border-0 w-full grow text-center focus:outline-none font-semibold"
                          />

                          <button className="inline-flex items-center justify-center hover:text-primary">
                            <i className="hgi hgi-stroke hgi-add-circle text-2xl leading-6"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="vendor-wise-cart-products border border-gray-300 rounded-2xl">
              <div className="vendor-wise-cart-products-header p-4 border-b border-gray-300 py-3 px-4">
                <div className="flex items-center gap-x-3">
                  <div className="has-[input:checked]:hover:bg-primary/8 hidden sm:flex items-center justify-center w-10 h-10 bg-transparent rounded-full hover:bg-[rgba(145,158,171,0.08)] transition-colors duration-300 ease-in-out">
                    <label className="relative inline-flex w-5 h-5 cursor-pointer items-center justify-center">
                      {/* <!-- Checkbox Input --> */}
                      <input
                        type="checkbox"
                        className="peer appearance-none w-full h-full border-2 focus:outline-none checked:border-none border-gray-300 rounded-sm bg-white checked:bg-primary transition-all"
                      />

                      {/* <!-- Checkbox Icon --> */}
                      <span className="absolute inset-0 inline-flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-all">
                        <i className="hgi hgi-stroke hgi-tick-02 text-[18px] leading-[18px]"></i>
                      </span>
                    </label>
                  </div>

                  <a
                    href="#"
                    className="inline-flex items-center justify-center gap-x-3 text-light-primary-text font-semibold group hover:text-primary transition-colors duration-300 ease-in-out"
                  >
                    <span className="inline-flex items-center justify-center">
                      <i className="hgi hgi-stroke hgi-store-01 leading-6 text-2xl group-hover:text-primary"></i>
                    </span>
                    Brand Name
                  </a>
                </div>
              </div>
              <div className="vendor-wise-cart-products-content p-4 flex flex-col gap-y-4">
                <div className="cart-product-item flex items-center gap-x-4">
                  <div className="has-[input:checked]:hover:bg-primary/8 hidden sm:flex items-center justify-center w-10 h-10 bg-transparent rounded-full hover:bg-[rgba(145,158,171,0.08)] transition-colors duration-300 ease-in-out">
                    <label className="relative inline-flex w-5 h-5 cursor-pointer items-center justify-center">
                      {/* <!-- Checkbox Input --> */}
                      <input
                        type="checkbox"
                        className="peer appearance-none w-full h-full border-2 focus:outline-none checked:border-none border-gray-300 rounded-sm bg-white checked:bg-primary transition-all"
                      />

                      {/* <!-- Checkbox Icon --> */}
                      <span className="absolute inset-0 inline-flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-all">
                        <i className="hgi hgi-stroke hgi-tick-02 text-[18px] leading-[18px]"></i>
                      </span>
                    </label>
                  </div>
                  <div className="cart-product-content-wrapper flex flex-col sm:flex-row items-center sm:gap-x-4 gap-y-2 sm:gap-y-0 p-4 border border-gray-300 rounded-2xl flex-1">
                    <div className="cart-product-item-image sm:w-[102px] sm:h-[102px] rounded-xl bg-[#F4F3F5] overflow-hidden relative">
                      <img
                        src="assets/images/home-3/pouch-mockup.png"
                        alt="Product Image"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="cart-product-item-content flex flex-col gap-y-2 flex-1 w-full">
                      <div className="flex items-center justify-between gap-x-2">
                        <h6 className="text-base font-semibold">
                          Fresh Bask Basket Fruits
                        </h6>
                        <div className="cart-edit-remove flex items-center gap-x-3">
                          <button>
                            <i className="hgi hgi-stroke hgi-edit-02 text-xl text-light-primary-text"></i>
                          </button>
                          <button>
                            <i className="hgi hgi-stroke hgi-delete-01 text-xl text-light-primary-text"></i>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm leading-[22px]">
                        Color: Black, Size: 250 ML
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="price-section flex items-center gap-x-3">
                          <span className="current-price text-base font-semibold text-light-primary-text">
                            $27.49
                          </span>
                          <span className="old-price text-base text-light-disabled-text line-through">
                            $39.99
                          </span>
                        </div>
                        <div className="border border-gray-300 inline-flex items-center justify-center rounded-[80px] max-w-[108px] py-2.5 px-4">
                          <button className="inline-flex items-center justify-center hover:text-primary">
                            <i className="hgi hgi-stroke hgi-remove-circle text-2xl leading-6"></i>
                          </button>
                          <input
                            type="text"
                            readOnly=""
                            value="1"
                            className="border-0 w-full grow text-center focus:outline-none font-semibold"
                          />

                          <button className="inline-flex items-center justify-center hover:text-primary">
                            <i className="hgi hgi-stroke hgi-add-circle text-2xl leading-6"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cart-product-item flex items-center gap-x-4">
                  <div className="has-[input:checked]:hover:bg-primary/8 hidden sm:flex items-center justify-center w-10 h-10 bg-transparent rounded-full hover:bg-[rgba(145,158,171,0.08)] transition-colors duration-300 ease-in-out">
                    <label className="relative inline-flex w-5 h-5 cursor-pointer items-center justify-center">
                      {/* <!-- Checkbox Input --> */}
                      <input
                        type="checkbox"
                        className="peer appearance-none w-full h-full border-2 focus:outline-none checked:border-none border-gray-300 rounded-sm bg-white checked:bg-primary transition-all"
                      />

                      {/* <!-- Checkbox Icon --> */}
                      <span className="absolute inset-0 inline-flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-all">
                        <i className="hgi hgi-stroke hgi-tick-02 text-[18px] leading-[18px]"></i>
                      </span>
                    </label>
                  </div>
                  <div className="cart-product-content-wrapper flex flex-col sm:flex-row items-center sm:gap-x-4 gap-y-2 sm:gap-y-0 p-4 border border-gray-300 rounded-2xl flex-1">
                    <div className="cart-product-item-image sm:w-[102px] sm:h-[102px] rounded-xl bg-[#F4F3F5] overflow-hidden relative">
                      <img
                        src="assets/images/home-3/strawberry-snacks.png"
                        alt="Product Image"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="cart-product-item-content flex flex-col gap-y-2 flex-1 w-full">
                      <div className="flex items-center justify-between gap-x-2">
                        <h6 className="text-base font-semibold">
                          Fresh Bask Basket Fruits
                        </h6>
                        <div className="cart-edit-remove flex items-center gap-x-3">
                          <button>
                            <i className="hgi hgi-stroke hgi-edit-02 text-xl text-light-primary-text"></i>
                          </button>
                          <button>
                            <i className="hgi hgi-stroke hgi-delete-01 text-xl text-light-primary-text"></i>
                          </button>
                        </div>
                      </div>
                      <p className="text-sm leading-[22px]">
                        Color: Black, Size: 250 ML
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="price-section flex items-center gap-x-3">
                          <span className="current-price text-base font-semibold text-light-primary-text">
                            $27.49
                          </span>
                          <span className="old-price text-base text-light-disabled-text line-through">
                            $39.99
                          </span>
                        </div>
                        <div className="border border-gray-300 inline-flex items-center justify-center rounded-[80px] max-w-[108px] py-2.5 px-4">
                          <button className="inline-flex items-center justify-center hover:text-primary">
                            <i className="hgi hgi-stroke hgi-remove-circle text-2xl leading-6"></i>
                          </button>
                          <input
                            type="text"
                            readOnly=""
                            value="1"
                            className="border-0 w-full grow text-center focus:outline-none font-semibold"
                          />

                          <button className="inline-flex items-center justify-center hover:text-primary">
                            <i className="hgi hgi-stroke hgi-add-circle text-2xl leading-6"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="cart-products-footer p-6 border-t border-gray-300 flex flex-col gap-y-4">
            <div className="cart-subtotal flex items-center justify-between">
              <h5>Subtotal</h5>
              <h5>$27.49</h5>
            </div>
            <div className="cart-buttons flex items-center gap-x-4">
              <a
                className="btn btn-default outline btn-large rounded-[80px] flex-1"
                href="/product-detail"
              >
                View Cart
              </a>
              <a
                className="btn btn-primary btn-large rounded-[80px] flex-1"
                href="checkout.html"
              >
                Proceed to Checkout
              </a>
            </div>
          </div>
        </div>
      </div>
  )
}

export default SidebarCart
