import { useState, useEffect, useContext } from "react";
import { User, Camera, Upload, Save, X, Check } from "lucide-react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axios-instance";
import { API_PATH } from "../../utils/api";
import { toast } from "react-hot-toast";
import { useUserAuth } from "../../hooks/userAuth";
import CharacterAvatar from "../../components/Cards/CharAvatar";

export default function Profile() {
  // Use authentication hook
  useUserAuth();
  
  // Get user from context instead of making separate API call
  const userContext = useContext(UserContext);
  const { user } = userContext || {};
  
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
      console.log("🔍 Profile: Initializing with user data:", user);
      
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

    // Create preview URL
    const preview = URL.createObjectURL(selectedFile);
    setPreviewUrl(preview);

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Please select a valid image file (JPG, PNG, or WebP)");
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    // Upload image
    try {
      const uploadPromise = uploadImage(selectedFile);
      
      toast.promise(uploadPromise, {
        loading: "Uploading image...",
        success: "Image uploaded successfully",
        error: "Failed to upload image",
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
      });

      toast.promise(updatePromise, {
        loading: "Saving changes...",
        success: "Profile updated successfully",
        error: "Failed to save profile",
      });

      await updatePromise;
      
      // Update original values
      setOriginalName(name);
      setOriginalImageUrl(imageUrl);
      
      // Update user context
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

  const isChanged = name !== originalName || imageUrl !== originalImageUrl;

  // Show loading until user context is available
  if (!user || !isInitialized) {
    return (
      <DashboardLayout activeMenu="Profile">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center space-y-4">
            <div className="loading-spinner w-8 h-8 mx-auto"></div>
            <p className="text-gray-500">Loading profile...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <div className="text-center">
                <h3 className="card-title mb-4">Profile Picture</h3>
                
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

                {/* File Info */}
                {file && (
                  <div className="text-sm text-gray-600 mb-4">
                    <div className="flex items-center justify-center gap-2">
                      <Upload size={16} />
                      <span>{file.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}

                {/* Upload Guidelines */}
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• JPG, PNG, or WebP format</p>
                  <p>• Maximum size: 2MB</p>
                  <p>• Recommended: 400x400px</p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information Section */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Personal Information</h3>
                <p className="card-subtitle">
                  Update your personal details and account information
                </p>
              </div>

              <div className="card-content space-y-6">
                {/* Full Name */}
                <div>
                  <label className="input-label">
                    <User size={16} className="inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="input-box"
                  />
                </div>

                {/* Email (Read-only) */}
                <div>
                  <label className="input-label">Email Address</label>
                  <input
                    type="email"
                    value={user.email || ""}
                    readOnly
                    className="input-box bg-gray-50 cursor-not-allowed"
                  />
                  <p className="input-help">
                    Email address cannot be changed. Contact support if needed.
                  </p>
                </div>

                {/* Account Stats */}
                <div>
                  <label className="input-label">Account Information</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="font-medium">
                        {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Account Status</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="font-medium text-green-600">Active</p>
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
                        <span>Unsaved changes</span>
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
                        Cancel
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
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="card mt-6">
              <div className="card-header">
                <h3 className="card-title">Preferences</h3>
                <p className="card-subtitle">
                  Customize your experience
                </p>
              </div>

              <div className="card-content space-y-4">
                {/* Coming Soon */}
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500">More settings coming soon</p>
                  <p className="text-sm text-gray-400 mt-1">
                    We're working on additional customization options
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}