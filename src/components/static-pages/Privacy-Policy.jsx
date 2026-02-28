"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5F2] via-[#EEF2F7] to-[#E6ECF5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 bg-white shadow-md hover:shadow-lg border border-gray-200 px-5 py-2.5 rounded-full text-gray-700 hover:text-indigo-600 transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Go Back</span>
          </button>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-teal-500 rounded-2xl p-10 shadow-xl mb-10 text-center relative overflow-hidden">
          
          {/* Decorative Blur */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Privacy Policy
          </h1>
          <p className="text-indigo-100 mt-3 text-sm tracking-wide">
            Samudayik Vikas Samiti
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-xl p-8 sm:p-12 space-y-10">

          {/* Intro */}
          <p className="text-gray-700 leading-relaxed text-[15px]">
            Samudayik Vikas Samiti is committed to protecting your personal
            information and ensuring transparency in how we collect, use, and
            safeguard your data when you visit our website.
          </p>

          {/* Section Template */}
          <Section
            title="1. Personal Information We Collect"
            content={
              <>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 text-sm">
                  <li>Name, age, and occupation</li>
                  <li>Email address and mailing address</li>
                  <li>Mobile number</li>
                  <li>User ID and password (if registered)</li>
                  <li>Payment processing details</li>
                </ul>
              </>
            }
          />

          <Section
            title="2. Consent"
            content="By using our website, you consent to the terms outlined in this Privacy Policy and agree to its conditions."
          />

          <Section
            title="3. Information Collection"
            content="We may collect general browsing information such as date, time, browser type, and pages visited. This information is used for analytics and improving user experience."
          />

          <Section
            title="4. Use of Information"
            content="Your personal information is used for processing registrations, sending updates, issuing receipts, maintaining records, and improving our services."
          />

          <Section
            title="5. Disclosure of Information"
            content="We may share limited information with authorized service providers for administrative purposes. We do not sell personal data to third parties."
          />

          <Section
            title="6. Security"
            content="We implement reasonable security practices to protect your personal information. However, no method of transmission over the internet is 100% secure."
          />

          <Section
            title="7. Cookies"
            content="Our website may use cookies to enhance user experience and analyze traffic. You may disable cookies in your browser settings if preferred."
          />

          <Section
            title="8. External Links"
            content="Our website may contain links to other websites. We are not responsible for the privacy practices of those sites."
          />

          <Section
            title="9. Policy Updates"
            content="Samudayik Vikas Samiti reserves the right to modify this Privacy Policy at any time. Changes become effective once posted on the website."
          />

          <Section
            title="10. Copyright"
            content="All website content including text, graphics, and logos are the property of Samudayik Vikas Samiti and protected under applicable copyright laws."
          />

        </div>
      </div>
    </div>
  );
}

/* Reusable Section Component */
function Section({ title, content }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-3 border-l-4 border-indigo-500 pl-3">
        {title}
      </h2>
      <div className="text-gray-600 leading-relaxed text-sm">
        {content}
      </div>
    </div>
  );
}