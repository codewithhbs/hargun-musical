import React from 'react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-lg opacity-90 text-black">Hargun Musical - Your Music, Our Priority</p>
          <p className="mt-4 text-sm opacity-80 text-black">Last Updated: March 2026</p>
        </div>

        <div className="p-8 md:p-12 prose prose-gray max-w-none">
          <p className="text-lg leading-relaxed">
            Hargun Musical ("we", "us", or "our") respects your privacy and is committed to protecting your personal information. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
            <span className="font-medium"> hargunmusicals.com </span> or make a purchase from us.
          </p>

          <div className="my-10 border-t border-gray-200"></div>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">1. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2 mt-4 text-gray-700">
            <li><strong>Personal Information:</strong> Name, email address, phone number, shipping and billing address when you create an account or place an order.</li>
            <li><strong>Payment Information:</strong> We do not store your full card details. Payments are securely processed by trusted third-party gateways (Razorpay, PayU, etc.).</li>
            <li><strong>Usage Data:</strong> IP address, browser type, device information, pages visited, and time spent on our website.</li>
            <li><strong>Cookies and Tracking:</strong> We use cookies to improve your shopping experience, remember your preferences, and analyze website traffic.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">2. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>To process and fulfill your orders</li>
            <li>To communicate with you about your purchases and provide customer support</li>
            <li>To improve our website and personalize your experience</li>
            <li>To send you promotional offers and updates (you can unsubscribe anytime)</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">3. Sharing Your Information</h2>
          <p>We do not sell your personal information. We may share your information only in the following cases:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>With shipping partners (Delhivery, DTDC, India Post, etc.) to deliver your orders</li>
            <li>With payment processors for secure transactions</li>
            <li>When required by law or government authorities</li>
            <li>With trusted service providers who help us operate our website (analytics, email marketing, etc.)</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">4. Cookies and Tracking Technologies</h2>
          <p>
            We use essential cookies to make the website work properly. You can manage your cookie preferences through your browser settings. 
            We may also use Google Analytics or similar tools to understand how visitors use our site.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">5. Data Security</h2>
          <p>
            We take reasonable security measures to protect your personal information from unauthorized access, alteration, or disclosure. 
            However, no method of transmission over the internet is 100% secure.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Access, update, or delete your personal information</li>
            <li>Opt-out of marketing communications</li>
            <li>Withdraw consent where applicable</li>
          </ul>
          <p className="mt-4">
            To exercise these rights, please contact us at: 
            <a href="mailto:hargunmusicals86@gmail.com" className="text-indigo-600 hover:underline"> hargunmusicals86@gmail.com</a>
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">7. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 mt-12 mb-6">8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please feel free to contact us:
          </p>
          <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <p><strong>Hargun Musical</strong></p>
            <p>Shop No.34, Main Market Marg, Near Ram Leela Ground, Block 8, Press Colony, Subhash Nagar, New Delhi, Delhi - 110027</p>
            <p>Email: <a href="mailto:support@hargunmusicals.com" className="text-indigo-600 hover:underline">support@hargunmusicals.com</a></p>
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

export default Privacy;