
import React, { useState, useRef, useEffect } from 'react';
import { transcribeAudio } from '../services/geminiService';

interface SearchInputProps {
  onSearch: (word: string) => void;
  disabled?: boolean;
  isHeaderVariant?: boolean;
  language: 'ur' | 'en';
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, disabled, isHeaderVariant = false, language }) => {
  const [value, setValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const isUrdu = language === 'ur';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value.trim());
    }
  };

  const startRecording = async () => {
    setPermissionError(null);
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setPermissionError(isUrdu ? "آپ کا براؤزر مائیکروفون کو سپورٹ نہیں کرتا۔" : "Your browser does not support microphone.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : MediaRecorder.isTypeSupported('audio/mp4') 
          ? 'audio/mp4' 
          : 'audio/ogg';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setIsTranscribing(true);
        try {
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = (reader.result as string).split(',')[1];
            const transcription = await transcribeAudio(base64Audio, mimeType);
            if (transcription) {
              setValue(transcription);
              if (transcription.length > 1) {
                setTimeout(() => onSearch(transcription), 500);
              }
            }
            setIsTranscribing(false);
          };
        } catch (error) {
          console.error("Transcription error:", error);
          setIsTranscribing(false);
        }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error("Microphone access error:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError(isUrdu ? "مائیکروفون تک رسائی مسترد کر دی گئی۔" : "Microphone access denied.");
      } else {
        setPermissionError(isUrdu ? "مائیکروفون تک رسائی میں مسئلہ پیش آیا۔" : "Microphone access error.");
      }
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceButtonClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const getPlaceholder = () => {
    if (isRecording) return isUrdu ? "سن رہا ہوں..." : "Listening...";
    return isUrdu ? "عربی لفظ یہاں لکھیں..." : "Write Arabic word here...";
  };

  return (
    <div className={`w-full max-w-xl mx-auto ${!isHeaderVariant ? 'mb-10' : ''}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <div className="relative w-full group">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={getPlaceholder()}
            className={`
              w-full bg-white dark:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-800 rounded-2xl py-3 md:py-4 
              ${isUrdu ? 'pr-16 md:pr-20 pl-24 md:pl-36 text-right' : 'pl-16 md:pl-20 pr-24 md:pr-36 text-left'} 
              text-lg md:text-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] transition-all arabic text-emerald-950 dark:text-emerald-50 placeholder:text-emerald-900/30 dark:placeholder:text-emerald-100/20 placeholder:text-sm md:placeholder:text-base
              ${isUrdu ? 'urdu' : ''}
              ${isHeaderVariant ? 'focus:border-amber-400' : 'focus:border-emerald-500 dark:focus:border-emerald-400'}
              ${(disabled || isTranscribing) 
                ? 'opacity-70 cursor-wait' 
                : 'focus:bg-white dark:focus:bg-emerald-900/60 focus:ring-4 focus:ring-amber-500/5'}
              ${isRecording ? 'ring-4 ring-amber-500/20 border-amber-500' : ''}
              ${permissionError ? 'border-red-400 focus:border-red-500' : ''}
            `}
            disabled={disabled || isTranscribing}
            dir={isUrdu ? 'rtl' : 'ltr'}
          />
          
          {/* Microphone Button */}
          <button
            type="button"
            onClick={handleVoiceButtonClick}
            disabled={disabled || isTranscribing}
            className={`
              absolute ${isUrdu ? 'right-2 md:right-3' : 'left-2 md:left-3'} top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all z-30
              ${isRecording 
                ? 'bg-amber-500 text-white animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.6)]' 
                : 'bg-emerald-50 dark:bg-emerald-800/50 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-700/50'}
              ${isTranscribing ? 'opacity-50 pointer-events-none' : ''}
              ${permissionError ? 'ring-2 ring-red-400 shadow-lg' : ''}
            `}
            title={isUrdu ? "صوتی تلاش" : "Voice Search"}
          >
            {isTranscribing ? (
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            ) : isRecording ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            )}
          </button>

          <div className={`absolute ${isUrdu ? 'left-1.5 md:left-2' : 'right-1.5 md:right-2'} top-1/2 -translate-y-1/2 z-20`}>
            <button
              type="submit"
              disabled={disabled || !value.trim() || isTranscribing}
              className="bg-[#044434] dark:bg-emerald-600 hover:bg-[#065a46] dark:hover:bg-emerald-500 hover:scale-[1.02] active:scale-95 text-white px-4 md:px-8 py-2 md:py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center min-w-[90px] md:min-w-[120px]"
            >
              {(disabled || isTranscribing) ? (
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              ) : (
                <span className={`${isUrdu ? 'urdu' : ''} text-sm md:text-lg`}>
                  {isUrdu ? 'تجزیہ کریں' : 'Analyze'}
                </span>
              )}
            </button>
          </div>
        </div>
      </form>

      {permissionError && (
        <div className={`mt-3 ${isUrdu ? 'text-right' : 'text-left'} px-4 animate-in fade-in slide-in-from-top-1`}>
          <p className={`text-red-500 dark:text-red-400 text-sm font-bold flex items-center ${isUrdu ? 'justify-end' : 'justify-start'} gap-2 ${isUrdu ? 'urdu' : ''}`}>
             {!isUrdu && <span className="text-base">⚠️</span>}
             <span>{permissionError}</span>
             {isUrdu && <span className="text-base">⚠️</span>}
          </p>
        </div>
      )}
      
      <div className={`mt-4 md:mt-6 flex flex-wrap justify-center items-center gap-3 md:gap-5 transition-opacity duration-300 ${isHeaderVariant ? 'text-white' : 'text-emerald-900/40 dark:text-emerald-100/30'} ${(disabled || isTranscribing) ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
        <span className={`${isUrdu ? 'urdu' : ''} text-base md:text-xl font-bold`}>{isUrdu ? 'مثالیں:' : 'Examples:'}</span>
        <div className="flex gap-4 md:gap-6 items-center">
          <button 
            type="button"
            className={`arabic text-xl md:text-2xl hover:text-amber-400 transition-all cursor-pointer hover:scale-110 active:scale-90 ${isHeaderVariant ? 'text-white/90' : 'text-emerald-800 dark:text-emerald-300'}`} 
            onClick={() => { setValue('الْقُرْآن'); setPermissionError(null); }}
            disabled={disabled || isTranscribing}
          >
            الْقُرْآن
          </button>
          <span className="opacity-40 text-xs">•</span>
          <button 
            type="button"
            className={`arabic text-xl md:text-2xl hover:text-amber-400 transition-all cursor-pointer hover:scale-110 active:scale-90 ${isHeaderVariant ? 'text-white/90' : 'text-emerald-800 dark:text-emerald-300'}`} 
            onClick={() => { setValue('كَتَبَ'); setPermissionError(null); }}
            disabled={disabled || isTranscribing}
          >
            كَتَبَ
          </button>
          <span className="opacity-40 text-xs">•</span>
          <button 
            type="button"
            className={`arabic text-xl md:text-2xl hover:text-amber-400 transition-all cursor-pointer hover:scale-110 active:scale-90 ${isHeaderVariant ? 'text-white/90' : 'text-emerald-800 dark:text-emerald-300'}`} 
            onClick={() => { setValue('نَصَرَ'); setPermissionError(null); }}
            disabled={disabled || isTranscribing}
          >
            نَصَرَ
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
