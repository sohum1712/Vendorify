import React, { useState, useRef, useCallback } from 'react';
import { Camera, X, Plus, Mic, Check, AlertCircle } from 'lucide-react';
import VoiceRecorder from '../common/VoiceRecorder';
import { Card, CardContent } from '../common/Card';

const LANGUAGES = {
  en: { name: 'English', code: 'en' },
  hi: { name: 'हिंदी', code: 'hi' },
  te: { name: 'తెలుగు', code: 'te' }
};

// Product recognition database (mock AI recognition)
const PRODUCT_RECOGNITION = {
  // English
  'samosa': { name: 'Samosa', category: 'food', defaultPrice: 20 },
  'pani puri': { name: 'Pani Puri', category: 'food', defaultPrice: 30 },
  'dosa': { name: 'Dosa', category: 'food', defaultPrice: 40 },
  'idli': { name: 'Idli', category: 'food', defaultPrice: 15 },
  'vada pav': { name: 'Vada Pav', category: 'food', defaultPrice: 25 },
  'chai': { name: 'Chai', category: 'beverage', defaultPrice: 10 },
  'coffee': { name: 'Coffee', category: 'beverage', defaultPrice: 15 },
  
  // Hindi
  'समोसा': { name: 'Samosa', category: 'food', defaultPrice: 20 },
  'पानी पूरी': { name: 'Pani Puri', category: 'food', defaultPrice: 30 },
  'डोसा': { name: 'Dosa', category: 'food', defaultPrice: 40 },
  'इडली': { name: 'Idli', category: 'food', defaultPrice: 15 },
  'वड़ा पाव': { name: 'Vada Pav', category: 'food', defaultPrice: 25 },
  'चाय': { name: 'Chai', category: 'beverage', defaultPrice: 10 },
  'कॉफी': { name: 'Coffee', category: 'beverage', defaultPrice: 15 },
  
  // Telugu
  'సమోసా': { name: 'Samosa', category: 'food', defaultPrice: 20 },
  'పానీ పూరీ': { name: 'Pani Puri', category: 'food', defaultPrice: 30 },
  'దోసా': { name: 'Dosa', category: 'food', defaultPrice: 40 },
  'ఇడ్లీ': { name: 'Idli', category: 'food', defaultPrice: 15 },
  'వడా పావ్': { name: 'Vada Pav', category: 'food', defaultPrice: 25 },
  'చై': { name: 'Chai', category: 'beverage', defaultPrice: 10 },
  'కాఫీ': { name: 'Coffee', category: 'beverage', defaultPrice: 15 },
};

const AIProductListing = ({ onClose, onProductAdded }) => {
  const [step, setStep] = useState('photo'); // photo, voice, confirm
  const [photo, setPhoto] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [recognizedProduct, setRecognizedProduct] = useState(null);
  const [voiceInput, setVoiceInput] = useState('');
  const [productDetails, setProductDetails] = useState({
    name: '',
    price: '',
    category: '',
    description: ''
  });
  
  const fileInputRef = useRef(null);

  const simulateProductRecognition = useCallback((filename) => {
    setIsProcessing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      // Mock recognition based on filename (in real app, this would be actual AI vision)
      const lowerFilename = filename.toLowerCase();
      let recognized = null;
      
      if (lowerFilename.includes('samosa') || lowerFilename.includes('సమోసా') || lowerFilename.includes('समोसा')) {
        recognized = PRODUCT_RECOGNITION['samosa'];
      } else if (lowerFilename.includes('pani') || lowerFilename.includes('పానీ') || lowerFilename.includes('पानी')) {
        recognized = PRODUCT_RECOGNITION['pani puri'];
      } else if (lowerFilename.includes('dosa') || lowerFilename.includes('దోసా') || lowerFilename.includes('डोसा')) {
        recognized = PRODUCT_RECOGNITION['dosa'];
      } else {
        // Default to samosa if not recognized
        recognized = PRODUCT_RECOGNITION['samosa'];
      }
      
      setRecognizedProduct(recognized);
      setProductDetails({
        name: recognized.name,
        price: recognized.defaultPrice.toString(),
        category: recognized.category,
        description: `Fresh ${recognized.name} from our kitchen`
      });
      setIsProcessing(false);
      setStep('voice');
    }, 1500);
  }, []);

  const handlePhotoCapture = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target.result);
        // Simulate AI product recognition
        simulateProductRecognition(file.name);
      };
      reader.readAsDataURL(file);
    }
  }, [simulateProductRecognition]);

  const handleVoiceInput = useCallback((transcript) => {
    setVoiceInput(transcript);
    
    // Extract product name and price from voice input
    const lowerTranscript = transcript.toLowerCase();
    
    // Try to find product in recognition database
    let foundProduct = null;
    Object.entries(PRODUCT_RECOGNITION).forEach(([key, product]) => {
      if (lowerTranscript.includes(key)) {
        foundProduct = product;
      }
    });
    
    // Extract price using regex (looks for numbers)
    const priceMatch = transcript.match(/(\d+)/);
    const extractedPrice = priceMatch ? priceMatch[0] : '';
    
    if (foundProduct) {
      setProductDetails(prev => ({
        ...prev,
        name: foundProduct.name,
        category: foundProduct.category,
        price: extractedPrice || prev.price || foundProduct.defaultPrice.toString()
      }));
    } else if (extractedPrice) {
      setProductDetails(prev => ({
        ...prev,
        price: extractedPrice
      }));
    }
  }, []);

  const handleAddProduct = useCallback(() => {
    const newProduct = {
      id: Date.now(),
      ...productDetails,
      price: parseInt(productDetails.price),
      available: true,
      image: photo || 'https://via.placeholder.com/150'
    };
    
    onProductAdded(newProduct);
    onClose();
  }, [productDetails, photo, onProductAdded, onClose]);

  const resetForm = useCallback(() => {
    setStep('photo');
    setPhoto(null);
    setRecognizedProduct(null);
    setVoiceInput('');
    setProductDetails({
      name: '',
      price: '',
      category: '',
      description: ''
    });
  }, []);

  const responses = {
    en: {
      title: 'Add New Product',
      photoStep: 'Take a photo of your product',
      voiceStep: 'Speak product name and price',
      confirmStep: 'Confirm product details',
      takePhoto: 'Take Photo',
      retakePhoto: 'Retake Photo',
      speakDetails: 'Speak Details',
      confirmAdd: 'Add Product',
      processing: 'AI is recognizing product...',
      recognized: 'Product recognized!',
      manualInput: 'Or type manually'
    },
    hi: {
      title: 'नया उत्पाद जोड़ें',
      photoStep: 'अपने उत्पाद का फोटो लें',
      voiceStep: 'उत्पाद नाम और मूल्य बोलें',
      confirmStep: 'उत्पाद विवरण पुष्टि करें',
      takePhoto: 'फोटो लें',
      retakePhoto: 'फिर से फोटो लें',
      speakDetails: 'विवरण बोलें',
      confirmAdd: 'उत्पाद जोड़ें',
      processing: 'AI उत्पाद पहचान रहा है...',
      recognized: 'उत्पाद पहचाना गया!',
      manualInput: 'या मैन्युअली टाइप करें'
    },
    te: {
      title: 'కొత్త ఉత్పత్తి జోడండి',
      photoStep: 'మీ ఉత్పత్తి ఫోటో తీసుకోండి',
      voiceStep: 'ఉత్పత్తి పేరు మరియు ధర చెప్పండి',
      confirmStep: 'ఉత్పత్తి వివరాలను నిర్ధారించండి',
      takePhoto: 'ఫోటో తీసుకోండి',
      retakePhoto: 'మళ్ళీ ఫోటో తీసుకోండి',
      speakDetails: 'వివరాలను చెప్పండి',
      confirmAdd: 'ఉత్పత్తి జోడండి',
      processing: 'AI ఉత్పత్తిని గుర్తించింది...',
      recognized: 'ఉత్పత్తి గుర్తించబడింది!',
      manualInput: 'లేదా మానవల్గా టైప్ చేయండి'
    }
  };

  const currentLang = responses[selectedLanguage];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-800">{currentLang.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Language Selector */}
        <div className="p-4 border-b border-gray-200">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {Object.entries(LANGUAGES).map(([code, lang]) => (
              <option key={code} value={code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Step 1: Photo Capture */}
        {step === 'photo' && (
          <div className="p-6 space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-4">{currentLang.photoStep}</p>
              
              {/* Photo Preview */}
              {photo ? (
                <div className="relative">
                  <img
                    src={photo}
                    alt="Product"
                    className="w-48 h-48 object-cover rounded-lg mx-auto"
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
                        <p className="text-sm">{currentLang.processing}</p>
                      </div>
                    </div>
                  )}
                  {recognizedProduct && !isProcessing && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white p-2 rounded-full">
                      <Check size={16} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                  <Camera size={48} className="text-gray-400" />
                </div>
              )}
            </div>

            {/* Photo Actions */}
            <div className="flex gap-3 justify-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoCapture}
                className="hidden"
              />
              
              {!photo ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
                >
                  <Camera size={20} />
                  {currentLang.takePhoto}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
                  >
                    <Camera size={20} />
                    {currentLang.retakePhoto}
                  </button>
                  {recognizedProduct && !isProcessing && (
                    <button
                      onClick={() => setStep('voice')}
                      className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                    >
                      <Mic size={20} />
                      {currentLang.speakDetails}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Voice Input */}
        {step === 'voice' && (
          <div className="p-6 space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-4">{currentLang.voiceStep}</p>
              
              {/* Product Preview */}
              <div className="flex gap-4 mb-4">
                <div className="w-24 h-24 rounded-lg overflow-hidden">
                  <img
                    src={photo}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-800">{currentLang.recognized}</p>
                  <p className="text-sm text-indigo-600">{recognizedProduct?.name}</p>
                  <p className="text-xs text-gray-500">{recognizedProduct?.category}</p>
                </div>
              </div>
            </div>

            {/* Voice Recorder */}
            <div className="space-y-3">
              <VoiceRecorder
                onTranscript={handleVoiceInput}
                isListening={isListening}
                setIsListening={setIsListening}
                placeholder="Speak product name and price..."
                language={selectedLanguage}
              />
              
              {voiceInput && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Heard: "{voiceInput}"</p>
                </div>
              )}
            </div>

            {/* Manual Input */}
            <div className="space-y-3">
              <p className="text-xs text-gray-500 text-center">{currentLang.manualInput}</p>
              <input
                type="text"
                placeholder="Product name"
                value={productDetails.name}
                onChange={(e) => setProductDetails(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="Price (₹)"
                value={productDetails.price}
                onChange={(e) => setProductDetails(prev => ({ ...prev, price: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setStep('confirm')}
                disabled={!productDetails.name || !productDetails.price}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
              >
                {currentLang.confirmAdd}
              </button>
              <button
                onClick={resetForm}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 'confirm' && (
          <div className="p-6 space-y-4">
            <div className="text-center">
              <p className="text-gray-600 mb-4">{currentLang.confirmStep}</p>
            </div>

            {/* Product Summary */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden">
                    <img
                      src={photo}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{productDetails.name}</h4>
                    <p className="text-sm text-gray-600">{productDetails.category}</p>
                    <p className="text-lg font-bold text-indigo-600">₹{productDetails.price}</p>
                  </div>
                </div>
                {productDetails.description && (
                  <p className="text-sm text-gray-600">{productDetails.description}</p>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddProduct}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                <Plus size={20} />
                {currentLang.confirmAdd}
              </button>
              <button
                onClick={() => setStep('voice')}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300"
              >
                <AlertCircle size={20} />
                Edit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIProductListing;
