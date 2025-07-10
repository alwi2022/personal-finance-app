import { Link } from "react-router-dom";
import { TrendingUp, ArrowLeft, FileText, User, Shield, AlertTriangle } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/login" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FinanceTracker</span>
            </Link>
            
            {/* Back Button */}
            <Link
              to="/login"
              className="btn-outline btn-sm"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600 mb-2">
            Legal terms and conditions for using FinanceTracker
          </p>
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          <div className="grid gap-8">
            {/* Acceptance */}
            <section className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText size={20} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Acceptance of Terms</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using FinanceTracker, you accept and agree to be bound by these terms. 
                If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            {/* Service Description */}
            <section className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Our Service</h2>
              </div>
              
              <p className="text-gray-600 mb-6">
                FinanceTracker is a personal financial management platform that helps you track income, 
                expenses, and financial goals.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">What's Included</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Income and expense tracking</li>
                    <li>• Financial reports and analytics</li>
                    <li>• Data export functionality</li>
                    <li>• Secure data storage</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">What's Not Included</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Financial advice</li>
                    <li>• Investment management</li>
                    <li>• Tax preparation</li>
                    <li>• Bank connectivity</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Shield size={20} className="text-purple-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Your Responsibilities</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Account Security</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Keep login credentials confidential</li>
                    <li>• Use strong, unique passwords</li>
                    <li>• Report unauthorized access immediately</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Data Accuracy</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Provide accurate financial information</li>
                    <li>• Keep your profile up to date</li>
                    <li>• Verify data before making decisions</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Acceptable Use</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Use for personal financial tracking only</li>
                    <li>• Do not access other users' data</li>
                    <li>• Follow all applicable laws</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Limitations */}
            <section className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle size={20} className="text-yellow-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Important Disclaimers</h2>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <ul className="space-y-3 text-yellow-800">
                  <li>• FinanceTracker does not provide financial advice</li>
                  <li>• We are not responsible for financial decisions</li>
                  <li>• Service provided "as is" without warranties</li>
                  <li>• No guarantee of uninterrupted access</li>
                  <li>• Users responsible for data backup</li>
                </ul>
              </div>
            </section>

            {/* Data Ownership */}
            <section className="card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Data Ownership</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Your Data</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• You own your financial data</li>
                    <li>• Export data anytime</li>
                    <li>• Delete account and data</li>
                    <li>• We don't sell your data</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Our Usage</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Anonymized data for analytics</li>
                    <li>• Service improvement</li>
                    <li>• Privacy law compliance</li>
                    <li>• Strict security measures</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Account Termination */}
            <section className="card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Account Termination</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">By You</h3>
                  <p className="text-gray-600 mb-3">
                    You may delete your account anytime through profile settings.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Export data before deletion</li>
                    <li>• Deletion is permanent</li>
                    <li>• No refunds for unused time</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">By Us</h3>
                  <p className="text-gray-600 mb-3">
                    We may terminate accounts that violate these terms.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• 30-day notice for violations</li>
                    <li>• Immediate for severe breaches</li>
                    <li>• Data retention per privacy policy</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Questions?</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                  Questions about these Terms of Service? Contact us:
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> legal@financetracker.com</p>
                  <p><strong>Support:</strong> support@financetracker.com</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              © 2025 FinanceTracker. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-primary">
                Privacy Policy
              </Link>
              <Link to="/login" className="text-sm text-primary hover:text-primary-dark">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}