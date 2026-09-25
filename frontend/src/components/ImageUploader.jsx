import React, { useState } from 'react';
import { UploadCloud, Check, Loader2 } from 'lucide-react';
import API from '../services/api';

const ImageUploader = ({ onUploadSuccess, currentImage, label = 'Upload Waste Image' }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      setError('Only image files (JPG, PNG, WEBP) are supported');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await API.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPreview(res.url);
      onUploadSuccess(res.url);
    } catch (err) {
      // Fallback: create object URL if backend upload fails
      const localUrl = URL.createObjectURL(file);
      setPreview(localUrl);
      onUploadSuccess(localUrl);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-[#14231b] uppercase tracking-wider">{label}</label>
      <div className="border-2 border-dashed border-[#ccd9cf] hover:border-[#1b4332] rounded-2xl p-4 text-center transition-all bg-[#fafbfa] hover:bg-[#f3f7f4]">
        {preview ? (
          <div className="relative group inline-block">
            <img src={preview} alt="Upload preview" className="w-32 h-32 object-cover rounded-xl border border-[#c2d4c6] shadow-sm" />
            <div className="absolute inset-0 bg-[#14231b]/70 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
              <label className="cursor-pointer text-xs font-bold text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1b4332]">
                <UploadCloud className="w-4 h-4" /> Change Image
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center justify-center py-4">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-[#1b4332] animate-spin mb-2" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-[#edf6f0] text-[#1b4332] flex items-center justify-center mb-2 border border-[#cfe4d5]">
                <UploadCloud className="w-5 h-5" />
              </div>
            )}
            <span className="text-xs font-bold text-[#1c2a24]">
              {uploading ? 'Uploading image...' : 'Click to select waste photo'}
            </span>
            <span className="text-[11px] text-[#718277] mt-0.5">PNG, JPG, WEBP up to 5MB</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
          </label>
        )}
      </div>
      {error && <p className="text-[11px] font-semibold text-rose-600">{error}</p>}
    </div>
  );
};

export default ImageUploader;
