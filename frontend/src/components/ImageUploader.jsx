import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
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
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-300">{label}</label>
      <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/60 rounded-2xl p-4 text-center transition-colors bg-slate-900/50">
        {preview ? (
          <div className="relative group inline-block">
            <img src={preview} alt="Upload preview" className="w-32 h-32 object-cover rounded-xl border border-emerald-500/40" />
            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
              <label className="cursor-pointer text-xs font-bold text-emerald-400 flex items-center gap-1">
                <UploadCloud className="w-4 h-4" /> Change Image
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center justify-center py-4">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8 text-emerald-400 mb-2" />
            )}
            <span className="text-xs font-semibold text-slate-200">
              {uploading ? 'Uploading image...' : 'Click to upload waste photo'}
            </span>
            <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
          </label>
        )}
      </div>
      {error && <p className="text-[11px] text-rose-400">{error}</p>}
    </div>
  );
};

export default ImageUploader;
