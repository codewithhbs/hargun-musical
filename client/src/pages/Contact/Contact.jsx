import React, { useState } from "react";
import Subscribe from "../../components/Subscribe/Subscribe";
import axios from "axios";

const API_BASE = "http://localhost:7500/api/v1";

// ─── Static Data ──────────────────────────────────────────────────────────────
const contactInfo = [
  {
    icon: "hgi-mail-02",
    label: "Email",
    value: "support@hargunmusicals.com",
    delay: ".2s",
  },
  {
    icon: "hgi-customer-support",
    label: "Phone",
    value: "+91 99713 04667",
    delay: ".3s",
  },
  {
    icon: "hgi-location-06",
    label: "Address",
    value: "Shop No.34, Main Market Marg, Near Ram Leela Ground, Block 8, Press Colony, Subhash Nagar, New Delhi, Delhi - 110027",
    delay: ".4s",
  },
  {
    icon: "hgi-internet",
    label: "Website",
    value: "www.hargunmusicals.com",
    delay: ".5s",
  },
];

const faqData = [
  {
    q: "1. What types of musical instruments do you sell?",
    a: "At Hargun Musicals, we stock a wide range of instruments including guitars (acoustic, electric, and bass), keyboards, digital pianos, synthesizers, drum kits (acoustic and electronic), wind instruments (flutes, saxophones, trumpets), and string instruments (violins, cellos, ukuleles). We carry top brands like Fender, Gibson, Yamaha, Roland, Korg, and many more.",
  },
  {
    q: "2. Do you offer guidance for beginners choosing their first instrument?",
    a: "Absolutely! Our team of music experts is happy to help you choose the right instrument based on your skill level, musical interest, and budget. You can reach us via phone, email, or visit our store in New Delhi. We also provide product comparisons and beginner guides on our website to help you make a confident decision.",
  },
  {
    q: "3. What payment methods do you accept?",
    a: "We accept all major payment methods including Credit/Debit Cards, Net Banking, UPI (Google Pay, PhonePe, Paytm), and Cash on Delivery for eligible orders. All online transactions are secured with SSL encryption for your safety.",
  },
  {
    q: "4. How long will it take to receive my instrument?",
    a: "Standard delivery across India takes 3–7 business days depending on your location. Metro cities like Delhi, Mumbai, and Bangalore typically receive orders within 2–4 business days. You will receive a tracking link via SMS and email once your order is dispatched.",
  },
  {
    q: "5. Can I return or exchange an instrument?",
    a: "Yes! We offer a hassle-free 30-day return and exchange policy. If you are not completely satisfied with your instrument, you can return it in its original condition and packaging. Please ensure the instrument has not been damaged or tampered with. Contact our support team to initiate a return.",
  },
  {
    q: "6. Do you ship internationally?",
    a: "Currently, Hargun Musicals delivers across all states in India. We are working on expanding our services to international customers soon. If you are outside India and interested in placing an order, please contact us directly at support@hargunmusicals.com and we will do our best to assist you.",
  },
];

// ─── Toast Component ──────────────────────────────────────────────────────────
const Toast = ({ toast }) => {
  if (!toast) return null
  const isSuccess = toast.type === 'success'
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-x-3 px-5 py-4 rounded-2xl shadow-lg text-white text-sm font-medium transition-all duration-300 ${isSuccess ? 'bg-primary' : 'bg-error'}`}>
      <i className={`hgi hgi-stroke text-xl ${isSuccess ? 'hgi-checkmark-circle-01' : 'hgi-alert-circle'}`}></i>
      {toast.message}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
const Contact = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  // ── Form state — matches backend fields exactly
  const [formData, setFormData] = useState({
    name: "",      // first + last combined on submit
    firstName: "",
    lastName: "",
    email: "",
    Phone: "",
    subject: "",
    message: "",
  })

  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [toast, setToast]     = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    // clear error on change
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: '' }))
  }

  // ── Validation
  const validate = () => {
    const newErrors = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim())  newErrors.lastName  = 'Last name is required'
    if (!formData.email.trim())     newErrors.email     = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email'
    if (!formData.Phone.trim())     newErrors.Phone     = 'Phone number is required'
    if (!formData.message.trim())   newErrors.message   = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ── Submit
  const handleSubmit = async () => {
    if (!validate()) return

    setLoading(true)
    try {
      const payload = {
        name:    `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        email:   formData.email,
        Phone:   formData.Phone,
        subject: formData.subject,
        message: formData.message,
      }

      const res = await axios.post(`${API_BASE}/support-request`, payload)
      showToast(res.data?.message || 'Message sent successfully!', 'success')

      // Reset form
      setFormData({ name: '', firstName: '', lastName: '', email: '', Phone: '', subject: '', message: '' })
      setErrors({})

    } catch (error) {
      console.error(error)
      showToast(
        error?.response?.data?.message || 'Something went wrong. Please try again.',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Toast */}
      <Toast toast={toast} />

      {/* ── Breadcrumb ── */}
      <div className="py-12">
        <div className="container">
          <div className="breadcrumb">
            <ul>
              <li>
                <a href="/">
                  <span><i className="hgi hgi-stroke hgi-home-01 text-[20px]"></i></span>
                  Home
                </a>
              </li>
              <li className="text-light-disabled-text">&#8226;</li>
              <li><span>Contact Us</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Contact Info Cards ── */}
      <section className="pb-[70px]">
        <div className="container">
          <div className="text-center">
            <h3 className="pb-3 wow animate__animated animate__fadeInUp" data-wow-delay=".2s">
              We are here to help you find your sound
            </h3>
            <p className="pb-10 wow animate__animated animate__fadeInUp" data-wow-delay=".2s">
              Have a question about an instrument, order, or anything else? The Hargun Musicals team is always ready to assist.
            </p>
          </div>
          <div className="grid grid-cols-12 gap-6">
            {contactInfo.map((item, i) => (
              <div
                key={i}
                className="md:col-span-6 col-span-12 xl:col-span-3 border-gray-300 border p-6 rounded-2xl wow animate__animated animate__fadeInUp"
                data-wow-delay={item.delay}
              >
                <span className="inline-flex items-center justify-center size-12 bg-[#919EAB14] rounded-full">
                  <i className={`hgi hgi-stroke ${item.icon} text-2xl text-light-primary-text`}></i>
                </span>
                <p className="pt-4 pb-0.5 font-semibold text-light-primary-text">{item.label}</p>
                <p>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact Form Section ── */}
      <section className="mb-[70px]">
        <div className="lg:bg-white bg-[#9EE872] py-12 lg:pt-0 lg:pb-[23px] text-center lg:max-w-[704px] mx-auto lg:rounded-[164px] lg:-mb-[103px] relative z-10 lg:before:bg-[#9EE872] lg:after:bg-[#9EE872] lg:before:absolute lg:before:bottom-0 lg:before:left-0 lg:before:h-full lg:before:w-[145px] lg:before:bg-[url('../images/slider-left-shape.png')] lg:before:bg-no-repeat lg:before:z-11 lg:after:absolute lg:after:bottom-0 lg:after:right-0 lg:after:h-full lg:after:w-[145px] lg:after:bg-[url('../images/slider-right-shape.png')] lg:after:bg-no-repeat lg:after:z-11">
          <h3 className="mb-2 wow animate__animated animate__fadeInUp" data-wow-delay=".2s">
            Get in Touch with Hargun Musicals
          </h3>
          <p className="wow animate__animated animate__fadeInUp" data-wow-delay=".2s">
            Whether you need instrument advice or order help — we would love to hear from you!
          </p>
        </div>

        <div className="xl:max-w-[1728px] w-full mx-auto relative bg-[#9EE872] xl:rounded-5xl pb-12 lg:pt-[172px]">
          <div className="container">
            <div className="grid grid-cols-12 gap-6">
              <div
                className="lg:col-start-2 md:col-start-2 col-start-1 xl:col-end-12 md:col-end-12 col-end-13 bg-white rounded-2xl wow animate__animated animate__fadeInUp"
                data-wow-delay=".2s"
              >
                <div className="lg:p-10 p-5">

                  {/* Row 1: First Name + Last Name */}
                  <div className="md:flex gap-x-4 pb-6">

                    {/* First Name */}
                    <div className="md:w-1/2 w-full wow animate__animated animate__fadeInUp" data-wow-delay=".2s">
                      <div className="relative w-full">
                        <input
                          type="text"
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className={`peer form-control input-group medium rounded-[80px] px-3.5 placeholder-transparent focus:placeholder-transparent focus:outline-none ${errors.firstName ? 'border-error' : ''}`}
                          placeholder="First Name"
                        />
                        <label htmlFor="firstName" className="absolute left-[14px] top-1/2 -translate-y-1/2 text-xs leading-[18px] transition-all peer-placeholder-shown:text-light-disabled-text peer-placeholder-shown:text-[16px] peer-placeholder-shown:top-1/2 peer-focus:text-[12px] peer-focus:top-0 peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-0 bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:px-1">
                          First Name *
                        </label>
                      </div>
                      {errors.firstName && <p className="text-error text-xs mt-1.5 pl-3">{errors.firstName}</p>}
                    </div>

                    {/* Last Name */}
                    <div className="md:w-1/2 w-full pt-6 md:pt-0 wow animate__animated animate__fadeInUp" data-wow-delay=".3s">
                      <div className="relative w-full">
                        <input
                          type="text"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className={`peer form-control input-group medium rounded-[80px] px-3.5 placeholder-transparent focus:placeholder-transparent focus:outline-none ${errors.lastName ? 'border-error' : ''}`}
                          placeholder="Last Name"
                        />
                        <label htmlFor="lastName" className="absolute left-[14px] top-1/2 -translate-y-1/2 text-xs leading-[18px] transition-all peer-placeholder-shown:text-light-disabled-text peer-placeholder-shown:text-[16px] peer-placeholder-shown:top-1/2 peer-focus:text-[12px] peer-focus:top-0 peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-0 bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:px-1">
                          Last Name *
                        </label>
                      </div>
                      {errors.lastName && <p className="text-error text-xs mt-1.5 pl-3">{errors.lastName}</p>}
                    </div>

                  </div>

                  {/* Row 2: Phone + Email */}
                  <div className="md:flex gap-x-4 pb-6 wow animate__animated animate__fadeInUp" data-wow-delay=".2s">

                    {/* Phone */}
                    <div className="md:w-1/2 w-full">
                      <div className="relative w-full">
                        <input
                          type="tel"
                          id="Phone"
                          value={formData.Phone}
                          onChange={handleChange}
                          className={`peer form-control input-group medium rounded-[80px] px-3.5 placeholder-transparent focus:placeholder-transparent focus:outline-none ${errors.Phone ? 'border-error' : ''}`}
                          placeholder="Phone Number"
                        />
                        <label htmlFor="Phone" className="absolute left-[14px] top-1/2 -translate-y-1/2 text-xs leading-[18px] transition-all peer-placeholder-shown:text-light-disabled-text peer-placeholder-shown:text-[16px] peer-placeholder-shown:top-1/2 peer-focus:text-[12px] peer-focus:top-0 peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-0 bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:px-1">
                          Phone Number *
                        </label>
                      </div>
                      {errors.Phone && <p className="text-error text-xs mt-1.5 pl-3">{errors.Phone}</p>}
                    </div>

                    {/* Email */}
                    <div className="md:w-1/2 w-full pt-6 md:pt-0">
                      <div className="relative w-full">
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`peer form-control input-group medium rounded-[80px] px-3.5 placeholder-transparent focus:placeholder-transparent focus:outline-none ${errors.email ? 'border-error' : ''}`}
                          placeholder="Email Address"
                        />
                        <label htmlFor="email" className="absolute left-[14px] top-1/2 -translate-y-1/2 text-xs leading-[18px] transition-all peer-placeholder-shown:text-light-disabled-text peer-placeholder-shown:text-[16px] peer-placeholder-shown:top-1/2 peer-focus:text-[12px] peer-focus:top-0 peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-0 bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:px-1">
                          Email Address *
                        </label>
                      </div>
                      {errors.email && <p className="text-error text-xs mt-1.5 pl-3">{errors.email}</p>}
                    </div>

                  </div>

                  {/* Row 3: Subject (optional) */}
                  <div className="pb-6 wow animate__animated animate__fadeInUp" data-wow-delay=".2s">
                    <div className="relative w-full">
                      <input
                        type="text"
                        id="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="peer form-control input-group medium rounded-[80px] px-3.5 placeholder-transparent focus:placeholder-transparent focus:outline-none"
                        placeholder="Subject"
                      />
                      <label htmlFor="subject" className="absolute left-[14px] top-1/2 -translate-y-1/2 text-xs leading-[18px] transition-all peer-placeholder-shown:text-light-disabled-text peer-placeholder-shown:text-[16px] peer-placeholder-shown:top-1/2 peer-focus:text-[12px] peer-focus:top-0 peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-0 bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:px-1">
                        Subject (Optional)
                      </label>
                    </div>
                  </div>

                  {/* Row 4: Message */}
                  <div className="w-full pb-6 wow animate__animated animate__fadeInUp" data-wow-delay=".2s">
                    <div className={`input-group medium rounded-[20px] px-3.5 resize-none ${errors.message ? 'border-error' : ''}`}>
                      <textarea
                        id="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        className="peer form-control placeholder-transparent focus:placeholder-transparent focus:outline-none w-full bg-transparent"
                        placeholder="Write your message"
                      ></textarea>
                      <label htmlFor="message" className="absolute left-[14px] top-1/2 -translate-y-1/2 text-xs leading-[18px] transition-all peer-placeholder-shown:text-light-disabled-text peer-placeholder-shown:text-[16px] peer-placeholder-shown:top-6 peer-focus:text-[12px] peer-focus:top-0 peer-[:not(:placeholder-shown)]:text-[12px] peer-[:not(:placeholder-shown)]:top-0 bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:px-1">
                        Write your message *
                      </label>
                    </div>
                    {errors.message && <p className="text-error text-xs mt-1.5 pl-3">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end wow animate__animated animate__fadeInUp" data-wow-delay=".2s">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className={`btn btn-large btn-primary rounded-[100px] px-[35px] py-[11px] inline-flex items-center gap-x-2 transition-opacity ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <i className="hgi hgi-stroke hgi-sent text-lg"></i>
                          Send Your Message
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section className="mb-[70px]">
        <div className="container">
          <div className="text-center">
            <h3 className="pb-3">Frequently Asked Questions</h3>
            <p className="pb-12">
              Everything you need to know about instruments, orders, and shopping at Hargun Musicals.
            </p>
          </div>
          <div className="grid grid-cols-12">
            <div className="lg:col-start-2 col-start-1 col-end-13">
              <div className="accordion">
                {faqData.map((item, index) => (
                  <div key={index} className="accordion-item border-b py-4">
                    <div
                      onClick={() => toggleFAQ(index)}
                      className="accordion-header flex justify-between items-center cursor-pointer"
                    >
                      <h6>{item.q}</h6>
                      {activeIndex === index
                        ? <i className="hgi hgi-stroke hgi-minus-sign flex-shrink-0 ml-4"></i>
                        : <i className="hgi hgi-stroke hgi-plus-sign flex-shrink-0 ml-4"></i>
                      }
                    </div>
                    {activeIndex === index && (
                      <div className="accordion-body mt-3">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Subscribe ── */}
      <Subscribe />
    </>
  )
}

export default Contact