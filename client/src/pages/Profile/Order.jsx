import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:7500/api/v1";
const TOKEN_KEY = "token_login";

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  confirmed: { bg: "rgba(255,193,7,0.16)",  color: "#b45309",  label: "Confirmed"  },
  processing: { bg: "rgba(255,193,7,0.16)", color: "#b45309",  label: "Processing" },
  delivering: { bg: "rgba(24,144,255,0.16)",color: "#1d4ed8",  label: "Delivering" },
  completed:  { bg: "rgba(84,214,44,0.16)", color: "#15803d",  label: "Completed"  },
  cancelled:  { bg: "rgba(255,72,66,0.16)", color: "#b91c1c",  label: "Cancelled"  },
};

const OrderStatusPill = ({ status = "" }) => {
  const key    = status.toLowerCase();
  const config = STATUS_CONFIG[key] || { bg: "rgba(0,0,0,0.08)", color: "#333", label: status };
  return (
    <span
      style={{ backgroundColor: config.bg, color: config.color }}
      className="inline-flex items-center justify-center py-[7px] px-3 text-xs leading-[18px] font-normal rounded-[90px] capitalize"
    >
      {config.label}
    </span>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", {
    hour: "2-digit", minute: "2-digit",
    day: "2-digit", month: "long", year: "numeric",
  });
};

const TAB_FILTERS = ["all", "confirmed", "processing", "delivering", "completed", "cancelled"];

// ─── Icons (inline SVG) ───────────────────────────────────────────────────────
const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
  </svg>
);
const BoxIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);
const TruckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
);
const CardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
  </svg>
);
const MapPinIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);
const EmptyIcon = () => (
  <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
  </svg>
);

// ─── Payment Badge ────────────────────────────────────────────────────────────
const PaymentBadge = ({ order }) => {
  const isPaid = order.payment?.isPaid;
  const isCOD  = order.paymentType === "COD";

  if (isCOD) {
    return (
      <span className="text-xs font-semibold ml-1">
        <span className="text-amber-600">(COD</span>
        {order.codFeePaid
          ? <span className="text-green-600"> · Advance Paid)</span>
          : <span className="text-gray-400"> · Advance Pending)</span>
        }
      </span>
    );
  }
  return (
    <span className={`text-xs font-semibold ml-1 ${isPaid ? "text-green-600" : "text-red-500"}`}>
      ({isPaid ? "Paid" : "Pending"})
    </span>
  );
};

// ─── Order Detail Modal ───────────────────────────────────────────────────────
const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div style={{border:'1px solid #088178'}} className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-200 rounded-t-2xl z-10">
          <div>
            <h5 className="font-bold text-gray-800">{order.orderId}</h5>
            <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.orderDate)}</p>
          </div>
          <div className="flex items-center gap-x-3">
            <OrderStatusPill status={order.status} />
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-y-5">

          {/* Items */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Items Ordered</p>
            <div className="flex flex-col gap-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Size: {item.size || "Default"} &bull; Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-green-600 text-sm">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Price Breakdown</p>
            <div className="flex flex-col gap-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Sub-Total</span>
                <span className="font-medium">₹{order.totalAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">VAT</span>
                <span className="font-medium">₹{order.vatAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {order.shippingAmount === 0 ? (
                    <span className="text-green-600 font-semibold">FREE</span>
                  ) : `₹${order.shippingAmount?.toFixed(2)}`}
                </span>
              </div>
              
              <div className="flex justify-between pt-2 border-t border-gray-200 mt-1">
                <span className="font-bold text-gray-800">Total Amount</span>
                <span className="font-bold text-green-600 text-base">₹{order.payAmt?.toFixed(2)}</span>
              </div>
              {order.paymentType === "COD" && order.codFeePaid && (
                <div className="flex justify-between">
                  <span className="text-gray-600">COD Advance Paid</span>
                  <span className="font-medium text-amber-600">₹{order.codFeeAmount?.toFixed(2)}</span>
                </div>
              )}

              {order.paymentType === "COD" && order.codFeePaid && (
                <div className="flex justify-between pt-2 border-t border-gray-200 mt-1">
                <span className="font-bold text-gray-800">Pending Payment</span>
                <span className="font-bold text-green-600 text-base">₹{order.payAmtAfterCOD?.toFixed(2)}</span>
              </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Payment</p>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-x-3">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  order.payment?.isPaid ? "bg-green-100" : "bg-amber-100"
                }`}>
                  <CardIcon />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    {order.paymentType === "COD" ? "Cash on Delivery" : "Online (Razorpay)"}
                  </p>
                  {order.payment?.transactionId && (
                    <p className="text-xs text-gray-400 mt-0.5">TxnID: {order.payment.transactionId}</p>
                  )}
                  {order.codFeePaymentId && order.paymentType === "COD" && (
                    <p className="text-xs text-gray-400 mt-0.5">Advance TxnID: {order.codFeePaymentId}</p>
                  )}
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                order.payment?.isPaid
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
              }`}>
                {order.payment?.isPaid ? "Paid" : "COD"}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Shipping Address</p>
            <div className="flex items-start gap-x-3 p-3 bg-gray-50 rounded-xl">
              <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPinIcon />
              </span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{order.shipping?.name}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {order.shipping?.addressLine}, {order.shipping?.city}, {order.shipping?.state} – {order.shipping?.postCode}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  📞 {order.shipping?.mobileNumber} &bull; {order.shipping?.addressType}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// ─── Main Order Component ─────────────────────────────────────────────────────
const Order = () => {
  const [activeTab, setActiveTab]       = useState("all");
  const [orders, setOrders]             = useState([]);
  const [isLoading, setIsLoading]       = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { window.location.href = "/login"; return; }

    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE}/my-all-order`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(data.order || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = activeTab === "all"
    ? orders
    : orders.filter((o) => o.status?.toLowerCase() === activeTab);

  return (
    <div className="flex flex-col gap-y-6">
      <h3 className="text-2xl font-bold text-gray-800">Orders History</h3>

      {/* Filter Tabs */}
      <div className="flex gap-x-2 overflow-x-auto pb-1">
        {TAB_FILTERS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`inline-flex items-center justify-center py-2 px-5 text-sm leading-[22px] rounded-[80px] font-medium whitespace-nowrap transition-colors duration-200 ${
              activeTab === tab
                ? "bg-green-600 text-white"
                : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Empty */}
      {!isLoading && filteredOrders.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <EmptyIcon />
          <p className="text-lg font-medium">No orders found</p>
        </div>
      )}

      {/* Order Cards */}
      {!isLoading && filteredOrders.length > 0 && (
        <div className="flex flex-col gap-y-6">
          {filteredOrders.map((order) => {
            const totalItems = order.items?.reduce((s, i) => s + i.quantity, 0) || 0;

            return (
              <div key={order._id} className="border border-gray-300 rounded-2xl overflow-hidden">

                {/* Card Header */}
                <div className="flex items-center justify-between py-4 px-5 border-b border-gray-200 bg-gray-50">
                  <span className="font-semibold text-gray-800 text-sm">
                    Order ID: <span className="text-green-700">{order.orderId}</span>
                  </span>
                  <OrderStatusPill status={order.status} />
                </div>

                {/* Card Body */}
                <div className="lg:px-6 px-4 py-5 border-b border-gray-200">
                  <ul className="flex flex-col gap-y-4">

                    <li className="flex items-center justify-between">
                      <p className="text-gray-600 font-normal inline-flex items-center gap-x-3 text-sm">
                        <CalendarIcon /> Order Date
                      </p>
                      <span className="font-semibold text-gray-800 text-sm">{formatDate(order.orderDate)}</span>
                    </li>

                    <li className="flex items-center justify-between">
                      <p className="text-gray-600 font-normal inline-flex items-center gap-x-3 text-sm">
                        <BoxIcon /> Items
                      </p>
                      <span className="font-semibold text-gray-800 text-sm">
                        {totalItems} {totalItems === 1 ? "Product" : "Products"}
                        {order.items?.length > 0 && (
                          <span className="text-gray-400 font-normal ml-1">
                            ({order.items.map(i => i.name).join(", ")})
                          </span>
                        )}
                      </span>
                    </li>

                    <li className="flex items-center justify-between">
                      <p className="text-gray-600 font-normal inline-flex items-center gap-x-3 text-sm">
                        <TruckIcon /> Delivery
                      </p>
                      <span className="font-semibold text-gray-800 text-sm">
                        {order.shippingAmount === 0
                          ? <span className="text-green-600">Free Delivery</span>
                          : `₹${order.shippingAmount} Shipping`
                        }
                      </span>
                    </li>

                    <li className="flex items-center justify-between">
                      <p className="text-gray-600 font-normal inline-flex items-center gap-x-3 text-sm">
                        <CardIcon /> Amount
                      </p>
                      <p className="font-semibold text-gray-800 text-sm">
                        ₹{order.payAmt?.toFixed(2)}
                        <PaymentBadge order={order} />
                      </p>
                    </li>

                  </ul>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-3 flex items-center justify-between gap-x-3">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="py-[7px] px-5 text-sm leading-[22px] font-semibold rounded-[80px] bg-green-600 text-white hover:bg-green-700 transition-colors"
                  >
                    View Details
                  </button>
                  {/* <button
                    onClick={() => setSelectedOrder(order)}
                    className="py-[7px] px-5 text-sm leading-[22px] font-semibold rounded-[80px] border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    View Details
                  </button>
                  <button className="py-[7px] px-5 text-sm leading-[22px] font-semibold rounded-[80px] bg-green-600 text-white hover:bg-green-700 transition-colors">
                    Order Again
                  </button> */}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default Order;