import React, { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

const VoiceRecorder = ({ onTranscript, disabled = false, className = '' }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const startRecording = useCallback(async () => {
    setError(null);
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (onTranscript) {
        onTranscript(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setIsProcessing(false);
    };

    try {
      await recognition.start();
      setIsProcessing(true);
    } catch (err) {
      console.error('Failed to start speech recognition', err);
      setError('Failed to start speech recognition. Please check microphone permissions.');
      setIsProcessing(false);
    }
  }, [onTranscript]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setIsProcessing(false);
  }, []);

  const handleClick = () => {
    if (disabled || isProcessing) return;
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isProcessing}
        className={`p-2 rounded-full transition-colors ${
          isRecording
            ? 'bg-red-500 text-white animate-pulse'
            : disabled
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
        }`}
        title={isRecording ? 'Stop recording' : 'Start voice input'}
      >
        {isProcessing && !isRecording ? (
          <Loader2 size={18} className="animate-spin" />
        ) : isRecording ? (
          <MicOff size={18} />
        ) : (
          <Mic size={18} />
        )}
      </button>
      {error && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-red-600 text-white text-xs rounded whitespace-nowrap">
          {error}
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
