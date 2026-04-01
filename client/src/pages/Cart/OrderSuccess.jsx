import React, { useEffect, useState } from 'react'
import axios from 'axios'

const API_BASE  = 'http://localhost:7500/api/v1'
const TOKEN_KEY = 'token_login'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem(TOKEN_KEY)

const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  confirmed:       { bg: 'rgba(255,193,7,0.16)',  color: '#b45309', label: 'Confirmed'       },
  processing:      { bg: 'rgba(255,193,7,0.16)',  color: '#b45309', label: 'Processing'      },
  delivering:      { bg: 'rgba(24,144,255,0.16)', color: '#1d4ed8', label: 'Delivering'      },
  completed:       { bg: 'rgba(84,214,44,0.16)',  color: '#15803d', label: 'Completed'       },
  cancelled:       { bg: 'rgba(255,72,66,0.16)',  color: '#b91c1c', label: 'Cancelled'       },
  payment_failed:  { bg: 'rgba(255,72,66,0.16)',  color: '#b91c1c', label: 'Payment Failed'  },
}

const StatusPill = ({ status = '' }) => {
  const cfg = STATUS_CONFIG[status.toLowerCase()] || { bg: 'rgba(0,0,0,0.08)', color: '#333', label: status }
  return (
    <span
      style={{ backgroundColor: cfg.bg, color: cfg.color }}
      className="inline-flex items-center justify-center py-1.5 px-4 text-xs font-semibold rounded-full"
    >
      {cfg.label}
    </span>
  )
}

// ─── Reusable Row ─────────────────────────────────────────────────────────────
const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
    <span className="text-sm text-light-secondary-text">{label}</span>
    <span className="text-sm font-semibold text-light-primary-text text-right max-w-[60%]">{value}</span>
  </div>
)

// ─── Payment Failed UI ────────────────────────────────────────────────────────
const PaymentFailedView = ({ order }) => {
  const isCOD    = order?.paymentType === 'COD'
  const shipping = order?.shipping || {}
  const items    = order?.items    || []

  return (
    <section className="pb-[70px]">
      <div className="container">

        {/* Hero — Failed */}
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-5">
            <i className="hgi hgi-stroke hgi-cancel-circle text-5xl text-error"></i>
          </div>
          <h2 className="mb-3 text-light-primary-text">Payment Failed 😔</h2>
          <p className="md:w-[440px] w-[96%] text-center text-light-secondary-text mb-4">
            {isCOD
              ? 'Your COD advance payment could not be verified. Your order has not been placed. Please try again.'
              : 'Your payment could not be verified. Your order has not been placed. Please try again.'
            }
          </p>

          {order?.orderId && (
            <p className="text-sm mb-4">
              <span className="text-light-secondary-text">Order Ref: </span>
              <span className="font-semibold text-light-primary-text">{order.orderId}</span>
            </p>
          )}

          <StatusPill status={order?.status || 'payment_failed'} />
        </div>

        {/* Attempt Summary (if order data available) */}
        {order && (
          <div className="max-w-lg mx-auto flex flex-col gap-y-5 mb-10">

            {/* Items attempted */}
            {items.length > 0 && (
              <div className="border border-red-100 rounded-2xl overflow-hidden">
                <div className="py-4 px-6 bg-red-50 rounded-t-2xl">
                  <h5 className="text-error">Items in your order</h5>
                </div>
                <div className="divide-y divide-gray-100">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-x-4 px-5 py-4">
                      <div className="w-10 h-10 rounded-xl bg-[#F4F3F5] flex items-center justify-center flex-shrink-0">
                        <i className="hgi hgi-stroke hgi-package text-lg text-light-secondary-text"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-light-primary-text text-sm truncate">{item.name}</p>
                        <p className="text-xs text-light-secondary-text mt-0.5">
                          Size: {item.size && item.size !== 'default' ? item.size : 'Default'}
                          &nbsp;•&nbsp;Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-sm text-light-primary-text flex-shrink-0">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-light-secondary-text">Total Attempted</span>
                  <span className="font-bold text-error">₹{order.payAmt?.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* What to do next */}
            <div className="border border-gray-300 rounded-2xl px-5 py-5">
              <p className="font-semibold text-light-primary-text mb-3">What can you do?</p>
              <ul className="flex flex-col gap-y-2">
                {[
                  'Check your bank/UPI app for any deducted amount.',
                  'If money was deducted, it will be refunded within 5-7 business days.',
                  'Try placing the order again from your cart.',
                  'Contact support if the problem persists.',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-x-2 text-sm text-light-secondary-text">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="/cart" className="btn btn-primary btn-large rounded-[80px] px-8 py-[11px] inline-flex items-center gap-x-2">
            <i className="hgi hgi-stroke hgi-shopping-cart-01 text-xl"></i>
            Try Again
          </a>
          <a href="/" className="btn btn-default outline shadow-none rounded-[80px] px-8 py-[11px] inline-flex items-center gap-x-2">
            <i className="hgi hgi-stroke hgi-home-01 text-xl"></i>
            Back to Home
          </a>
        </div>

      </div>
    </section>
  )
}

// ─── Payment Success UI ───────────────────────────────────────────────────────
const PaymentSuccessView = ({ order }) => {
  const isCOD    = order.paymentType === 'COD'
  const isPaid   = order.payment?.isPaid
  const shipping = order.shipping || {}
  const items    = order.items    || []

  return (
    <section className="pb-[70px]">
      <div className="container">

        {/* Hero */}
        <div className="flex flex-col items-center justify-center text-center mb-10">
          <div className="mb-6">
            <img
              src="assets/images/order-success-Illustration.png"
              alt="order-success"
              className="mx-auto max-w-[260px] w-full"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <i className="hgi hgi-stroke hgi-checkmark-circle-01 text-5xl text-primary"></i>
          </div>
          <h2 className="mb-3 text-light-primary-text">Order Placed Successfully! 🎉</h2>
          <p className="md:w-[420px] w-[96%] text-center text-light-secondary-text mb-2">
            Thank you <strong>{shipping.name}</strong>! We've received your order and it's being processed.
          </p>
          <p className="text-sm font-semibold mb-4">
            <span className="text-light-secondary-text">Order ID: </span>
            <span className="text-light-primary-text">{order.orderId}</span>
          </p>
          <StatusPill status={order.status} />
        </div>

        {/* Detail Grid */}
        <div className="grid grid-cols-12 gap-x-6 gap-y-6 max-w-4xl mx-auto">

          {/* Items + Price */}
          <div className="md:col-span-7 col-span-12">
            <div className="border border-gray-300 rounded-2xl overflow-hidden">
              <div className="py-4 px-6 bg-gray-200 rounded-t-2xl">
                <h5 className="text-light-primary-text">Items Ordered</h5>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-x-4 px-5 py-4">
                    <div className="w-12 h-12 rounded-xl bg-[#F4F3F5] flex items-center justify-center flex-shrink-0">
                      <i className="hgi hgi-stroke hgi-package text-xl text-light-secondary-text"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-light-primary-text text-sm truncate">{item.name}</p>
                      <p className="text-xs text-light-secondary-text mt-0.5">
                        Size: {item.size && item.size !== 'default' ? item.size : 'Default'}
                        &nbsp;•&nbsp;Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-primary text-sm flex-shrink-0">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="bg-gray-50 px-5 py-4 border-t border-gray-200">
                <InfoRow label="Sub-Total" value={`₹${order.totalAmount?.toFixed(2)}`} />
                <InfoRow label="VAT"       value={`₹${order.vatAmount?.toFixed(2)}`} />
                <InfoRow
                  label="Shipping"
                  value={order.shippingAmount === 0 ? 'FREE' : `₹${order.shippingAmount?.toFixed(2)}`}
                />
                {isCOD && order.codFeePaid && (
                  <InfoRow label="COD Advance Paid" value={`₹${order.codFeeAmount?.toFixed(2)}`} />
                )}
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-200">
                  <span className="font-bold text-light-primary-text">Grand Total</span>
                  <span className="font-bold text-primary text-lg">₹{order.payAmt?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="md:col-span-5 col-span-12 flex flex-col gap-y-6">

            {/* Payment Info */}
            <div className="border border-gray-300 rounded-2xl overflow-hidden">
              <div className="py-4 px-6 bg-gray-200 rounded-t-2xl">
                <h5 className="text-light-primary-text">Payment Info</h5>
              </div>
              <div className="px-5 py-4">
                <InfoRow
                  label="Method"
                  value={isCOD ? 'Cash on Delivery' : 'Online (Razorpay)'}
                />
                <InfoRow
                  label="Status"
                  value={
                    isCOD
                      ? (order.codFeePaid ? '₹50 Advance Paid · Pay rest on delivery' : 'Pay on delivery')
                      : (isPaid ? 'Paid ✓' : 'Pending')
                  }
                />
                {order.payment?.transactionId && (
                  <InfoRow label="Txn ID" value={order.payment.transactionId} />
                )}
                {isCOD && order.codFeePaymentId && (
                  <InfoRow label="Advance Txn ID" value={order.codFeePaymentId} />
                )}
                <InfoRow label="Order Date" value={formatDate(order.orderDate)} />
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border border-gray-300 rounded-2xl overflow-hidden">
              <div className="py-4 px-6 bg-gray-200 rounded-t-2xl">
                <h5 className="text-light-primary-text">Delivery Address</h5>
              </div>
              <div className="px-5 py-4">
                <div className="flex items-start gap-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="hgi hgi-stroke hgi-location-01 text-xl text-primary"></i>
                  </div>
                  <div>
                    <p className="font-semibold text-light-primary-text">{shipping.name}</p>
                    <p className="text-sm text-light-secondary-text mt-1 leading-relaxed">
                      {shipping.addressLine},<br />
                      {shipping.city}, {shipping.state} – {shipping.postCode}
                    </p>
                    <p className="text-sm text-light-secondary-text mt-1">📞 {shipping.mobileNumber}</p>
                    {shipping.addressType && (
                      <span className="inline-block mt-2 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        {shipping.addressType}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <a href="/orders" className="btn btn-default outline shadow-none rounded-[80px] px-8 py-[11px] inline-flex items-center gap-x-2">
            <i className="hgi hgi-stroke hgi-package text-xl"></i>
            View My Orders
          </a>
          <a href="/" className="btn btn-primary btn-large rounded-[80px] px-8 py-[11px] inline-flex items-center gap-x-2">
            <i className="hgi hgi-stroke hgi-home-01 text-xl"></i>
            Back to Home
          </a>
        </div>

      </div>
    </section>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
const OrderSuccess = () => {
  const [orderId, setOrderId] = useState(null)
  const [order, setOrder]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // ── Step 1: extract order ID from URL
  // Supports: ?order_id=  ?id=  ?orderId=  ?data=
  useEffect(() => {
    try {
      const params  = new URLSearchParams(window.location.search)
      const idParam =
        params.get('order_id') ||   // ← backend sends this on failure
        params.get('id')       ||   // ← backend sends this on success
        params.get('orderId')  ||
        params.get('data')

      if (idParam) {
        setOrderId(idParam)
      } else {
        setError('Order ID not found in URL.')
        setLoading(false)
      }
    } catch {
      setError('Unable to read URL parameters.')
      setLoading(false)
    }
  }, [])

  // ── Step 2: fetch order details
  useEffect(() => {
    if (!orderId) return

    const fetchOrder = async () => {
      setLoading(true)
      setError(null)
      try {
        const token   = getToken()
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        const resp    = await axios.get(
          `${API_BASE}/my-recent-order/${encodeURIComponent(orderId)}`,
          { headers }
        )
        const data = resp.data
        // Support both { data: {...} } and { order: {...} }
        setOrder(data?.data || data?.order || null)
        if (!data?.data && !data?.order) {
          setError(data?.message || 'Order not found.')
        }
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Session expired. Please login to view this order.')
        } else {
          setError(err.response?.data?.message || 'Failed to load order details.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  // ─── Breadcrumb (shared) ──────────────────────────────────────────────────────
  const Breadcrumb = ({ label }) => (
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
          <li><span className="text-sm leading-[22px]">{label}</span></li>
        </ul>
      </div>
    </div>
  )

  // ─── LOADING ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-light-secondary-text text-sm">Loading your order...</p>
      </div>
    )
  }

  // ─── FETCH ERROR (network/auth) ───────────────────────────────────────────────
  if (error && !order) {
    return (
      <>
        <Breadcrumb label="Order" />
        <section className="pb-[70px]">
          <div className="container">
            <div className="flex flex-col items-center justify-center text-center gap-y-4 py-16">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                <i className="hgi hgi-stroke hgi-cancel-circle text-4xl text-error"></i>
              </div>
              <h3 className="text-light-primary-text">Something went wrong</h3>
              <p className="text-light-secondary-text max-w-sm">{error}</p>
              <div className="flex items-center gap-x-4 mt-2">
                <a href="/login"  className="btn btn-primary rounded-[80px] px-6 py-2.5">Login</a>
                <a href="/"       className="btn btn-default outline shadow-none rounded-[80px] px-6 py-2.5">Back to Home</a>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }

  // ─── PAYMENT FAILED (order fetched but status = payment_failed) ───────────────
  const isPaymentFailed = order?.status?.toLowerCase() === 'payment_failed'

  return (
    <>
      <Breadcrumb label={isPaymentFailed ? 'Payment Failed' : 'Order Successful'} />
      {isPaymentFailed
        ? <PaymentFailedView order={order} />
        : <PaymentSuccessView order={order} />
      }
    </>
  )
}

export default OrderSuccess