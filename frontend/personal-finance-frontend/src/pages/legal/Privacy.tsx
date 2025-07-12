import { Link } from "react-router-dom";
import { TrendingUp, ArrowLeft, Shield, Database, Users, Lock } from "lucide-react";
import { useSettings } from "../../context/settingsContext";
import LanguageToggle from "../../components/common/LanguageToggle";

export default function Privacy() {
  const { t } = useSettings();

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
              <span className="text-xl font-bold text-gray-900">
                {t('app_name') || 'FinanceTracker'}
              </span>
            </Link>

            <div className="flex items-center gap-4">
              {/* Language Toggle */}
              <LanguageToggle variant="header" />

              {/* Back Button */}
              <Link to="/login" className="btn-outline btn-sm">
                <ArrowLeft size={16} />
                {t('back_to_login') || 'Back to Login'}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('privacy_policy') || 'Privacy Policy'}
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {t('privacy_description') || 'How we protect and handle your information'}
          </p>
          <p className="text-sm text-gray-500">
            {t('last_updated') || 'Last updated'}: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          <div className="grid gap-8">
            {/* Introduction */}
            <section className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield size={20} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {t('introduction') || 'Introduction'}
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {t('privacy_intro') || 'At FinanceTracker, we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our financial management platform.'}
              </p>
            </section>

            {/* Information We Collect */}
            <section className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Database size={20} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {t('information_we_collect') || 'Information We Collect'}
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('personal_information') || 'Personal Information'}
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• {t('name_email') || 'Name and email address'}</li>
                    <li>• {t('profile_picture_optional') || 'Profile picture (optional)'}</li>
                    <li>• {t('account_credentials') || 'Account credentials (encrypted)'}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('financial_data') || 'Financial Data'}
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• {t('income_expense_records') || 'Income and expense records'}</li>
                    <li>• {t('transaction_categories') || 'Transaction categories and descriptions'}</li>
                    <li>• {t('financial_summaries') || 'Financial summaries and balances'}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('usage_information') || 'Usage Information'}
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• {t('device_browser_info') || 'Device and browser information'}</li>
                    <li>• {t('ip_location') || 'IP address and general location'}</li>
                    <li>• {t('usage_patterns') || 'Usage patterns and preferences'}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users size={20} className="text-purple-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {t('how_we_use_information') || 'How We Use Your Information'}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('service_provision') || 'Service Provision'}
                  </h3>
                  <p className="text-gray-600">
                    {t('service_provision_desc') || 'To provide, maintain, and improve our financial tracking services'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('communication') || 'Communication'}
                  </h3>
                  <p className="text-gray-600">
                    {t('communication_desc') || 'To send you important updates and support messages'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('security') || 'Security'}
                  </h3>
                  <p className="text-gray-600">
                    {t('security_desc') || 'To protect against fraud and unauthorized access'}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('analytics') || 'Analytics'}
                  </h3>
                  <p className="text-gray-600">
                    {t('analytics_desc') || 'To analyze usage and improve our platform'}
                  </p>
                </div>
              </div>
            </section>

            {/* Data Protection */}
            <section className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Lock size={20} className="text-red-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {t('data_protection') || 'Data Protection'}
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield size={20} className="text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {t('encryption') || 'Encryption'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('ssl_encryption') || '256-bit SSL encryption'}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock size={20} className="text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {t('secure_storage') || 'Secure Storage'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('bank_level_security') || 'Bank-level security'}
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users size={20} className="text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    {t('limited_access') || 'Limited Access'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('authorized_personnel_only') || 'Authorized personnel only'}
                  </p>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section className="card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {t('your_rights') || 'Your Rights'}
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {t('access_export') || 'Access & Export'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {t('request_data_copies') || 'Request copies of your data'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {t('correction') || 'Correction'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {t('update_inaccurate_info') || 'Update inaccurate information'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {t('deletion') || 'Deletion'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {t('request_data_deletion') || 'Request data deletion'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {t('contact_us') || 'Contact Us'}
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                  {t('privacy_contact_text') || 'Questions about this Privacy Policy? Contact us:'}
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>{t('email') || 'Email'}:</strong> imambahrialwi21@gmail.com</p>
                  <p><strong>{t('response_time') || 'Response Time'}:</strong> {t('within_30_days') || 'Within 30 days'}</p>
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
              © 2025 {t('app_name') || 'FinanceTracker'}. {t('all_rights_reserved') || 'All rights reserved'}.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/terms" className="text-sm text-gray-500 hover:text-primary">
                {t('terms_of_service') || 'Terms of Service'}
              </Link>
              <Link to="/login" className="text-sm text-primary hover:text-primary-dark">
                {t('back_to_login') || 'Back to Login'}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}