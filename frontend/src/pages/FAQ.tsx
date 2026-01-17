import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer: "Simply browse our courses, select the one you want, and click 'Enroll Now'. You'll need to create an account first if you haven't already."
    },
    {
      question: "Are the courses self-paced?",
      answer: "Yes, all our courses are self-paced. You can learn at your own speed and access the content 24/7."
    },
    {
      question: "Do I get a certificate after completion?",
      answer: "Yes, upon completing a course, you'll automatically receive a certificate that you can download and share."
    },
    {
      question: "Can I access courses on mobile devices?",
      answer: "Absolutely! Our platform is fully responsive and works perfectly on smartphones and tablets."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and digital payment methods through our secure payment gateway."
    },
    {
      question: "Can I get a refund?",
      answer: "We offer a 30-day money-back guarantee if you're not satisfied with your course."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-[0_20px_60px_rgba(59,130,246,0.4)] mb-6 border border-white/10">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-slate-300 font-medium max-w-2xl mx-auto">
            Find answers to common questions about our platform
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 p-8 transform hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl text-white font-bold text-sm mr-4 shadow-lg">
                  {index + 1}
                </span>
                {faq.question}
              </h3>
              <p className="text-slate-300 leading-relaxed text-lg pl-14">{faq.answer}</p>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <p className="text-slate-300 mb-6 text-lg font-medium">Still have questions?</p>
          <Link to="/contact" className="inline-flex items-center bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-[0_10px_40px_rgba(59,130,246,0.4)] font-bold text-lg border border-white/10">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Us
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default FAQ;