import { useState } from "react";
import Order from "./Order";
import MyDetail from "./MyDetail";

const Profile = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const token = localStorage.getItem("token_login");

  if (!token) {
    window.location.href = "/login";
  }

  const handleLogout = () => {
    localStorage.removeItem("token_login");
    window.location.href = "/login";
  };

  return (
    <>
      {/* ========== Breadcrumb Section ========== */}
      <div className="container py-12">
        <nav>
          <ol className="flex items-center gap-x-2 text-sm">
            <li>
              <a href="/" className="flex items-center gap-x-1 text-gray-500 hover:text-gray-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Home
              </a>
            </li>
            <li className="text-gray-400">&#8226;</li>
            <li className="text-sm text-gray-800 font-normal">User Dashboard</li>
            <li className="text-gray-400">&#8226;</li>
            <li className="text-sm text-gray-500">Order History</li>
          </ol>
        </nav>
      </div>
      {/* ========== Breadcrumb Section End ========== */}

      {/* ========== My Account Section ========== */}
      <section className="pb-[74px]">
        <div className="container">
          <div className="grid grid-cols-12 lg:gap-x-10 gap-y-6">

            {/* ===== Sidebar ===== */}
            <div className="xl:col-span-3 lg:col-span-4 col-span-12">
              <div className="sticky top-20">
                <ul className="flex flex-col gap-y-1 border border-gray-300 p-4 rounded-2xl">
                  {[
                    { key: "dashboard", label: "Dashboard", icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                      </svg>
                    )},
                    { key: "orders", label: "Orders", icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                      </svg>
                    )},
                    { key: "profile", label: "My Account", icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    )},
                    { key: "logout", label: "Log Out", icon: (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                      </svg>
                    )},
                  ].map(({ key, label, icon }) => (
                    <li key={key}>
                      <button
                        type="button"
                        onClick={() => setActiveMenu(key)}
                        className={`w-full flex items-center gap-x-4 font-semibold p-4 rounded-lg transition-colors ease-in-out duration-300 ${
                          activeMenu === key
                            ? "bg-green-600 text-white"
                            : "text-gray-700 hover:bg-green-600 hover:text-white profile-btn"
                        }`}
                      >
                        <span className="inline-flex items-center justify-center">{icon}</span>
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* ===== Sidebar End ===== */}

            {/* ===== Main Content ===== */}
            <div className="xl:col-span-9 lg:col-span-8 col-span-12">

              {/* ===== Dashboard Tab ===== */}
              {activeMenu === "dashboard" && (
                <div>
                  <h3 className="mb-6 text-2xl font-bold text-gray-800">Dashboard</h3>
                  <p className="text-gray-600">
                    From your account dashboard. you can easily check &amp; view your{" "}
                    <a className="text-green-600 hover:underline" href="#">recent orders</a>,{" "}
                    manage your{" "}
                    <a className="text-green-600 hover:underline" href="#">shipping and billing addresses</a>{" "}
                    and{" "}
                    <a className="text-green-600 hover:underline" href="#">edit your password and account details.</a>
                  </p>
                </div>
              )}

              {/* ===== Orders Tab ===== */}
              {activeMenu === "orders" && (
                <Order />
              )}

              {/* ===== Order Details View ===== */}
              {/* {activeMenu === "orders" && viewingOrderId && (
                <div>
                  <div className="flex items-center gap-x-6 mb-8">
                    <button
                      onClick={() => setViewingOrderId(null)}
                      className="size-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                      </svg>
                    </button>
                    <h4 className="text-gray-800 text-xl font-bold flex items-center gap-x-3">
                      Order ID <span>:</span> <span>{viewingOrderId}</span>
                    </h4>
                  </div>

                  <div className="flex flex-col gap-y-6">
                    <div className="border border-gray-300 rounded-2xl overflow-hidden">
                      <div className="text-left py-4 px-6 bg-gray-100 border-b border-gray-300">
                        <h5 className="text-gray-800 text-xl font-bold">Timeline</h5>
                      </div>
                      <div className="lg:px-6 px-4 pb-6 pt-10">
                        {[
                          { time: "Apr 24 11:12 AM", title: "Order Placed", desc: "Thank you for your order! We've successfully received it and will begin preparing everything to ensure a smooth and timely delivery.", done: true },
                          { time: "Apr 24 11:12 AM", title: "Processing", desc: "We're currently reviewing your order details and checking the availability of the items. Hang tight — we'll start packing soon!", done: true },
                          { time: "----:-------", title: "Payment", desc: "Your payment is being securely processed and verified. This may take a few moments. We'll notify you as soon as it's confirmed.", done: false },
                          { time: "----:-------", title: "Packing", desc: "Our team is now carefully packing your items to make sure everything arrives in perfect condition. Quality is our priority!", done: false },
                          { time: "----:-------", title: "Delivering", desc: "Your order is on the move! It's currently being delivered to your address. Keep an eye out — it's almost there.", done: false },
                          { time: "----:-------", title: "Delivered", desc: "Your order has been successfully delivered. We hope everything arrived safely and that you love your purchase. Thank you for choosing us!", done: false, last: true },
                        ].map((step, i) => (
                          <div key={i} className="flex gap-x-6">
                            <div className="min-h-[90px] text-end">
                              <p className="text-xs leading-[18px] w-[55px] text-gray-500">{step.time}</p>
                            </div>
                            <div className={`relative ${!step.last ? "after:absolute after:top-5 after:bottom-0 after:left-[9px] after:w-px after:bg-" + (step.done ? "green-500" : "gray-300") : ""}`}>
                              <div className="relative z-10 size-5 flex justify-center items-center">
                                {step.done ? (
                                  <div className="size-5 rounded-full bg-green-100 border border-green-600 inline-flex items-center justify-center">
                                    <svg className="w-3 h-3 text-green-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="size-5 rounded-full bg-white border border-gray-300"></div>
                                )}
                              </div>
                              {!step.last && (
                                <div className={`absolute top-5 bottom-0 left-[9px] w-px ${step.done ? "bg-green-500" : "bg-gray-300"}`}></div>
                              )}
                            </div>
                            <div className="grow pt-0.5 pb-8">
                              <p className="font-semibold text-gray-800">{step.title}</p>
                              <p className="text-gray-500 text-sm leading-[22px]">{step.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-gray-300 rounded-2xl overflow-hidden">
                      <div className="text-left py-4 px-6 bg-gray-100 border-b border-gray-300">
                        <h5 className="text-gray-800 text-xl font-bold">Shipment Address</h5>
                      </div>
                      <div className="lg:px-6 px-4 py-6">
                        <ul className="flex flex-col gap-y-5">
                          {[
                            { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>, text: "Leslie Alexander" },
                            { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>, text: "(555) 123-4567" },
                            { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>, text: "dolores.chambers@example.com" },
                            { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>, text: "1234 Elm Street, Springfield, CA, 90210, United States" },
                          ].map((item, i) => (
                            <li key={i} className="flex items-center gap-x-2.5 text-gray-700">
                              <span className="inline-flex items-center justify-center text-gray-500">{item.icon}</span>
                              {item.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="border border-gray-300 rounded-2xl overflow-hidden">
                      <div className="text-left py-4 px-6 bg-gray-100 border-b border-gray-300">
                        <h5 className="text-gray-800 text-xl font-bold">Order Items</h5>
                      </div>
                      <div className="lg:px-6 px-4 pt-6">
                        <ul className="flex flex-col gap-y-4">
                          {[
                            { name: "Happy Bite Cookies – 300g", img: "https://placehold.co/120x120/e5e7eb/9ca3af?text=🍪", oldPrice: "$29.99", price: "$27.99", category: "Grocery", variant: "Color: Black, Size: 250 ML", rating: "80%", reviews: "189", status: "Processing" },
                            { name: "Farm Fresh Eggs – 12 Pack", img: "https://placehold.co/120x120/e5e7eb/9ca3af?text=🥚", oldPrice: "$8.99", price: "$7.49", category: "Grocery", variant: "Size: 12 Pieces", rating: "90%", reviews: "302", status: "Processing" },
                            { name: "Vitamin C Supplement", img: "https://placehold.co/120x120/e5e7eb/9ca3af?text=💊", oldPrice: "$14.99", price: "$12.99", category: "Health", variant: "Size: 60 Tablets", rating: "75%", reviews: "450", status: "Processing" },
                          ].map((item, i) => (
                            <li key={i} className="py-4 border-b border-gray-300 last:border-b-0 first:pt-0 last:pb-0">
                              <div className="flex flex-col md:flex-row gap-x-4">
                                <div className="w-[120px] h-[120px] bg-gray-200 rounded-lg mx-auto mb-4 md:mb-0 flex items-center justify-center text-4xl flex-shrink-0">
                                  {item.img.includes("🍪") ? "🍪" : item.img.includes("🥚") ? "🥚" : "💊"}
                                </div>
                                <div className="flex flex-col gap-y-2 flex-1">
                                  <div className="flex items-center justify-between">
                                    <a href="#" className="text-gray-800 font-semibold">{item.name}</a>
                                    <div className="flex items-center gap-x-2">
                                      <p className="text-gray-400 line-through font-normal">{item.oldPrice}</p>
                                      <p className="font-semibold text-gray-800">{item.price}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-y-1">
                                      <p className="text-sm text-gray-500">{item.category}</p>
                                      <p className="text-sm text-gray-500">{item.variant}</p>
                                    </div>
                                    <p className="flex items-center gap-x-2 text-sm text-gray-700">
                                      Quantity <span>:</span> <span className="font-semibold">1</span>
                                    </p>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-x-1">
                                      <div className="flex">
                                        {[1,2,3,4,5].map((s) => (
                                          <svg key={s} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                          </svg>
                                        ))}
                                      </div>
                                      <span className="text-sm text-gray-500">({item.reviews})</span>
                                    </div>
                                    <OrderStatusPill status={item.status} />
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-6">
                        <button className="w-full py-[11px] rounded-[80px] border border-green-600 text-green-600 font-semibold hover:bg-green-600 hover:text-white transition-colors duration-300">
                          Create another order with these items
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-300 rounded-2xl overflow-hidden">
                      <div className="text-left py-4 px-6 bg-gray-100 border-b border-gray-300">
                        <h5 className="text-gray-800 text-xl font-bold">Order Information</h5>
                      </div>
                      <div className="lg:px-6 px-4 py-6">
                        <ul className="flex flex-col gap-y-5 border-b border-gray-300 pb-5">
                          {[
                            { label: "Order", value: "65937", valueClass: "text-gray-800" },
                            { label: "Order At", value: "01 Jul, 2022", valueClass: "text-gray-800" },
                            { label: "Subtotal (MRP)", value: "$19", valueClass: "text-gray-800" },
                            { label: "Discount Applied", value: "-$1.15", valueClass: "text-red-500" },
                            { label: "Rounding off", value: "-$0.33", valueClass: "text-red-500" },
                            { label: "Delivery Charge", value: "Free", valueClass: "text-green-600" },
                          ].map((row, i) => (
                            <li key={i} className="flex items-center justify-between">
                              <p className="text-gray-500">{row.label}</p>
                              <span className={row.valueClass}>{row.value}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center justify-between py-5 border-b border-gray-300">
                          <h5 className="font-bold text-gray-800">Amount Payable</h5>
                          <h5 className="font-bold text-gray-800">$40.00</h5>
                        </div>
                        <div className="flex items-center justify-between pt-6 gap-x-4">
                          <button className="flex-1 py-[11px] rounded-[80px] border border-red-500 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition-colors duration-300">
                            Cancel Order
                          </button>
                          <button className="flex-1 py-[11px] rounded-[80px] border border-green-600 text-green-600 font-semibold hover:bg-green-600 hover:text-white transition-colors duration-300">
                            Download Invoice
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )} */}

              {/* ===== My Account Tab ===== */}
              {activeMenu === "profile" && (
                <MyDetail />
              )}

              {/* ===== Logout Tab ===== */}
              {activeMenu === "logout" && (
                <div className="flex flex-col items-center justify-center py-24 gap-y-6">
                  <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h4 className="text-gray-800 font-bold text-xl mb-2">Log Out</h4>
                    <p className="text-gray-500 text-sm">Are you sure you want to log out of your account?</p>
                  </div>
                  <div className="flex gap-x-4">
                    <button onClick={() => setActiveMenu("dashboard")} className="py-2.5 px-8 rounded-[80px] border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleLogout} className="py-2.5 px-8 rounded-[80px] bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors">
                      Yes, Log Out
                    </button>
                  </div>
                </div>
              )}

            </div>
            {/* ===== Main Content End ===== */}

          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;