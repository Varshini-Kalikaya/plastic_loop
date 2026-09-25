import React, { useState } from 'react';
import { Sparkles, Bot, CheckCircle2, RefreshCw } from 'lucide-react';
import Modal from './Modal';
import ImageUploader from './ImageUploader';

const AIPlasticScannerModal = ({ isOpen, onClose, onSelectCategory }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = () => {
    if (!imageUrl) return;
    setAnalyzing(true);
    setResult(null);

    // Simulate AI model prediction
    setTimeout(() => {
      const plasticOptions = [
        { code: 'PET', name: 'PET (Polyethylene Terephthalate)', confidence: 0.96, recyclable: true, points: 10, note: 'Clear beverage bottle detected. High commercial recycling value.' },
        { code: 'HDPE', name: 'HDPE (High-Density Polyethylene)', confidence: 0.92, recyclable: true, points: 12, note: 'Opaque rigid container detected. Ideal for heavy recycling.' },
        { code: 'PP', name: 'PP (Polypropylene)', confidence: 0.89, recyclable: true, points: 10, note: 'Food container plastic identified.' },
      ];
      const randomPrediction = plasticOptions[Math.floor(Math.random() * plasticOptions.length)];
      setResult(randomPrediction);
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Waste Classifier">
      <div className="space-y-4">
        <div className="p-3.5 rounded-2xl bg-[#edf6f0] border border-[#cbe3d3] flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#1b4332] shrink-0 mt-0.5" />
          <p className="text-xs text-[#2d4235] leading-relaxed">
            Upload an image of plastic waste. Our computer vision model evaluates resin codes, shape, and transparency to suggest the appropriate category and recycling point rate.
          </p>
        </div>

        <ImageUploader onUploadSuccess={(url) => setImageUrl(url)} currentImage={imageUrl} label="Upload Plastic Waste Photo for AI Scan" />

        {imageUrl && !result && (
          <button
            onClick={handleScan}
            disabled={analyzing}
            className="w-full py-3 px-4 rounded-xl eco-btn-primary text-xs flex items-center justify-center gap-2 shadow-md"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Image Features with AI Model...
              </>
            ) : (
              <>
                <Bot className="w-4 h-4" /> Run AI Plastic Classification
              </>
            )}
          </button>
        )}

        {result && (
          <div className="p-5 rounded-2xl bg-[#f7faf8] border border-[#cbe3d3] space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5c6e62] uppercase tracking-wider">Predicted Material</span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#edf6f0] text-[#1b4332] border border-[#cbe3d3] text-xs font-extrabold">
                {(result.confidence * 100).toFixed(0)}% Confidence
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#1b4332] text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                {result.code}
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#14231b]">{result.name}</h4>
                <p className="text-xs text-[#526458] mt-0.5">{result.note}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#e2e8df] flex items-center justify-between text-xs font-medium">
              <span className="text-[#627367]">Estimated Reward Rate:</span>
              <span className="font-extrabold text-[#1b4332]">+{result.points} Points / KG</span>
            </div>

            <button
              onClick={() => {
                onSelectCategory(result.code);
                onClose();
              }}
              className="w-full mt-2 py-3 px-4 rounded-xl eco-btn-primary text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4" /> Apply {result.code} Category to Request Form
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AIPlasticScannerModal;
