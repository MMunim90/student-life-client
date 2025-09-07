import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { IoCreateOutline } from "react-icons/io5";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";

const UploadForm = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const imageUploadKey = import.meta.env.VITE_image_upload_key;

  const mutation = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("image", data.image[0]);

      const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${imageUploadKey}`;

      // Upload image to imgbb
      const res = await axios.post(imageUploadUrl, formData);
      const imageUrl = res.data?.data?.url;

      const postInfo = {
        image: imageUrl,
        category: data.category, 
        userName: user.displayName,
        userEmail: user.email,
        userImage: user.photoURL,
        message: data.message,
        createdAt: new Date(),
      };

      // Save property info to DB
      return await axiosSecure.post("/addPosts", postInfo);
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Post added successfully!",
        confirmButtonColor: "#01AFF7",
      });
      reset();
      setImagePreview(null);
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to add post",
        confirmButtonColor: "#d33",
      });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto space-y-6 p-6 max-w-7xl"
      >
        {/* Image Upload */}
        <div className="col-span-1">
          <input
            type="file"
            accept="image/*"
            {...register("image", { required: true })}
            onChange={handleImagePreview}
            className="w-full text-sm file:px-4 file:py-3 border border-gray-600 rounded-md file:bg-gray-600 file:text-white file:cursor-pointer file:hover:bg-gray-900"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 rounded w-120 h-80 object-cover"
            />
          )}
        </div>

        {/* Select Category */}
        <div>
          <select
            {...register("category", { required: true })}
            className="w-full p-3 rounded-md border border-gray-600 focus:outline-none focus:border-gray-300 opacity-65 text-gray-400 font-semibold"
          >
            <option value="">Select Category</option>
            <option value="blog">Blog</option>
            <option value="education">Education</option>
            <option value="achievement">Achievement</option>
            <option value="job">Job</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <textarea
            name="message"
            placeholder="Message"
            rows="5"
            {...register("message", { required: true })}
            className="w-full p-3 rounded-md border border-gray-600 focus:outline-none focus:border-gray-300 opacity-65 min-h-12"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button
            type="submit"
            className="cursor-pointer rounded-md bg-[#2A4759] hover:bg-[#253b49] border-none px-6 py-3 text-white flex items-center justify-center gap-1"
          >
            <IoCreateOutline size={20} />
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadForm;
