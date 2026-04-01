import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

const CART_KEY = "cart";

const getCartFromStorage = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveCartToStorage = (cartData) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cartData));
  } catch {
    // silent fail
  }
};

const recalcCart = (items) => {
  const totalquantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return { totalquantity, totalAmount, payAmt: totalAmount };
};

const Cart = () => {
  const [items, setItems] = useState([]);
  const [totals, setTotals] = useState({
    totalquantity: 0,
    totalAmount: 0,
    payAmt: 0,
  });
  const [coupon, setCoupon] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const data = getCartFromStorage();
    if (data && Array.isArray(data.items)) {
      setItems(data.items);
      setTotals({
        totalquantity: data.totalquantity || 0,
        totalAmount: data.totalAmount || 0,
        payAmt: data.payAmt || 0,
      });
    }
  }, []);

  // Sync to localStorage whenever items change
  const syncStorage = useCallback((newItems) => {
    const calc = recalcCart(newItems);

    const VAT_RATE = 0.18;
    const subtotal = calc.totalAmount;
    const vat = parseFloat((subtotal * VAT_RATE).toFixed(2));
    const grandTotal = parseFloat((subtotal + vat).toFixed(2));

    const newCart = {
      items: newItems,
      source: "cart",
      ...calc,
      afterVatTotalPrice: grandTotal, // ✅ NEW FIELD ADDED
    };

    saveCartToStorage(newCart);
    setTotals(calc);
  }, []);

  const handleIncrement = (varientId) => {
    const newItems = items.map((item) =>
      item.Varient_id === varientId
        ? { ...item, quantity: item.quantity + 1 }
        : item,
    );
    setItems(newItems);
    syncStorage(newItems);
  };

  const handleDecrement = (varientId) => {
    const newItems = items
      .map((item) =>
        item.Varient_id === varientId
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      )
      .filter((item) => item.quantity > 0);
    setItems(newItems);
    syncStorage(newItems);
  };

  const handleRemove = (varientId) => {
    const newItems = items.filter((item) => item.Varient_id !== varientId);
    setItems(newItems);
    syncStorage(newItems);
  };

  const handleRemoveAll = () => {
    setItems([]);
    syncStorage([]);
  };

  const VAT_RATE = 0.18;
  const subtotal = totals.totalAmount;
  const vat = parseFloat((subtotal * VAT_RATE).toFixed(2));
  const grandTotal = parseFloat((subtotal + vat).toFixed(2));

  const handleCheckOut = () => {
    const token = localStorage.getItem("token_login");
    if (!token) {
      window.location.href = "/login";
    } else {
      if (agreed) {
        window.location.href = "/checkout";
      } else {
        toast.error("Please agree to terms and conditions.");
      }
    }
  };

  return (
    <>
      {/* ========== Breadcrumb Section Start ========== */}
      <div className="container py-12">
        <div className="breadcrumb">
          <ul>
            <li>
              <a href="/">
                <span className="inline-flex items-center justify-center">
                  <i className="hgi hgi-stroke hgi-home-01 text-2xl leading-6"></i>
                </span>
                Home
              </a>
            </li>
            <li className="text-light-disabled-text">&#8226;</li>
            <li>
              <span className="text-sm leading-[22px]">Cart</span>
            </li>
          </ul>
        </div>
      </div>
      {/* ========== Breadcrumb Section End ========== */}

      {/* ========== Cart Section Start ========== */}
      <div className="pb-[70px]">
        <div className="container">
          <div className="grid grid-cols-12">
            <div className="xl:col-span-8 col-span-12">
              <div className="flex items-center justify-between mb-6 xl:px-2 px-0">
                <div className="flex items-center gap-x-1">
                  <h5>Cart</h5>
                  <p>
                    ({totals.totalquantity} item
                    {totals.totalquantity !== 1 ? "s" : ""})
                  </p>
                </div>
                {items.length > 0 && (
                  <div className="flex items-center">
                    <button
                      onClick={handleRemoveAll}
                      className="inline-flex gap-x-1 items-center justify-center font-semibold leading-[26px] text-error"
                    >
                      <i className="hgi hgi-stroke hgi-cancel-01 text-xl leading-5 font-semibold"></i>
                      Remove All
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-y-4">
              <i className="hgi hgi-stroke hgi-shopping-cart-01 text-6xl text-light-disabled-text"></i>
              <h5 className="text-light-secondary-text">Your cart is empty</h5>
              <a
                href="/shop"
                className="btn btn-primary py-3 px-8 rounded-[80px]"
              >
                Continue Shopping
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-x-6 gap-y-6">
              {/* Cart Table */}
              <div className="xl:col-span-8 col-span-12">
                <div className="wishlist-table-wrapper border-gray-300 rounded-2xl border overflow-x-auto">
                  <table className="w-full wishlist-table">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="product text-left font-semibold pl-4">
                          <p className="product-name">Product</p>
                        </th>
                        <th className="product-price text-left py-2.5 font-semibold">
                          Price
                        </th>
                        <th className="product-quantity text-left py-2.5 font-semibold">
                          Quantity
                        </th>
                        <th className="product-total-price text-left py-2.5 font-semibold">
                          Total Price
                        </th>
                        <th className="product-actions text-center py-2.5 font-semibold pr-4">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => {
                        const itemTotal = (item.price * item.quantity).toFixed(
                          2,
                        );
                        return (
                          <tr key={item.Varient_id} className="py-4">
                            {/* Product */}
                            <td
                              data-title="Product"
                              className="py-4 px-3 lg:px-4 product"
                            >
                              <div className="flex items-end md:items-start gap-x-4 flex-col md:flex-row gap-y-4">
                                <div className="product-thumbnail max-w-[120px] h-[120px] rounded-2xl bg-[#F4F3F5]">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="rounded-2xl h-full w-full object-cover"
                                    onError={(e) => {
                                      e.target.src =
                                        "https://placehold.co/120x120?text=No+Image";
                                    }}
                                  />
                                </div>
                                <div className="flex flex-col gap-y-2 items-end md:items-start">
                                  <a
                                    className="product-name text-light-primary-text font-semibold truncate hover:text-primary transition-colors duration-300"
                                    href={`/product/${item.slug}`}
                                  >
                                    {item.name}
                                  </a>
                                  <p className="text-sm leading-[22px] font-normal text-light-secondary-text inline-flex items-center gap-x-2.5">
                                    {item.color && `Color: ${item.color}`}
                                    {item.color &&
                                      item.size !== "default" &&
                                      ", "}
                                    {item.size &&
                                      item.size !== "default" &&
                                      `Color: ${item.size}`}
                                  </p>
                                  <p className="text-sm leading-[22px] font-normal text-light-secondary-text">
                                    Variant ID: {item.Varient_id?.slice(-6)}
                                  </p>
                                </div>
                              </div>
                            </td>

                            {/* Price */}
                            <td
                              data-title="Price"
                              className="capitalize py-4 px-3 lg:px-0 product-price"
                            >
                              <div className="flex items-center gap-x-3">
                                <span className="text-light-primary-text font-semibold">
                                  ₹{item.price.toFixed(2)}
                                </span>
                                {item.discount > 0 && (
                                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                                    -{item.discount}%
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Quantity */}
                            <td
                              data-title="Quantity"
                              className="capitalize py-4 px-3 lg:px-0 product-quantity"
                            >
                              <div className="border border-gray-300 inline-flex items-center justify-center rounded-[80px] max-w-[108px] py-2.5 px-4">
                                <button
                                  onClick={() =>
                                    handleDecrement(item.Varient_id)
                                  }
                                  className="inline-flex items-center justify-center hover:text-primary"
                                  aria-label="Decrease quantity"
                                >
                                  <i className="hgi hgi-stroke hgi-remove-circle text-xl leading-6"></i>
                                </button>
                                <input
                                  type="text"
                                  readOnly
                                  value={item.quantity}
                                  className="border-0 w-full grow text-center focus:outline-none font-semibold text-light-primary-text"
                                />
                                <button
                                  onClick={() =>
                                    handleIncrement(item.Varient_id)
                                  }
                                  className="inline-flex items-center justify-center hover:text-primary"
                                  aria-label="Increase quantity"
                                >
                                  <i className="hgi hgi-stroke hgi-add-circle text-xl leading-6"></i>
                                </button>
                              </div>
                            </td>

                            {/* Total Price */}
                            <td
                              data-title="Total Price"
                              className="capitalize py-4 px-3 lg:px-0 product-total-price"
                            >
                              <p className="font-semibold text-light-primary-text">
                                ₹{itemTotal}
                              </p>
                            </td>

                            {/* Actions */}
                            <td
                              data-title="Action"
                              className="capitalize py-4 px-3 lg:px-4 product-actions"
                            >
                              <div className="flex items-center justify-center gap-x-2 md:gap-x-6">
                                <button
                                  onClick={() => handleRemove(item.Varient_id)}
                                  className="inline-flex items-center justify-center product-remove"
                                  aria-label="Remove item"
                                >
                                  <i className="hgi hgi-stroke hgi-delete-01 text-2xl leading-6 text-light-primary-text"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="xl:col-span-4 col-span-12">
                <div className="border border-gray-300 rounded-2xl md:px-6 md:py-6 px-3 py-4 flex flex-col gap-y-6">
                  <div className="border border-gray-300 md:p-6 p-3 rounded-2xl">
                    <div className="flex flex-col gap-y-6">
                      <h5>Order Summary</h5>
                      <div>
                        <div className="flex flex-col gap-y-4 pb-4 border-b border-gray-300">
                          <p className="flex items-center justify-between">
                            Sub-Total
                            <span className="text-gray-900 font-semibold">
                              ₹{subtotal.toFixed(2)}
                            </span>
                          </p>
                          <p className="flex items-center justify-between">
                            VAT (18%)
                            <span className="text-gray-900">
                              ₹{vat.toFixed(2)}
                            </span>
                          </p>
                          <p className="flex items-center justify-between text-sm text-light-secondary-text">
                            Items
                            <span>{totals.totalquantity}</span>
                          </p>
                        </div>
                        <h6 className="flex items-center justify-between text-light-primary-text pt-4">
                          Total
                          <span className="text-gray-900">
                            ₹{grandTotal.toFixed(2)}
                          </span>
                        </h6>
                      </div>
                    </div>
                  </div>

                  {/* Terms checkbox */}
                  <label className="flex items-center cursor-pointer">
                    <span className="has-[input:checked]:hover:bg-[#00AB55]/8 flex items-center justify-center w-10 h-10 bg-transparent rounded-full hover:bg-[#919EAB]/8 transition-colors duration-300 ease-in-out">
                      <span className="relative inline-flex w-5 h-5 items-center justify-center">
                        <input
                          type="checkbox"
                          checked={agreed}
                          onChange={(e) => setAgreed(e.target.checked)}
                          className="peer appearance-none w-full h-full border-2 focus:outline-none checked:border-none border-gray-300 rounded-sm bg-white checked:bg-primary transition-all"
                        />
                        <span className="absolute inset-0 inline-flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-all">
                          <i className="hgi hgi-stroke hgi-tick-02 text-[18px] leading-[18px]"></i>
                        </span>
                      </span>
                    </span>
                    <span>
                      I agree with the{" "}
                      <span className="text-secondary underline font-semibold">
                        Terms
                      </span>{" "}
                      and{" "}
                      <span className="text-secondary underline font-semibold">
                        Conditions
                      </span>
                    </span>
                  </label>

                  {/* Checkout Buttons */}
                  <div className="flex flex-col gap-y-6">
                    <a
                      className={`btn btn-primary py-3 w-full rounded-[80px] text-center ${!agreed ? "opacity-50 pointer-events-none" : ""}`}
                      // href={agreed ? "order-successful.html" : "#"}
                      onClick={handleCheckOut}
                    >
                      Proceed to checkout
                    </a>
                    <a
                      className="btn btn-default outline shadow-none w-full py-[11px] rounded-[80px] inline-flex items-center justify-center gap-x-1"
                      href="/shop"
                    >
                      Continue Shopping
                      <span className="inline-flex items-center justify-center">
                        <i className="hgi hgi-stroke hgi-arrow-right-02 text-[22px] leading-[22px]"></i>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* ========== Cart Section End ========== */}

      {/* ========== Quality Priority Section Start ========== */}
      <section className="mb-[70px]">
        <div className="lg:bg-white bg-[#A0E2E0] py-12 lg:pt-0 lg:pb-[23px] text-center lg:max-w-[704px] mx-auto lg:rounded-[164px] lg:-mb-[103px] relative z-10 lg:before:bg-[#A0E2E0] lg:after:bg-[#A0E2E0] lg:before:absolute lg:before:bottom-0 lg:before:left-0 lg:before:h-full lg:before:w-[145px] lg:before:bg-[url('../images/slider-left-shape.png')] lg:before:bg-no-repeat lg:before:z-11 lg:after:absolute lg:after:bottom-0 lg:after:right-0 lg:after:h-full lg:after:w-[145px] lg:after:bg-[url('../images/slider-right-shape.png')] lg:after:bg-no-repeat lg:after:z-11">
          <h3
            className="mb-2 text-light-primary-text wow animate__animated animate__fadeInUp"
            data-wow-delay="0.2s"
          >
            Quality is our priority
          </h3>
          <p
            className="wow animate__animated animate__fadeInUp"
            data-wow-delay="0.3s"
          >
            Because you deserve nothing less than the best.
          </p>
        </div>
        <div className="xl:max-w-[1728px] w-full mx-auto relative bg-[#A0E2E0] xl:rounded-5xl pb-12 lg:pt-[172px]">
          <div className="container">
            <div className="grid grid-cols-12 gap-6">
              {[
                {
                  icon: "hgi-container-truck",
                  title: "Free Shipping",
                  desc: "Enjoy the Convenience of Free Shipping on Every Order",
                  delay: "0.2s",
                },
                {
                  icon: "hgi-customer-support",
                  title: "24x7 Support",
                  desc: "Round-the-Clock Assistance, Anytime You Need It",
                  delay: "0.3s",
                },
                {
                  icon: "hgi-delivery-return-02",
                  title: "30 Days Return",
                  desc: "Your Satisfaction is Our Priority: Return Any Product Within 30 Days",
                  delay: "0.4s",
                },
                {
                  icon: "hgi-transaction",
                  title: "Secure Payment",
                  desc: "Seamless Shopping Backed by Safe and Secure Payment Options",
                  delay: "0.5s",
                },
              ].map(({ icon, title, desc, delay }) => (
                <div
                  key={title}
                  className="md:col-span-6 col-span-12 xl:col-span-3"
                >
                  <div
                    className="p-6 rounded-2xl text-center bg-white wow animate__animated animate__fadeInUp"
                    data-wow-delay={delay}
                  >
                    <span className="inline-flex items-center justify-center size-14 bg-warning-lighter rounded-full">
                      <i
                        className={`hgi hgi-stroke ${icon} text-3xl text-light-primary-text`}
                      ></i>
                    </span>
                    <h5 className="pt-3 pb-0.5">{title}</h5>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* ========== Quality Priority Section End ========== */}
    </>
  );
};

export default Cart;
