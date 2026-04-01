import React, { useState, useEffect } from 'react'
import axios from 'axios'

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API_BASE = 'http://localhost:7500/api/v1'
const CART_KEY = 'cart'
const TOKEN_KEY = 'token_login'
const VAT_RATE = 0.18
const COD_FEE = 50

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem(TOKEN_KEY)

const getCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return { items: [], totalAmount: 0, totalquantity: 0, payAmt: 0 }
    return JSON.parse(raw)
  } catch {
    return { items: [], totalAmount: 0, totalquantity: 0, payAmt: 0 }
  }
}

const clearCartStorage = () => localStorage.removeItem(CART_KEY)
const authHeaders = (token) => ({ Authorization: `Bearer ${token}` })

// ─── COMPONENT ────────────────────────────────────────────────────────────────
const Checkout = () => {
  const [cartData, setCartData]             = useState({ items: [], totalAmount: 0, totalquantity: 0 })
  const [user, setUser]                     = useState(null)
  const [isLoggedIn, setIsLoggedIn]         = useState(false)
  const [pageLoading, setPageLoading]       = useState(true)
  const [loading, setLoading]               = useState(false)
  const [orderError, setOrderError]         = useState('')
  const [addressError, setAddressError]     = useState('')
  const [codAdvancePaid, setCodAdvancePaid] = useState(false)

  const [address, setAddress] = useState({
    name: '', city: '', state: '', postCode: '', addressLine: '', addressType: 'Home',
  })

//   const [deliveryTime, setDeliveryTime] = useState('')
  const [shipmentType, setShipmentType] = useState('flat')
  const [paymentMethod, setPaymentMethod] = useState('COD')

  const shippingCost = shipmentType === 'free' ? 0 : 60
  const subtotal     = cartData.totalAmount || 0
  const vat          = parseFloat((subtotal * VAT_RATE).toFixed(2))
  const grandTotal   = parseFloat((subtotal + vat + shippingCost).toFixed(2))

  // ── Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => { if (document.body.contains(script)) document.body.removeChild(script) }
  }, [])

  // ── Mount: load cart + token + user
  useEffect(() => {
    setCartData(getCart())
    const token = getToken()
    if (token) {
      setIsLoggedIn(true)
      fetchUser(token)
    } else {
      setPageLoading(false)
    }
  }, [])

  // ── GET /my-details
  const fetchUser = async (token) => {
    try {
      const { data } = await axios.get(`${API_BASE}/my-details`, { headers: authHeaders(token) })
      const u = data.data
      setUser(u)
      setAddress((prev) => ({ ...prev, name: u?.name || u?.Name || prev.name }))
    } catch (err) {
      console.error('Failed to fetch user:', err)
    } finally {
      setPageLoading(false)
    }
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setAddress((prev) => ({ ...prev, [name]: value }))
    setAddressError('')
    setOrderError('')
  }

  const validateAddress = () => {
    for (const field of ['name', 'city', 'state', 'postCode', 'addressLine', 'addressType']) {
      if (!address[field]?.trim()) {
        setAddressError(`Please fill in all required fields. "${field}" is missing.`)
        return false
      }
    }
    return true
  }

  // ── Build payload — matches your existing backend shape
  const buildOrderPayload = () => ({
    items: cartData.items.map((item) => ({
      product_id:           item.productId,
      product_name:         item.name,
      Qunatity:             item.quantity,
      price_after_discount: item.price,
      Varient_id:           item.Varient_id || 'N/A',
      size:                 item.size       || 'N/A',
    })),
    totalAmount:     subtotal,
    payAmt:          grandTotal,
    paymentType:     paymentMethod,
    isVarientInCart: cartData.items.some((i) => i.Varient_id),
    codFeePaid:      codAdvancePaid || false,
    shipping: {
      ...address,
      mobileNumber: user?.ContactNumber || user?.mobileNumber || '',
      email:        user?.Email         || user?.email         || '',
    },
    shippingAmount: shippingCost,
    // deliveryTime:   deliveryTime,
    vatAmount:      vat,
  })

  const handleOrderSuccess = (redirectUrl) => {
    clearCartStorage()
    window.location.href = redirectUrl || '/order-successful'
  }

  // ══════════════════════════════════════════════════════
  // MAIN: Place Order
  // ══════════════════════════════════════════════════════
  const handlePlaceOrder = async () => {
    if (!isLoggedIn)              { setOrderError('Please login to place an order.'); return }
    if (!validateAddress())        return
    // if (!deliveryTime)             { setAddressError('Please select a delivery time slot.'); return }
    if (cartData.items.length === 0) { setOrderError('Your cart is empty.'); return }

    const token = getToken()
    if (!token) { setOrderError('Session expired. Please login again.'); return }

    setOrderError('')
    setLoading(true)

    const orderData = buildOrderPayload()

    // ────────────────────────────────────────────────────
    // COD FLOW
    // POST /create-cod-order  →  Razorpay ₹50
    // POST /verify-cod-fee    →  verify + place order
    // ────────────────────────────────────────────────────
    if (paymentMethod === 'COD' && !codAdvancePaid) {
      try {
        const res = await axios.post(
          `${API_BASE}/create-cod-order`,
          { amount: COD_FEE, orderData },
          { headers: authHeaders(token) }
        )

        const { razorpayOrderId, amount, currency, rezorPayKey, orderId } = res.data

        const options = {
          key:         rezorPayKey,
          amount:      amount * 100,
          currency:    currency || 'INR',
          name:        'My Store',
          description: `₹${COD_FEE} COD Advance Fee`,
          order_id:    razorpayOrderId,

          handler: function (response) {
            axios
              .post(
                `${API_BASE}/verify-cod-fee`,
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id:   response.razorpay_order_id,
                  razorpay_signature:  response.razorpay_signature,
                  orderId,
                },
                { headers: authHeaders(token) }
              )
              .then((resp) => {
                if (resp.data?.success) {
                  setCodAdvancePaid(true)
                  handleOrderSuccess(resp.data?.redirectUrl)
                } else {
                  setOrderError('COD fee verification failed. Please try again.')
                  setLoading(false)
                }
              })
              .catch(() => {
                setOrderError('COD payment verification failed. Please try again.')
                setLoading(false)
              })
          },

          modal: { ondismiss: () => setLoading(false) },
        }

        const rzp = new window.Razorpay(options)
        rzp.on('payment.failed', () => { setOrderError('Payment failed. Please try again.'); setLoading(false) })
        rzp.open()

      } catch (err) {
        console.error('COD order error:', err)
        setOrderError(err?.response?.data?.message || 'Unable to start COD payment. Please try again.')
        setLoading(false)
      }
      return
    }

    // ────────────────────────────────────────────────────
    // ONLINE PAYMENT FLOW
    // POST /add-order       →  Razorpay full amount
    // POST /verify-payment  →  verify + place order
    // ────────────────────────────────────────────────────
    if (paymentMethod === 'ONLINE') {
      try {
        const res = await axios.post(
          `${API_BASE}/add-order`,
          { orderData },
          { headers: authHeaders(token) }
        )

        const { razorpayOrderId, amount, currency, rezorPayKey } = res.data

        const options = {
          key:         rezorPayKey,
          amount:      amount * 100,
          currency:    currency || 'INR',
          name:        'My Store',
          description: 'Order Payment',
          order_id:    razorpayOrderId,

          prefill: {
            name:    address.name,
            email:   user?.Email        || user?.email    || '',
            contact: user?.ContactNumber || '',
          },

          handler: function (response) {
            axios
              .post(
                `${API_BASE}/verify-payment`,
                {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id:   response.razorpay_order_id,
                  razorpay_signature:  response.razorpay_signature,
                },
                { headers: authHeaders(token) }
              )
              .then((verifyRes) => {
                if (verifyRes.data?.success) {
                  handleOrderSuccess(verifyRes.data?.redirectUrl)
                } else {
                  setOrderError('Payment verification failed. Please try again.')
                  setLoading(false)
                }
              })
              .catch(() => {
                setOrderError('Payment verification failed. Please try again.')
                setLoading(false)
              })
          },

          modal: { ondismiss: () => setLoading(false) },
        }

        const razorpay = new window.Razorpay(options)
        razorpay.on('payment.failed', () => { setOrderError('Payment failed. Please try again.'); setLoading(false) })
        razorpay.open()

      } catch (err) {
        console.error('Online order error:', err)
        setOrderError(err?.response?.data?.message || 'Failed to initiate payment. Please try again.')
        setLoading(false)
      }
      return
    }
  }

  // ─── PAGE LOADER ─────────────────────────────────────────────────────────────
  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-light-secondary-text">Loading checkout...</p>
        </div>
      </div>
    )
  }

  // ─── RENDER ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ========== Breadcrumb ========== */}
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
            <li><a href="/cart">Cart</a></li>
            <li className="text-light-disabled-text">&#8226;</li>
            <li><span className="text-sm leading-[22px]">Checkout</span></li>
          </ul>
        </div>
      </div>

      {/* ========== CHECKOUT BODY ========== */}
      <div className="pb-[70px]">
        <div className="container">

          {/* Not logged in warning */}
          {!isLoggedIn && (
            <div className="mb-6 px-4 py-3 bg-yellow-50 border border-yellow-300 rounded-xl flex items-center gap-x-3">
              <i className="hgi hgi-stroke hgi-alert-02 text-2xl text-yellow-500"></i>
              <p className="text-sm text-yellow-700 font-medium">
                You are not logged in. Please{' '}
                <a href="/login" className="text-primary underline font-semibold">login</a>{' '}
                to place an order.
              </p>
            </div>
          )}

          <div className="grid grid-cols-12 gap-x-6 gap-y-6">

            {/* ════════════ LEFT ════════════ */}
            <div className="xl:col-span-8 col-span-12">
              <div className="flex flex-col gap-y-6">

                {/* User info card */}
                {isLoggedIn && user && (
                  <div className="border border-gray-300 rounded-2xl">
                    <div className="py-4 px-6 bg-gray-200 rounded-t-2xl flex items-center gap-x-2">
                      <i className="hgi hgi-stroke hgi-user-circle text-xl text-primary"></i>
                      <h5>Account</h5>
                    </div>
                    <div className="md:px-6 px-3 py-4 flex items-center gap-x-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <i className="hgi hgi-stroke hgi-user text-2xl text-primary"></i>
                      </div>
                      <div>
                        <p className="font-semibold text-light-primary-text">{user.name || user.Name || 'User'}</p>
                        <p className="text-sm text-light-secondary-text">
                          {user.Email || user.email}
                          {user.ContactNumber && ` • ${user.ContactNumber}`}
                        </p>
                      </div>
                      <span className="ml-auto inline-flex items-center gap-x-1 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        <i className="hgi hgi-stroke hgi-tick-02 text-sm"></i>
                        Logged In
                      </span>
                    </div>
                  </div>
                )}

                {/* ── Shipping Address form */}
                <div className="border border-gray-300 rounded-2xl">
                  <div className="py-4 px-6 bg-gray-200 rounded-t-2xl">
                    <h5>Shipping Address</h5>
                  </div>
                  <div className="md:px-6 px-3 py-6">
                    <div className="flex flex-col gap-y-6">

                      {/* Name */}
                      <div className="relative w-full">
                        <input type="text" id="name" name="name" value={address.name} onChange={handleAddressChange}
                          className="peer form-control input-group medium rounded-[80px] px-3.5 placeholder-transparent focus:placeholder-transparent focus:outline-none"
                          placeholder="Full Name" />
                        <label htmlFor="name" className="absolute left-[14px] top-1/2 -translate-y-1/2 text-xs leading-[18px] transition-all peer-placeholder-shown:text-light-disabled-text peer-focus:text-light-disabled-text peer-placeholder-shown:text-[16px] peer-placeholder-shown:top-1/2 peer-focus:text-[12px] peer-focus:top-0 peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-0 bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:px-1">
                          Full Name *
                        </label>
                      </div>

                      {/* City + State */}
                      <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 md:gap-x-4 gap-y-6">
                        <div className="relative w-full">
                          <input type="text" id="city" name="city" value={address.city} onChange={handleAddressChange}
                            className="peer form-control input-group medium rounded-[80px] px-3.5 placeholder-transparent focus:placeholder-transparent focus:outline-none"
                            placeholder="City" />
                          <label htmlFor="city" className="absolute left-[14px] top-1/2 -translate-y-1/2 text-xs leading-[18px] transition-all peer-placeholder-shown:text-light-disabled-text peer-focus:text-light-disabled-text peer-placeholder-shown:text-[16px] peer-placeholder-shown:top-1/2 peer-focus:text-[12px] peer-focus:top-0 peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-0 bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:px-1">
                            City *
                          </label>
                        </div>
                        <div className="relative w-full">
                          <input type="text" id="state" name="state" value={address.state} onChange={handleAddressChange}
                            className="peer form-control input-group medium rounded-[80px] px-3.5 placeholder-transparent focus:placeholder-transparent focus:outline-none"
                            placeholder="State" />
                          <label htmlFor="state" className="absolute left-[14px] top-1/2 -translate-y-1/2 text-xs leading-[18px] transition-all peer-placeholder-shown:text-light-disabled-text peer-focus:text-light-disabled-text peer-placeholder-shown:text-[16px] peer-placeholder-shown:top-1/2 peer-focus:text-[12px] peer-focus:top-0 peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-0 bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:px-1">
                            State *
                          </label>
                        </div>
                      </div>

                      {/* Pin Code + Address Line */}
                      <div className="grid xl:grid-cols-2 md:grid-cols-2 grid-cols-1 md:gap-x-4 gap-y-6">
                        <div className="relative w-full">
                          <input type="tel" id="postCode" name="postCode" value={address.postCode} onChange={handleAddressChange}
                            className="peer form-control input-group medium rounded-[80px] px-3.5 placeholder-transparent focus:placeholder-transparent focus:outline-none"
                            placeholder="Pin Code" />
                          <label htmlFor="postCode" className="absolute left-[14px] top-1/2 -translate-y-1/2 text-xs leading-[18px] transition-all peer-placeholder-shown:text-light-disabled-text peer-focus:text-light-disabled-text peer-placeholder-shown:text-[16px] peer-placeholder-shown:top-1/2 peer-focus:text-[12px] peer-focus:top-0 peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-0 bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:px-1">
                            Pin Code *
                          </label>
                        </div>
                        <div className="relative w-full">
                          <input type="text" id="addressLine" name="addressLine" value={address.addressLine} onChange={handleAddressChange}
                            className="peer form-control input-group medium rounded-[80px] px-3.5 placeholder-transparent focus:placeholder-transparent focus:outline-none"
                            placeholder="Address Line" />
                          <label htmlFor="addressLine" className="absolute left-[14px] top-1/2 -translate-y-1/2 text-xs leading-[18px] transition-all peer-placeholder-shown:text-light-disabled-text peer-focus:text-light-disabled-text peer-placeholder-shown:text-[16px] peer-placeholder-shown:top-1/2 peer-focus:text-[12px] peer-focus:top-0 peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-0 bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:px-1">
                            Address Line (Flat, Area, Street) *
                          </label>
                        </div>
                      </div>

                      {/* Delivery Time */}
                      {/* <div className="pb-6 border-b border-b-gray-300">
                        <p className="font-semibold text-light-disabled-text mb-3">Delivery Time *</p>
                        <div className="flex flex-col lg:flex-row flex-wrap gap-y-3 gap-x-4">
                          {['08:00 AM - 11:00 AM', '11:00 AM - 02:00 PM', '02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM'].map((slot) => (
                            <label key={slot} className="flex items-center cursor-pointer">
                              <span className="has-[input:checked]:hover:bg-[#00AB55]/8 flex items-center justify-center w-10 h-10 bg-transparent rounded-full hover:bg-[#919EAB]/8 transition-colors duration-300 ease-in-out">
                                <span className="relative inline-flex w-5 h-5 items-center justify-center">
                                  <input type="radio" name="delivery-time" value={slot}
                                    checked={deliveryTime === slot}
                                    onChange={(e) => { setDeliveryTime(e.target.value); setAddressError('') }}
                                    className="peer appearance-none w-full h-full border-2 focus:outline-none checked:border-primary border-gray-300 rounded-full bg-white transition-all" />
                                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary opacity-0 scale-0 peer-checked:opacity-100 peer-checked:scale-100 transition-all"></span>
                                </span>
                              </span>
                              <span className="text-light-primary-text text-sm leading-[22px] font-normal">{slot}</span>
                            </label>
                          ))}
                        </div>
                      </div> */}

                      {/* Shipment Type */}
                      <div className="pb-6 border-b border-b-gray-300">
                        <p className="font-semibold text-light-disabled-text mb-3">Shipment Type</p>
                        <div className="flex flex-col md:flex-row gap-y-3 gap-x-6">
                          {[{ value: 'flat', label: 'Flat Rate (₹60)' }, { value: 'free', label: 'Free Shipment' }].map(({ value, label }) => (
                            <label key={value} className="flex items-center cursor-pointer">
                              <span className="has-[input:checked]:hover:bg-[#00AB55]/8 flex items-center justify-center w-10 h-10 bg-transparent rounded-full hover:bg-[#919EAB]/8 transition-colors duration-300 ease-in-out">
                                <span className="relative inline-flex w-5 h-5 items-center justify-center">
                                  <input type="radio" name="shipping-method" value={value}
                                    checked={shipmentType === value}
                                    onChange={(e) => setShipmentType(e.target.value)}
                                    className="peer appearance-none w-full h-full border-2 focus:outline-none checked:border-primary border-gray-300 rounded-full bg-white transition-all" />
                                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary opacity-0 scale-0 peer-checked:opacity-100 peer-checked:scale-100 transition-all"></span>
                                </span>
                              </span>
                              <span className="text-light-primary-text text-sm leading-[22px] font-normal">{label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Address Type */}
                      <div className="pb-2">
                        <p className="font-semibold text-light-disabled-text mb-3">Address Type *</p>
                        <div className="flex flex-col lg:flex-row gap-y-3 gap-x-6">
                          {['Home', 'Office', 'Others'].map((type) => (
                            <label key={type} className="flex items-center cursor-pointer">
                              <span className="has-[input:checked]:hover:bg-[#00AB55]/8 flex items-center justify-center w-10 h-10 bg-transparent rounded-full hover:bg-[#919EAB]/8 transition-colors duration-300 ease-in-out">
                                <span className="relative inline-flex w-5 h-5 items-center justify-center">
                                  <input type="radio" name="address-type" value={type}
                                    checked={address.addressType === type}
                                    onChange={() => setAddress((prev) => ({ ...prev, addressType: type }))}
                                    className="peer appearance-none w-full h-full border-2 focus:outline-none checked:border-primary border-gray-300 rounded-full bg-white transition-all" />
                                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary opacity-0 scale-0 peer-checked:opacity-100 peer-checked:scale-100 transition-all"></span>
                                </span>
                              </span>
                              <span className="text-light-primary-text text-sm leading-[22px] font-normal">{type} Address</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Address error */}
                      {addressError && (
                        <div className="flex items-center gap-x-2 text-error text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                          <i className="hgi hgi-stroke hgi-alert-circle text-lg flex-shrink-0"></i>
                          {addressError}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Payment Method */}
                <div className="border border-gray-300 rounded-2xl">
                  <div className="py-4 px-6 bg-gray-200 rounded-t-2xl">
                    <h5 className="text-light-primary-text">Payment Method</h5>
                  </div>
                  <div className="md:px-6 px-3 py-6">
                    <div className="flex flex-col gap-y-4">

                      {/* COD */}
                      <div onClick={() => setPaymentMethod('COD')}
                        className={`border rounded-2xl px-4 py-4 cursor-pointer transition-all duration-200 ${paymentMethod === 'COD' ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}`}>
                        <div className="flex items-center gap-x-3">
                          <span className="relative inline-flex w-5 h-5 items-center justify-center flex-shrink-0">
                            <input type="radio" name="payment-method" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')}
                              className="peer appearance-none w-full h-full border-2 focus:outline-none checked:border-primary border-gray-300 rounded-full bg-white transition-all" />
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary opacity-0 scale-0 peer-checked:opacity-100 peer-checked:scale-100 transition-all"></span>
                          </span>
                          <span className="inline-flex items-center justify-center w-10 h-10 bg-warning-lighter rounded-full flex-shrink-0">
                            <i className="hgi hgi-stroke hgi-money-bag-01 text-xl text-light-primary-text"></i>
                          </span>
                          <div className="flex-1">
                            <p className="font-semibold text-light-primary-text">Cash on Delivery</p>
                            <p className="text-xs text-light-secondary-text mt-0.5">Pay ₹{COD_FEE} advance via Razorpay. Rest on delivery.</p>
                          </div>
                          {paymentMethod === 'COD' && (
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">Selected</span>
                          )}
                        </div>
                      </div>

                      {/* ONLINE */}
                      <div onClick={() => setPaymentMethod('ONLINE')}
                        className={`border rounded-2xl px-4 py-4 cursor-pointer transition-all duration-200 ${paymentMethod === 'ONLINE' ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}`}>
                        <div className="flex items-center gap-x-3">
                          <span className="relative inline-flex w-5 h-5 items-center justify-center flex-shrink-0">
                            <input type="radio" name="payment-method" value="ONLINE" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')}
                              className="peer appearance-none w-full h-full border-2 focus:outline-none checked:border-primary border-gray-300 rounded-full bg-white transition-all" />
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary opacity-0 scale-0 peer-checked:opacity-100 peer-checked:scale-100 transition-all"></span>
                          </span>
                          <span className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full flex-shrink-0">
                            <i className="hgi hgi-stroke hgi-credit-card text-xl text-primary"></i>
                          </span>
                          <div className="flex-1">
                            <p className="font-semibold text-light-primary-text">Online Payment</p>
                            <p className="text-xs text-light-secondary-text mt-0.5">Pay securely via Razorpay — UPI, Card, Net Banking &amp; more.</p>
                          </div>
                          {paymentMethod === 'ONLINE' && (
                            <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">Selected</span>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ════════════ RIGHT — ORDER SUMMARY ════════════ */}
            <div className="xl:col-span-4 col-span-12">
              <div className="border border-gray-300 rounded-2xl md:px-6 md:py-6 px-3 py-4 flex flex-col gap-y-6 sticky top-5">

                <h5 className="text-light-primary-text">
                  Cart Items
                  <span className="ml-2 text-sm font-normal text-light-secondary-text">
                    ({cartData.totalquantity || 0} items)
                  </span>
                </h5>

                {cartData.items.length === 0 ? (
                  <div className="text-center py-6 text-light-secondary-text">
                    <i className="hgi hgi-stroke hgi-shopping-cart-01 text-4xl mb-2 block"></i>
                    <p className="text-sm">No items in cart</p>
                  </div>
                ) : (
                  <div className="border border-gray-300 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
                    <table className="w-full cart-items-table">
                      <tbody>
                        {cartData.items.map((item) => (
                          <tr key={item.Varient_id} className="border-b border-gray-100 last:border-0">
                            <td className="py-3 px-3">
                              <div className="w-[52px] h-[52px] rounded-xl bg-[#F4F3F5] overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={item.name}
                                  className="w-full h-full object-cover rounded-xl"
                                  onError={(e) => { e.target.src = 'https://placehold.co/52x52?text=N/A' }} />
                              </div>
                            </td>
                            <td className="py-3 pr-3 align-middle w-full">
                              <div className="flex flex-col gap-y-1">
                                <p className="text-light-primary-text font-semibold text-sm truncate max-w-[160px]">{item.name}</p>
                                <div className="flex items-center justify-between">
                                  <p className="text-xs text-light-secondary-text">
                                    {item.quantity} x {item.size && item.size !== 'default' ? item.size : 'Default'}
                                  </p>
                                  <span className="text-primary font-semibold text-sm">
                                    ₹{(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Order Summary */}
                <div className="bg-gray-100 md:px-5 px-4 py-5 rounded-2xl">
                  <h5 className="mb-4">Order Summary</h5>
                  <div className="flex flex-col gap-y-3 pb-4 border-b border-gray-300">
                    <p className="flex items-center justify-between text-sm">
                      Sub-Total <span className="text-gray-900 font-semibold">₹{subtotal.toFixed(2)}</span>
                    </p>
                    <p className="flex items-center justify-between text-sm">
                      VAT (18%) <span className="text-gray-900">₹{vat.toFixed(2)}</span>
                    </p>
                    <p className="flex items-center justify-between text-sm">
                      Shipping
                      <span className={shippingCost === 0 ? 'text-primary font-semibold' : 'text-gray-900'}>
                        {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
                      </span>
                    </p>
                    {paymentMethod === 'COD' && (
                      <p className="flex items-center justify-between text-sm">
                        COD Advance <span className="text-gray-900">₹{COD_FEE}.00</span>
                      </p>
                    )}
                  </div>
                  <h6 className="flex items-center justify-between text-light-primary-text pt-4">
                    Grand Total
                    <span className="text-primary font-bold text-lg">₹{grandTotal.toFixed(2)}</span>
                  </h6>
                </div>

                {/* Order error */}
                {orderError && (
                  <div className="flex items-start gap-x-2 text-error text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <i className="hgi hgi-stroke hgi-alert-circle text-lg mt-0.5 flex-shrink-0"></i>
                    <span>{orderError}</span>
                  </div>
                )}

                {/* Place Order button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || !isLoggedIn || cartData.items.length === 0}
                  className={`btn btn-primary py-3 rounded-[80px] w-full flex items-center justify-center gap-x-2 transition-opacity ${
                    loading || !isLoggedIn || cartData.items.length === 0 ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : paymentMethod === 'COD' ? (
                    <>
                      <i className="hgi hgi-stroke hgi-money-bag-01 text-xl"></i>
                      Pay ₹{COD_FEE} &amp; Place Order (COD)
                    </>
                  ) : (
                    <>
                      <i className="hgi hgi-stroke hgi-credit-card text-xl"></i>
                      Pay ₹{grandTotal.toFixed(2)} Online
                    </>
                  )}
                </button>

                <a href="/cart"
                  className="btn btn-default outline shadow-none w-full py-[11px] rounded-[80px] inline-flex items-center justify-center gap-x-1">
                  <i className="hgi hgi-stroke hgi-arrow-left-02 text-[22px] leading-[22px]"></i>
                  Back to Cart
                </a>

                <div className="flex items-center justify-center gap-x-2 text-xs text-light-secondary-text">
                  <i className="hgi hgi-stroke hgi-shield-01 text-base text-primary"></i>
                  Secured by Razorpay &bull; 256-bit SSL encryption
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Checkout