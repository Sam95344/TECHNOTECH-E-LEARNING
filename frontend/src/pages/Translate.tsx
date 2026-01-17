import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'bn', label: 'Bengali' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'mr', label: 'Marathi' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'kn', label: 'Kannada' },
  { code: 'pa', label: 'Punjabi' },
  { code: 'ur', label: 'Urdu' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
];

const Translate: React.FC = () => {
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [text, setText] = useState('');
  const [translated, setTranslated] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedLang, setDetectedLang] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const handleSwap = () => {
    if (sourceLang === 'auto') return;
    const newSource = targetLang;
    const newTarget = sourceLang === 'auto' ? 'en' : sourceLang;
    setSourceLang(newSource);
    setTargetLang(newTarget);
    setText(translated);
    setTranslated(text);
  };

  const handleTranslate = async () => {
    if (!text.trim() || !targetLang) return;
    setIsLoading(true);
    setError(null);
    setTranslated('');
    setDetectedLang(null);

    try {
      const res = await axios.post('http://localhost:5000/api/translate', {
        text,
        source: sourceLang,
        target: targetLang,
      });

      setTranslated(res.data.translatedText || '');
      setDetectedLang(res.data.detected || null);
      // Save to history
      try {
        const item = {
          input: text,
          translated: res.data.translatedText || '',
          source: res.data.detected || sourceLang,
          target: targetLang,
          time: Date.now(),
        };
        const prev = JSON.parse(localStorage.getItem('translate_history') || '[]');
        prev.unshift(item);
        const next = prev.slice(0, 20);
        localStorage.setItem('translate_history', JSON.stringify(next));
        setHistory(next);
      } catch (e) {
        console.warn('Could not save history', e);
      }
    } catch (err: any) {
      console.error('Translation error:', err?.response?.data || err.message || err);
      const msg = err?.response?.data?.error || 'Translation service error. Please try again after some time.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translated || '');
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const handleClear = () => {
    setText('');
    setTranslated('');
    setDetectedLang(null);
    setError(null);
  };

  const getLabelForCode = (code: string | null) => {
    if (!code) return '';
    const found = languages.find((l) => l.code === code);
    return found ? found.label : code.toUpperCase();
  };

  const examples = [
    'Hello, how are you?',
    'Where is the nearest bus stop?',
    'Thank you very much for your help.',
    'Can you please explain this topic?',
    'Good morning, have a great day!',
  ];

  useEffect(() => {
    try {
      const prev = JSON.parse(localStorage.getItem('translate_history') || '[]');
      setHistory(Array.isArray(prev) ? prev : []);
    } catch (e) {
      setHistory([]);
    }
  }, []);

  const handleUseHistory = (item: any) => {
    setText(item.input || '');
    setTargetLang(item.target || 'en');
    setSourceLang(item.source || 'auto');
  };

  const handleDownload = () => {
    const content = translated || '';
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translated.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl shadow-[0_20px_60px_rgba(16,185,129,0.5)] border border-white/10 mb-6">
            <span className="text-3xl font-bold">🔤</span>
          </div>

          {/* Detected language badge */}
          {sourceLang === 'auto' && detectedLang && (
            <div className="mt-2 mb-4 flex items-center space-x-2">
              <span className="text-xs text-slate-400">Detected:</span>
              <span className="text-xs bg-slate-800 border border-slate-700 px-2 py-1 rounded-lg text-slate-100">{getLabelForCode(detectedLang)} ({detectedLang})</span>
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent mb-2 tracking-tight">
            Language Translator
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
            Student kisi bhi language se dusri language me instantly text translate kar sakta hai.
          </p>
        </div>

        {/* Translator Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl p-4 sm:p-6 lg:p-8">
          {/* Language selectors */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 mb-6">
            <div className="flex-1">
              <p className="text-xs text-slate-400 mb-1">From</p>
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
              >
                <option value="auto">Auto Detect</option>
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-center md:justify-center">
              <button
                onClick={handleSwap}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 border border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-emerald-400 transition-colors text-lg"
                title="Swap languages"
              >
                ⇄
              </button>
            </div>

            <div className="flex-1">
              <p className="text-xs text-slate-400 mb-1">To</p>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Textareas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
            <div>
              <p className="text-xs text-slate-400 mb-1">Input text</p>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 resize-none"
                placeholder="Yahan apna text likho jo translate karna hai..."
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-slate-500">{text.length} characters</p>
                <button onClick={handleClear} className="text-xs text-slate-400 hover:text-emerald-400">Clear</button>
              </div>
              {/* Examples */}
              <div className="mt-3 flex flex-wrap gap-2">
                {examples.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setText(ex)}
                    className="text-xs px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700"
                  >
                    {ex.length > 24 ? ex.slice(0, 24) + '...' : ex}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Translated text</p>
              <textarea
                value={translated}
                readOnly
                rows={8}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 resize-none"
                placeholder="Yahan translated result dikhega..."
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={handleCopy} disabled={!translated} className="text-xs text-slate-400 hover:text-emerald-400 disabled:opacity-50">Copy</button>
                  <button onClick={handleDownload} disabled={!translated} className="text-xs text-slate-400 hover:text-emerald-400 disabled:opacity-50">Download</button>
                </div>
                <div className="text-xs text-slate-500">{translated.length} characters</div>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-400 mb-4">{error}</p>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <button
              onClick={handleTranslate}
              disabled={isLoading || !text.trim()}
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white text-sm font-semibold shadow-[0_10px_30px_rgba(16,185,129,0.5)] hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 hover:shadow-[0_14px_40px_rgba(16,185,129,0.7)] border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? 'Translating...' : 'Translate'}
            </button>

            <p className="text-[10px] text-slate-500">
              Note: Free translation API use ho raha hai, kabhi kabhi slow ya limit ho sakti hai.
            </p>
          </div>
          {/* History */}
          {history.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-slate-300 mb-2">Recent translations</p>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {history.map((h, idx) => (
                  <div key={h.time || idx} className="flex items-center justify-between bg-slate-900/60 border border-slate-800 rounded-lg p-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-300 truncate">{h.input}</div>
                      <div className="text-[12px] text-slate-400 mt-1 truncate">→ {h.translated}</div>
                      <div className="text-[10px] text-slate-500 mt-1">{getLabelForCode(h.source)} → {getLabelForCode(h.target)}</div>
                    </div>
                    <div className="flex items-center ml-3 space-x-2 shrink-0">
                      <button onClick={() => { navigator.clipboard.writeText(h.translated || ''); }} className="text-xs text-slate-400 hover:text-emerald-400">Copy</button>
                      <button onClick={() => handleUseHistory(h)} className="text-xs text-slate-400 hover:text-emerald-400">Use</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Translate;

