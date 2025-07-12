import { Link } from "react-router-dom";
import { TrendingUp, ArrowLeft, FileText, User, Shield, AlertTriangle } from "lucide-react";
import { useSettings } from "../../context/settingsContext";
import LanguageToggle from "../../components/common/LanguageToggle";

export default function Terms() {
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
            {t('terms_of_service') || 'Terms of Service'}
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            {t('terms_description') || 'Legal terms and conditions for using FinanceTracker'}
          </p>
          <p className="text-sm text-gray-500">
            {t('last_updated') || 'Last updated'}: {new Date().toLocaleDateString()}
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
                <h2 className="text-2xl font-semibold text-gray-900">
                  {t('acceptance_of_terms') || 'Acceptance of Terms'}
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {t('terms_acceptance_text') || 'By accessing and using FinanceTracker, you accept and agree to be bound by these terms. If you do not agree to these terms, please do not use our service.'}
              </p>
            </section>

            {/* Service Description */}
            <section className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {t('our_service') || 'Our Service'}
                </h2>
              </div>

              <p className="text-gray-600 mb-6">
                {t('service_description') || 'FinanceTracker is a personal financial management platform that helps you track income, expenses, and financial goals.'}
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('whats_included') || "What's Included"}
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• {t('income_expense_tracking') || 'Income and expense tracking'}</li>
                    <li>• {t('financial_reports') || 'Financial reports and analytics'}</li>
                    <li>• {t('data_export') || 'Data export functionality'}</li>
                    <li>• {t('secure_storage') || 'Secure data storage'}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('whats_not_included') || "What's Not Included"}
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• {t('financial_advice') || 'Financial advice'}</li>
                    <li>• {t('investment_management') || 'Investment management'}</li>
                    <li>• {t('tax_preparation') || 'Tax preparation'}</li>
                    <li>• {t('bank_connectivity') || 'Bank connectivity'}</li>
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
                <h2 className="text-2xl font-semibold text-gray-900">
                  {t('your_responsibilities') || 'Your Responsibilities'}
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('account_security') || 'Account Security'}
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• {t('keep_credentials_confidential') || 'Keep login credentials confidential'}</li>
                    <li>• {t('use_strong_passwords') || 'Use strong, unique passwords'}</li>
                    <li>• {t('report_unauthorized_access') || 'Report unauthorized access immediately'}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('data_accuracy') || 'Data Accuracy'}
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• {t('provide_accurate_info') || 'Provide accurate financial information'}</li>
                    <li>• {t('keep_profile_updated') || 'Keep your profile up to date'}</li>
                    <li>• {t('verify_data') || 'Verify data before making decisions'}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('acceptable_use') || 'Acceptable Use'}
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• {t('personal_use_only') || 'Use for personal financial tracking only'}</li>
                    <li>• {t('no_unauthorized_access') || 'Do not access other users\' data'}</li>
                    <li>• {t('follow_laws') || 'Follow all applicable laws'}</li>
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
                <h2 className="text-2xl font-semibold text-gray-900">
                  {t('important_disclaimers') || 'Important Disclaimers'}
                </h2>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <ul className="space-y-3 text-yellow-800">
                  <li>• {t('no_financial_advice') || 'FinanceTracker does not provide financial advice'}</li>
                  <li>• {t('no_responsibility_decisions') || 'We are not responsible for financial decisions'}</li>
                  <li>• {t('service_as_is') || 'Service provided "as is" without warranties'}</li>
                  <li>• {t('no_uptime_guarantee') || 'No guarantee of uninterrupted access'}</li>
                  <li>• {t('user_backup_responsibility') || 'Users responsible for data backup'}</li>
                </ul>
              </div>
            </section>

            {/* Data Ownership */}
            <section className="card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {t('data_ownership') || 'Data Ownership'}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('your_data') || 'Your Data'}
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• {t('you_own_data') || 'You own your financial data'}</li>
                    <li>• {t('export_anytime') || 'Export data anytime'}</li>
                    <li>• {t('delete_account') || 'Delete account and data'}</li>
                    <li>• {t('no_data_selling') || 'We don\'t sell your data'}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('our_usage') || 'Our Usage'}
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• {t('anonymized_analytics') || 'Anonymized data for analytics'}</li>
                    <li>• {t('service_improvement') || 'Service improvement'}</li>
                    <li>• {t('privacy_compliance') || 'Privacy law compliance'}</li>
                    <li>• {t('strict_security') || 'Strict security measures'}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Account Termination */}
            <section className="card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {t('account_termination') || 'Account Termination'}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('termination_by_you') || 'By You'}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {t('delete_account_anytime') || 'You may delete your account anytime through profile settings.'}
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• {t('export_before_deletion') || 'Export data before deletion'}</li>
                    <li>• {t('deletion_permanent') || 'Deletion is permanent'}</li>
                    <li>• {t('no_refunds') || 'No refunds for unused time'}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {t('termination_by_us') || 'By Us'}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {t('terminate_violations') || 'We may terminate accounts that violate these terms.'}
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• {t('30_day_notice') || '30-day notice for violations'}</li>
                    <li>• {t('immediate_severe') || 'Immediate for severe breaches'}</li>
                    <li>• {t('data_retention_policy') || 'Data retention per privacy policy'}</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="card">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {t('questions') || 'Questions?'}
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-600 mb-4">
                  {t('terms_contact_text') || 'Questions about these Terms of Service? Contact us:'}
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>{t('email') || 'Email'}:</strong>imambahrialwi21@gmail.com</p>
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
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-primary">
                {t('privacy_policy') || 'Privacy Policy'}
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