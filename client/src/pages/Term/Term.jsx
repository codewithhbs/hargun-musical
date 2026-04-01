import React from 'react';

const Term = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Terms and Conditions</h1>
          <p className="text-lg opacity-90 text-black">Hargun Musical</p>
          <p className="mt-4 text-sm opacity-80 text-black">Last Updated: March 2026</p>
        </div>

        <div className="p-8 md:p-12 prose prose-gray max-w-none leading-relaxed">
          <p className="text-lg">
            Welcome to <strong>Hargun Musical</strong>. By accessing or using our website and services, you agree to be bound by these Terms and Conditions. 
            Please read them carefully before placing any order.
          </p>

          <div className="my-10 border-t border-gray-200"></div>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">1. General Information</h2>
          <p>
            Hargun Musical is an online platform that sells musical instruments, accessories, and related products. 
            These Terms and Conditions govern your use of our website and the purchase of products from us.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">2. Use of Website</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>You must be at least 18 years old to use this website and make purchases.</li>
            <li>You agree to provide accurate, current, and complete information while registering or placing an order.</li>
            <li>You are responsible for maintaining the confidentiality of your account and password.</li>
            <li>Any misuse of the website may result in termination of your access.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">3. Product Information and Pricing</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>All product images, descriptions, and prices are subject to change without prior notice.</li>
            <li>We make every effort to display accurate information, but we do not guarantee that product descriptions or pricing are error-free.</li>
            <li>In case of any pricing error, we reserve the right to cancel the order and refund the amount paid.</li>
            <li>All prices are in Indian Rupees (₹) and inclusive of taxes unless stated otherwise.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">4. Ordering and Payment</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>By placing an order, you are making an offer to purchase the product(s).</li>
            <li>We reserve the right to accept or reject any order at our discretion.</li>
            <li>Payments are processed securely through third-party payment gateways (Razorpay, PayU, etc.).</li>
            <li>We do not store your complete payment card details.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">5. Shipping and Delivery</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>We ship across India using reputed courier partners.</li>
            <li>Delivery time may vary depending on your location (usually 3-10 business days).</li>
            <li>Shipping charges are calculated at checkout and are non-refundable.</li>
            <li>Any customs duty or additional taxes in your area will be borne by the customer.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">6. Cancellation, Refund & Return Policy</h2>
          <p>
            Please refer to our separate <strong>Refund and Cancellation Policy</strong> for detailed information. 
            Generally, orders can be cancelled within 24 hours of placing the order. 
            Returns are accepted only in case of manufacturing defects or wrong item delivered.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">7. Warranty</h2>
          <p>
            Most musical instruments come with a manufacturer’s warranty. The warranty period and terms vary by brand and product. 
            Please check the product page or contact us for warranty details.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">8. Limitation of Liability</h2>
          <p>
            Hargun Musical shall not be liable for any indirect, incidental, special, or consequential damages arising out of 
            the use or inability to use our products or services.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">9. Intellectual Property</h2>
          <p>
            All content on this website, including logos, images, text, and graphics, is the property of Hargun Musical 
            and is protected by copyright and trademark laws. You may not use, copy, or distribute any content without our written permission.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">10. Governing Law</h2>
          <p>
            These Terms and Conditions shall be governed by and construed in accordance with the laws of India. 
            Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts in Delhi, India.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">11. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any time. 
            Continued use of the website after such changes constitutes your acceptance of the new terms.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">12. Contact Us</h2>
          <p>If you have any questions regarding these Terms and Conditions, please contact us at:</p>
          
          <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <p><strong>Hargun Musical</strong></p>
            <p>Shop No.34, Main Market Marg, Near Ram Leela Ground, Block 8, Press Colony, Subhash Nagar, New Delhi, Delhi - 110027</p>
            <p>Email: <a href="mailto:support@hargunmusicals.com" className="text-indigo-600 hover:underline font-medium">support@hargunmusicals.com</a></p>
            <p>Phone: +91 99713 04667</p>
          </div>

          <div className="mt-16 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Hargun Musical. All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Term;