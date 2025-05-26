import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import axiosInstance from "../../utils/axios-instance";
import { API_PATH } from "../../utils/api";
import { toast } from "react-hot-toast";

export default function Profile() {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [originalName, setOriginalName] = useState("");
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(API_PATH.AUTH.GET_USER_INFO)
      .then((res) => {
        const user = res.data.user;
        setName(user.fullName || "");
        setImageUrl(user.profileImageUrl || "");
        setOriginalName(user.fullName || "");
        setOriginalImageUrl(user.profileImageUrl || "");
      })
      .catch(() => {
        toast.error("Gagal mengambil data profil");
      });
  }, []);

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

    // ✅ Validasi format dan ukuran
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Format harus .jpg atau .png");
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error("Ukuran maksimal 2MB");
      return;
    }

    // ✅ Upload
    const uploadPromise = uploadImage(selectedFile)
      .then((url) => {
        setImageUrl(url);
      });

    toast.promise(uploadPromise, {
      loading: "Mengunggah gambar...",
      success: "Gambar berhasil diunggah",
      error: "Upload gagal",
    });
  };

  const handleUpdate = async () => {
    const updatePromise = axiosInstance.put(API_PATH.AUTH.UPDATE_PROFILE, {
      fullName: name,
      profileImageUrl: imageUrl,
    }).then(() => {
      setOriginalName(name);
      setOriginalImageUrl(imageUrl);
    });

    toast.promise(updatePromise, {
      loading: "Menyimpan perubahan...",
      success: "Profil berhasil diperbarui",
      error: "Gagal menyimpan profil",
    });

    await updatePromise;
  };

  const isChanged = name !== originalName || imageUrl !== originalImageUrl;

  return (
    <DashboardLayout activeMenu="Profile">
      <div className="p-4 max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-center">Edit Profil</h2>

        <div className="flex flex-col items-center gap-4">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Avatar"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border shadow-sm"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-purple-700"
          />

          {file && (
            <p className="text-sm text-gray-500 italic text-center">{file.name}</p>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
          <input
            className="w-full border p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama Lengkap"
          />
        </div>

        <div className="text-center">
          <button
            onClick={handleUpdate}
            disabled={!isChanged || loading}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:opacity-60 transition"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
