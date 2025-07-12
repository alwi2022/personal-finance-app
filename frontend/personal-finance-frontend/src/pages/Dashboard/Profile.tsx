import { useState, useEffect, useContext } from "react";
import { User, Camera, Save, X, Globe, DollarSign } from "lucide-react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { UserContext } from "../../context/userContext";
import { useSettings } from "../../context/settingsContext";
import type { Language, Currency } from "../../context/settingsContext";
import axiosInstance from "../../utils/axios-instance";
import { API_PATH } from "../../utils/api";
import { toast } from "react-hot-toast";
import { useUserAuth } from "../../hooks/userAuth";
import CharacterAvatar from "../../components/Cards/CharAvatar";

export default function Profile() {
  // Use authentication hook
  useUserAuth();
  
  // Get user from context
  const userContext = useContext(UserContext);
  const { user } = userContext || {};
  
  // Get settings context
  const { language, currency, setLanguage, setCurrency, t, formatUSDAmount } = useSettings();
  
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Initialize form data when user context is available
  useEffect(() => {
    if (user && !isInitialized) {
      setName(user.fullName || "");
      setImageUrl(user.profileImageUrl || "");
      setOriginalName(user.fullName || "");
      setOriginalImageUrl(user.profileImageUrl || "");
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axiosInstance.post(API_PATH.AUTH.UPLOAD_IMAGE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.imageUrl;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const preview = URL.createObjectURL(selectedFile);
    setPreviewUrl(preview);

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error(t('invalid_file_type'));
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error(t('file_size_limit'));
      return;
    }

    try {
      const uploadPromise = uploadImage(selectedFile);
      
      toast.promise(uploadPromise, {
        loading: t('uploading_image'),
        success: t('image_uploaded'),
        error: t('upload_failed'),
      });

      const url = await uploadPromise;
      setImageUrl(url);
    } catch (error) {
      console.error("Image upload error:", error);
      setPreviewUrl(null);
    }
  };

  const handleUpdate = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const updatePromise = axiosInstance.put(API_PATH.AUTH.UPDATE_PROFILE, {
        fullName: name,
        profileImageUrl: imageUrl,
        email: user.email,
      });

      toast.promise(updatePromise, {
        loading: t('saving_changes'),
        success: t('profile_updated'),
        error: t('save_failed'),
      });

      await updatePromise;
      
      setOriginalName(name);
      setOriginalImageUrl(imageUrl);
      
      if (userContext?.updateUser) {
        userContext.updateUser({
          ...user,
          fullName: name,
          profileImageUrl: imageUrl
        });
      }
    } catch (error) {
      console.error("Update profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(originalName);
    setImageUrl(originalImageUrl);
    setFile(null);
    setPreviewUrl(null);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    toast.success(t('language_updated'));
  };

  const handleCurrencyChange = (curr: Currency) => {
    setCurrency(curr);
    toast.success(t('currency_updated'));
  };

  const isChanged = name !== originalName || imageUrl !== originalImageUrl;

  // Show loading until user context is available
  if (!user || !isInitialized) {
    return (
      <DashboardLayout activeMenu="Profile">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center space-y-4">
            <div className="loading-spinner w-8 h-8 mx-auto"></div>
            <p className="text-gray-500">{t('loading_profile')}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Profile">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('profile_settings')}</h1>
          <p className="text-gray-600 mt-2">
            {t('manage_account_info')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <div className="text-center">
                <h3 className="card-title mb-4">{t('profile_picture')}</h3>
                
                {/* Avatar Display */}
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <CharacterAvatar
                          fullName={name}
                          width="w-full"
                          height="h-full"
                          style="text-2xl rounded-none"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Camera Icon Overlay */}
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors shadow-lg">
                    <Camera size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Upload Guidelines */}
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• {t('file_format_guide')}</p>
                  <p>• {t('max_size_guide')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">{t('personal_information')}</h3>
                <p className="card-subtitle">
                  {t('update_personal_details')}
                </p>
              </div>

              <div className="card-content space-y-6">
                {/* Full Name */}
                <div>
                  <label className="input-label">
                    <User size={16} className="inline mr-2" />
                    {t('full_name')}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('enter_full_name')}
                    className="input-box"
                  />
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="input-label">{t('email_address')}</label>
                  <input
                    type="email"
                    value={user.email || ""}
                    readOnly
                    className="input-box bg-gray-50  cursor-not-allowed"
                  />
                  <p className="input-help">
                    {t('email_readonly_note')}
                  </p>
                </div>

                {/* Account Stats */}
                <div>
                  <label className="input-label">{t('account_information')}</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{t('member_since')}</p>
                      <p className="font-medium">
                        {new Date(user.createdAt || Date.now()).toLocaleDateString(
                          language === 'id' ? 'id-ID' : 'en-US'
                        )}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{t('account_status')}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="font-medium text-green-600">{t('active')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="card-footer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isChanged && (
                      <div className="flex items-center gap-1 text-sm text-orange-600">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span>{t('unsaved_changes')}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {isChanged && (
                      <button
                        onClick={handleCancel}
                        className="btn-ghost btn-sm"
                      >
                        <X size={16} />
                        {t('cancel')}
                      </button>
                    )}
                    
                    <button
                      onClick={handleUpdate}
                      disabled={!isChanged || loading}
                      className="btn-primary btn-sm"
                    >
                      {loading ? (
                        <div className="loading-spinner"></div>
                      ) : (
                        <>
                          <Save size={16} />
                          {t('save_changes')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="card mt-6">
              <div className="card-header">
                <h3 className="card-title">{t('preferences')}</h3>
                <p className="card-subtitle">
                  {t('customize_experience')}
                </p>
              </div>

              <div className="card-content space-y-6">
                {/* Language Settings */}
                <div>
                  <label className="input-label">
                    <Globe size={16} className="inline mr-2" />
                    {t('language_settings')}
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        language === 'en'
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleLanguageChange('id')}
                      className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        language === 'id'
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Indonesia
                    </button>
                  </div>
                </div>

                {/* Currency Settings */}
                <div>
                  <label className="input-label">
                    <DollarSign size={16} className="inline mr-2" />
                    {t('currency_settings')}
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCurrencyChange('USD')}
                      className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        currency === 'USD'
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      onClick={() => handleCurrencyChange('IDR')}
                      className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                        currency === 'IDR'
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      IDR (Rp)
                    </button>
                  </div>
                </div>

                {/* Currency Preview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {t('currency_preview')}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatUSDAmount(1500)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">
                        {language === 'en' ? 'Language' : 'Bahasa'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {language === 'en' ? 'English' : 'Indonesia'}
                      </p>
                    </div>
                  </div>
                </div>

               
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}