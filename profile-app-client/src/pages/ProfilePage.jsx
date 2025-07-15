import React, { useContext, useRef } from 'react';
import { AuthContext } from '../context/auth.context';

import { uploadPhoto, editUser } from '../services/auth.service';

import backgroundImg from '../assets/images/oval-bg.png';

function ProfilePage() {
  const { user, setUser, logOutUser } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      // 1. Upload file via service
      const uploadRes = await uploadPhoto(file);
      const fileUrl = uploadRes.data.fileUrl;

      // 2. Update user profile via service
      const editRes = await editUser({ image: fileUrl });

      // 3. Update context with fresh user data
      setUser(editRes.data);
    } catch (err) {
      console.error('Error uploading image:', err);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center p-6">
      <div
        className="flex w-full max-w-4xl shadow-lg rounded-lg overflow-hidden
                   bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        {/* Left transparent panel (white curve) */}
        <div className="w-1/2 py-10 pl-15 space-y-6 tracking-wider">
          <h2 className="text-3xl font-semibold text-green-700">Profile</h2>
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <p className="text-sm text-gray-600">Username</p>
              <p className="mt-1 font-medium text-gray-900">{user.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Campus</p>
              <p className="mt-1 font-medium text-gray-900">{user.campus}</p>
            </div>
            <div className="mb-15">
              <p className="text-sm text-gray-600">Course</p>
              <p className="mt-1 font-medium text-gray-900">{user.course}</p>
            </div>
            <button
              onClick={logOutUser}
              className="mt-6 mb-10 text-red-500 font-bold cursor-pointer hover:underline"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Right transparent panel (green curve) */}
        <div className="w-1/2 pl-10 py-15 flex flex-col items-center">
          <div className="w-40 h-40 bg-gray-200 rounded-full overflow-hidden mb-6 flex items-center justify-center">
            <img
              src={
                user.image ||
                'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <button
            onClick={handleEditClick}
            className="bg-white px-20 py-1 rounded-lg shadow hover:bg-gray-50 transition"
          >
            Edit Photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          <p className="mt-auto text-gray-600 px-12">
            The user is able to upload a new profile photo, using NodeJS and
            Multer uploader.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
