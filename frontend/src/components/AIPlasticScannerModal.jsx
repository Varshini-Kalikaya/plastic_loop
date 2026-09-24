import React, { useState } from 'react';
import { Sparkles, Bot, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
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

    // Simulate FastAPI AI model prediction
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
    <Modal isOpen={isOpen} onClose={onClose} title="🤖 AI Plastic Classifier (FastAPI Microservice Ready)">
      <div className="space-y-4">
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            Upload an image of plastic waste. Our computer vision architecture evaluates resin identification codes, opacity, and shape to suggest category and recyclability.
          </p>
        </div>

        <ImageUploader onUploadSuccess={(url) => setImageUrl(url)} currentImage={imageUrl} label="Upload Plastic Waste Photo for AI Scan" />

        {imageUrl && !result && (
          <button
            onClick={handleScan}
            disabled={analyzing}
            className="w-full py-3 px-4 rounded-xl eco-button-gradient text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg"
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
          <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Predicted Material</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                {(result.confidence * 100).toFixed(0)}% Confidence
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-extrabold text-sm">
                {result.code}
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">{result.name}</h4>
                <p className="text-xs text-slate-400">{result.note}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Estimated Reward Rate:</span>
              <span className="font-bold text-emerald-400">+{result.points} Points / KG</span>
            </div>

            <button
              onClick={() => {
                onSelectCategory(result.code);
                onClose();
              }}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-400 transition-colors"
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
