import { API_PATH } from "./api";
import axiosInstance from "./axios-instance";


const uploadImage = async (imageFile: File) => {
    const formData = new FormData();
    formData.append("image", imageFile);
 try {
    const response = await axiosInstance.post(API_PATH.AUTH.UPLOAD_IMAGE, formData,{
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
 } catch (error) {
  throw error;
 }
}

export default uploadImage;

