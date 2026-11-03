import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

const API_URLS = [
  'http://127.0.0.1:8080/api',
  'http://localhost:8080/api',
  '/api'
];

async function apiRequest(endpoint, options = {}) {
  let lastError = null;
  for (const base of API_URLS) {
    try {
      const res = await fetch(`${base}${endpoint}`, options);
      return res;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Failed to reach scoring engine backend');
}

function formatErrorDetail(errData, fallbackMsg = 'Operation failed on server') {
  if (!errData) return fallbackMsg;
  if (typeof errData.detail === 'string') return errData.detail;
  if (Array.isArray(errData.detail)) {
    return errData.detail.map(d => (d && d.msg) ? d.msg : JSON.stringify(d)).join('; ');
  }
  return fallbackMsg;
}

/* ── Inline SVG Icons ─────────────────────────────────────────────────────────
   All icons: self-contained inline SVG, width/height 16-18, strokeWidth 1.8-2
   No external icon libraries.
   ───────────────────────────────────────────────────────────────────────────── */

function SunIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function FeatherIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  );
}

function BookIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function LayersIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function CheckCircleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function AlertTriangleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function LightbulbIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
    </svg>
  );
}

function RefreshIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function UploadCloudIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function FileTextIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function XIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function UserIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CopyIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ClockIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PrintIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}

function SearchIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function TrendingUpIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function TrendingDownIcon({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

function ActivityIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

/* ── Benchmark Curated Essays for Instant Demo / Testing ─────────────────────── */
const SAMPLE_ESSAYS = [
  {
    id: 'high',
    title: 'Band 9.2 · Exemplary Draft',
    student: 'Sample: High Academic Standard',
    promptId: 1,
    text: `The integration of Artificial Intelligence into modern pedagogical ecosystems represents a paradigm shift in contemporary education. Rather than functioning merely as an automated instructional surrogate, intelligent tutoring systems facilitate personalized adaptive learning pathways that accommodate diverse cognitive modalities. Consequently, students encountering complex syntactic or mathematical abstractions can receive real-time, scaffolded remediation tailored to their idiosyncratic pacing. Furthermore, natural language processing architectures furnish educators with granular diagnostic analytics, illuminating latent conceptual deficiencies across aggregate cohort data.

Nevertheless, this rapid technological assimilation introduces profound ethical and pedagogical quandaries. Foremost among these is the preservation of academic integrity amidst the proliferation of generative linguistic models. When students delegate synthesis and critical composition to automated text generation systems, their capacity for dialectical analysis and independent cognitive problem-solving risks substantial atrophy. Furthermore, institutional reliance on algorithmic assessment paradigms raises critical questions regarding algorithmic equity and socio-demographic bias in automated scoring matrices.

Ultimately, the judicious deployment of artificial intelligence requires an intentional equilibrium between technological efficiency and humanistic mentorship. Educational institutions must formulate transparent pedagogical frameworks that leverage computational acceleration while steadfastly nurturing student agency, intellectual inquiry, and authentic scholarly expression.`
  },
  {
    id: 'medium',
    title: 'Band 7.4 · Competent Draft',
    student: 'Sample: Competent Scholar',
    promptId: 1,
    text: `Artificial intelligence has become one of the most discussed topics in modern education today. In many schools and universities, AI tools are helping students understand complicated lessons by providing quick answers and customized study plans. Teachers can also benefit from using AI because it reduces their workload when grading assignments and organizing classroom materials. This allows educators to spend more time directly interacting with students who need extra assistance.

However, there are also noticeable problems that come with using artificial intelligence in schools. The biggest problem is academic honesty, because many students might copy essays directly from AI instead of writing them themselves. If students rely too much on software to do their homework, they will not develop good critical thinking skills or writing abilities. There is also an issue of unequal access, since not every student has high-speed internet or expensive devices at home.

In conclusion, artificial intelligence has great potential to improve education if it is managed properly. Schools must establish clear rules about when students can use AI tools, ensuring that technology supports learning without replacing real effort and honest studying.`
  },
  {
    id: 'developing',
    title: 'Band 5.1 · Developing Draft',
    student: 'Sample: Developing Writer',
    promptId: 1,
    text: `AI is good for education because it helps students a lot. Many people use AI everyday to do homework and find answers quickly on internet. When teachers give hard work AI can make it easy and fast. Also AI gives good information about topics that are hard to understand in class books.

Another thing is AI can be bad too. Some students just copy everything and do not study at all. This is not good for learning because students need to write on their own. Also some students do not have computers or phones so it is unfair for them in school.

So AI is helpful but students should be careful and not cheat on homework. Schools should tell students how to use it in good way so everyone learns well.`
  }
];

/* Score ring — SVG arc, no animation, pure CSS variable colors */
function ScoreRing({ score, size = 96 }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(100, Math.max(0, score)) / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 88 88" aria-hidden="true">
      <circle cx="44" cy="44" r={r} fill="none" stroke="var(--app-rule)" strokeWidth="7" />
      <circle
        cx="44" cy="44" r={r} fill="none"
        stroke="var(--app-accent)" strokeWidth="7"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
    </svg>
  );
}

function getLetterGrade(score) {
  if (score >= 90) return { grade: 'A', label: 'Excellent' };
  if (score >= 80) return { grade: 'B', label: 'Good' };
  if (score >= 70) return { grade: 'C', label: 'Satisfactory' };
  if (score >= 60) return { grade: 'D', label: 'Developing' };
  return { grade: 'F', label: 'Needs Improvement' };
}

function calculateRubric(result) {
  if (!result) return [];
  const score = result.score_100 || 0;
  const lexDiv = result.metrics.lexical_diversity || 0;
  const complexRatio = result.metrics.complex_word_ratio || 0;
  const wordCount = result.metrics.word_count || 0;
  const sentCount = result.metrics.sentence_count || 0;

  const topicScore = Math.min(25, Math.max(8, Math.round(((score * 0.25) + (wordCount >= 200 ? 1.5 : wordCount >= 100 ? 0 : -3)) * 10) / 10));
  const lexicalScore = Math.min(25, Math.max(7, Math.round(((lexDiv * 24) + (complexRatio * 18) + (score * 0.08)) * 10) / 10));
  const syntacticScore = Math.min(25, Math.max(8, Math.round(((score * 0.23) + (sentCount >= 8 ? 1.5 : -1.5)) * 10) / 10));
  const rawSum = topicScore + lexicalScore + syntacticScore;
  const readabilityScore = Math.min(25, Math.max(6, Math.round(Math.max(10, score - rawSum) * 10) / 10));

  return [
    { name: 'Topic Alignment & Scope', score: topicScore, max: 25, desc: 'Relevance to prompt topic and depth of thesis exploration' },
    { name: 'Lexical Sophistication', score: lexicalScore, max: 25, desc: 'Vocabulary density, Type-Token Ratio, and complex diction' },
    { name: 'Syntactic Complexity', score: syntacticScore, max: 25, desc: 'Sentence variation, grammatical depth, and clausal variety' },
    { name: 'Readability & Mechanics', score: readabilityScore, max: 25, desc: 'Flow, cohesive transitions, and academic prose cadence' },
  ];
}

function RunIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

/* ── Utilities ───────────────────────────────────────────────────────────────── */

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/* ── App ─────────────────────────────────────────────────────────────────────── */

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'dark';
  });
  const [activeTab, setActiveTab] = useState('evaluate');
  const [prompts, setPrompts] = useState([]);
  const [selectedPromptId, setSelectedPromptId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [essayText, setEssayText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [prevResult, setPrevResult] = useState(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [historySearch, setHistorySearch] = useState('');
  const fileInputRef = useRef(null);

  // Sync theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));

  // Realtime token counters
  const cleanTokens = essayText.trim() === '' ? [] : essayText.trim().split(/\s+/);
  const liveWordCount    = cleanTokens.length;
  const liveCharCount    = essayText.length;
  const liveParaCount    = essayText.trim() === '' ? 0 : essayText.trim().split(/\n\s*\n+/).filter(p => p.trim()).length;
  const liveUniqueWords  = new Set(cleanTokens.map(w => w.toLowerCase().replace(/[^a-z]/g, '')).filter(Boolean)).size;
  const liveReadTimeSec  = Math.ceil(liveWordCount / 3.5); // ~210 wpm average reader
  const liveReadTimeStr  = liveReadTimeSec < 60 ? `${liveReadTimeSec}s read` : `${Math.ceil(liveReadTimeSec / 60)}m read`;

  // Realtime Syntax & Diction Diagnostics
  const STOPWORDS = new Set(['the','and','is','in','to','of','a','that','it','for','on','with','as','this','was','at','by','an','be','from','or','are','i','you','he','she','we','they','their','his','her','its','our','my','so','but','if','not','have','has','had','do','does','did','will','would','can','could','should','may','might','about','also','more','than']);
  const wordFreqs = {};
  cleanTokens.forEach(t => {
    const clean = t.toLowerCase().replace(/[^a-z]/g, '');
    if (clean.length > 2 && !STOPWORDS.has(clean)) {
      wordFreqs[clean] = (wordFreqs[clean] || 0) + 1;
    }
  });
  const overusedWords = Object.entries(wordFreqs).filter(([, c]) => c >= 3).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const sentencesList = essayText.split(/[.?!]+/).map(s => s.trim()).filter(Boolean);
  const longestSentenceWords = sentencesList.reduce((max, s) => {
    const cnt = s.split(/\s+/).length;
    return cnt > max ? cnt : max;
  }, 0);
  const lexicalDensityPct = liveWordCount > 0 ? Math.round((liveUniqueWords / liveWordCount) * 100) : 0;

  const loadSampleEssay = (sampleId) => {
    const s = SAMPLE_ESSAYS.find(item => item.id === sampleId);
    if (!s) return;
    setStudentName(s.student);
    if (s.promptId && prompts.some(p => p.id === s.promptId)) {
      setSelectedPromptId(s.promptId);
    }
    setEssayText(s.text);
    setUploadedFile(null);
    setResult(null);
    setErrorMsg('');
  };

  const handlePrint = () => {
    window.print();
  };

  const fetchPrompts = useCallback(async () => {
    try {
      const res = await apiRequest('/prompts');
      if (res.ok) {
        const data = await res.json();
        setPrompts(data);
        if (data.length > 0) setSelectedPromptId(data[0].id);
      }
    } catch (err) {
      console.warn('Backend not reached yet:', err);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    try {
      const res = await apiRequest('/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  // Prevent browser navigating away when a file is dropped on the window
  useEffect(() => {
    const preventDragDefault = (e) => e.preventDefault();
    window.addEventListener('dragover', preventDragDefault);
    window.addEventListener('drop', preventDragDefault);
    return () => {
      window.removeEventListener('dragover', preventDragDefault);
      window.removeEventListener('drop', preventDragDefault);
    };
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'history') fetchHistory();
  };

  const handleEvaluate = async () => {
    if (liveWordCount < 5) {
      setErrorMsg('Please compose at least 5 words to initiate NLP evaluation.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await apiRequest('/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_name: studentName.trim() || 'Anonymous Scholar',
          prompt_id: selectedPromptId ? parseInt(selectedPromptId, 10) : null,
          essay_text: essayText
        })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(formatErrorDetail(errData, 'Evaluation failed on backend'));
      }
      if (result) {
        setPrevResult(result);
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setErrorMsg(err.message || 'Unable to communicate with the scoring engine.');
    } finally {
      setIsLoading(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;
    const validExtensions = ['.pdf', '.docx', '.txt', '.md', '.rtf', '.csv', '.log'];
    const fileNameLower = file.name.toLowerCase();
    const hasValidExt = validExtensions.some(ext => fileNameLower.endsWith(ext));
    if (!hasValidExt) {
      setErrorMsg(`Unsupported format: "${file.name}". Upload a PDF, Word (.docx), or plain text file (.txt, .md).`);
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('File exceeds 25 MB. Please upload a smaller document.');
      return;
    }
    setIsUploading(true);
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await apiRequest('/upload-file', { method: 'POST', body: formData });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(formatErrorDetail(errData, 'Failed to extract text from document.'));
      }
      const data = await res.json();
      setEssayText(data.text);
      setUploadedFile({
        name: file.name,
        size: formatFileSize(file.size),
        wordCount: data.word_count
      });
      setResult(null);
    } catch (err) {
      // Client-side fallback for plain text files
      if (fileNameLower.endsWith('.txt') || fileNameLower.endsWith('.md')) {
        try {
          const text = await file.text();
          if (text.trim()) {
            setEssayText(text);
            const words = text.trim().split(/\s+/).length;
            setUploadedFile({ name: file.name, size: formatFileSize(file.size), wordCount: words });
            setResult(null);
            setIsUploading(false);
            return;
          }
        } catch { /* ignore */ }
      }
      setErrorMsg(err.message || 'Error reading file. Verify the document and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setEssayText('');
    setResult(null);
    setErrorMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClear = () => {
    setEssayText('');
    setUploadedFile(null);
    setResult(null);
    setErrorMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCopyFeedback = () => {
    if (!result) return;
    const lines = [
      `Reed — Essay Score: ${result.score_100}/100 (Band ${result.score_10}/10)`,
      `Vocabulary: ${result.vocabulary_tier}`,
      '',
      result.feedback.summary,
    ];
    if (result.feedback.strengths?.length) {
      lines.push('', 'Strengths:');
      result.feedback.strengths.forEach(s => lines.push(`  + ${s}`));
    }
    if (result.feedback.weaknesses?.length) {
      lines.push('', 'Areas to Develop:');
      result.feedback.weaknesses.forEach(w => lines.push(`  ! ${w}`));
    }
    if (result.feedback.suggestions?.length) {
      lines.push('', 'Suggestions:');
      result.feedback.suggestions.forEach(s => lines.push(`  > ${s}`));
    }
    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const activePrompt = prompts.find(p => p.id === parseInt(selectedPromptId, 10));

  return (
    <div className="app-container">

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="nav-container">
          <div className="brand" onClick={() => handleTabChange('evaluate')}>
            <div className="brand-symbol">R</div>
            <div className="brand-details">
              <span className="brand-title">Reed<span className="brand-accent-text">.</span></span>
              <span className="brand-meta">
                <span className="status-dot" />
                Essay Intelligence Engine
              </span>
            </div>
          </div>

          <div className="nav-actions">
            <div className="nav-tabs">
              <button
                className={`tab-btn ${activeTab === 'evaluate' ? 'active' : ''}`}
                onClick={() => handleTabChange('evaluate')}
              >
                <FeatherIcon size={15} />
                <span>Evaluate</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => handleTabChange('history')}
              >
                <BookIcon size={15} />
                <span>Submissions</span>
              </button>
              <button
                className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                onClick={() => handleTabChange('about')}
              >
                <LayersIcon size={15} />
                <span>Architecture</span>
              </button>
            </div>

            {/* 36×36 square Sun/Moon toggle */}
            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <SunIcon size={17} /> : <MoonIcon size={17} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <header className="hero">
        <span className="hero-tag">Reed · NLP · Machine Learning</span>
        <h1 className="hero-title">
          Essay Intelligence<br />
          <span className="hero-title-accent">by Reed</span>
        </h1>
        <p className="hero-desc">
          A supervised ML pipeline that combines lexical density analysis, syntactic POS
          parsing, and TF-IDF vectorization to produce objective, calibrated scores and
          constructive qualitative feedback on student essay drafts.
        </p>
      </header>

      {/* ── Main Workspace ─────────────────────────────────────────────────── */}
      <main className="main-content">

        {/* Evaluate tab */}
        {activeTab === 'evaluate' && (
          <div className="grid-workspace">

            {/* Left — Essay Composition */}
            <section className="card-panel" aria-labelledby="composition-heading">
              <div className="panel-header">
                <div className="panel-title-group">
                  <div className="title-icon-box">
                    <FeatherIcon size={17} />
                  </div>
                  <div>
                    <h2 id="composition-heading" className="panel-title">Essay Composition</h2>
                    <span className="panel-subtitle">Draft text or upload document</span>
                  </div>
                </div>
                <span className="category-badge">Input</span>
              </div>

              {/* Benchmark Sample Draft Loader */}
              <div className="sample-loader-bar">
                <span className="sample-loader-label">
                  <ActivityIcon size={13} />
                  <span>Benchmark Samples:</span>
                </span>
                <div className="sample-pills">
                  {SAMPLE_ESSAYS.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      className="sample-pill-btn"
                      onClick={() => loadSampleEssay(s.id)}
                      title={`Load ${s.title}`}
                    >
                      {s.title.split(' · ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Author / Scholar ID */}
              <div className="form-group">
                <label className="input-label" htmlFor="student-name-input">
                  <span className="label-text-with-icon">
                    <UserIcon size={14} />
                    <span>Author / Scholar ID</span>
                  </span>
                  <span className="badge-subtle">Optional</span>
                </label>
                <input
                  id="student-name-input"
                  type="text"
                  className="input-control"
                  placeholder="e.g., John Smith (STU-2024-001)"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>

              {/* Evaluation Prompt */}
              <div className="form-group">
                <label className="input-label" htmlFor="prompt-select">
                  <span className="label-text-with-icon">
                    <BookIcon size={14} />
                    <span>Evaluation Prompt</span>
                  </span>
                  <span className="badge-subtle badge-subtle-accent">{prompts.length} prompts</span>
                </label>
                <select
                  id="prompt-select"
                  className="select-control"
                  value={selectedPromptId}
                  onChange={(e) => setSelectedPromptId(e.target.value)}
                >
                  {prompts.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
                {activePrompt && (
                  <div className="prompt-meta-card">
                    <span className="scope-tag">Topic Scope</span>
                    {activePrompt.description}
                  </div>
                )}
              </div>

              {/* Draft Text + File Upload */}
              <div className="form-group">
                <div className="label-bar-composed">
                  <div className="label-text-with-icon">
                    <FileTextIcon size={14} />
                    <span>Draft Essay Content</span>
                    <span className="tag-encoding">UTF-8</span>
                  </div>
                  <div className="doc-format-pills">
                    <span className="pill-fmt pill-pdf">.PDF</span>
                    <span className="pill-fmt pill-docx">.DOCX</span>
                    <span className="pill-fmt pill-txt">.TXT</span>
                    <span className="pill-fmt pill-md">.MD</span>
                  </div>
                </div>

                {/* Hidden file input */}
                <input
                  type="file"
                  id="file-upload-input"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept=".pdf,.docx,.txt,.md,.rtf,.csv,.log,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
                    e.target.value = '';
                  }}
                />

                {/* Dropzone or attachment banner */}
                {!uploadedFile ? (
                  <div
                    className={`file-dropzone ${isDragging ? 'dragover' : ''} ${isUploading ? 'uploading' : ''}`}
                    onDragOver={(e)  => { e.preventDefault(); setIsDragging(true); }}
                    onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
                    }}
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                    aria-label="Upload PDF or text essay document"
                  >
                    {isUploading ? (
                      <div className="dropzone-content loading">
                        <RefreshIcon size={17} className="spin-icon" />
                        <span>Extracting document content...</span>
                      </div>
                    ) : (
                      <div className="dropzone-content">
                        <div className="dropzone-icon-glow">
                          <UploadCloudIcon size={19} />
                        </div>
                        <div className="dropzone-text">
                          <span className="dropzone-title">
                            <strong className="dropzone-accent-word">Choose a file</strong> or drag and drop here
                          </span>
                          <span className="dropzone-desc">
                            Extracts text from PDF, Word (.docx), or plain text files (.txt, .md)
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="attached-file-pill">
                    <div className="attached-file-left">
                      <div className="file-pill-icon">
                        <FileTextIcon size={15} />
                      </div>
                      <div className="file-pill-info">
                        <span className="file-pill-name" title={uploadedFile.name}>{uploadedFile.name}</span>
                        <span className="file-pill-meta">
                          {uploadedFile.size} · <span className="word-count-badge">{uploadedFile.wordCount} words</span>
                        </span>
                      </div>
                    </div>
                    <div className="attached-file-actions">
                      <button
                        type="button"
                        className="btn-replace-file"
                        onClick={() => fileInputRef.current?.click()}
                        title="Upload a different document"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        className="btn-remove-file"
                        onClick={handleRemoveFile}
                        aria-label="Remove attached file"
                        title="Remove file"
                      >
                        <XIcon size={13} />
                      </button>
                    </div>
                  </div>
                )}

                <textarea
                  id="essay-textarea"
                  className="textarea-control"
                  placeholder="Write or paste your essay draft here, or upload a file above. The pipeline analyzes lexical variety, syntactic depth, and semantic proximity to the selected prompt."
                  value={essayText}
                  onChange={(e) => setEssayText(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                      e.preventDefault();
                      handleEvaluate();
                    }
                  }}
                  onDragOver={(e)  => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
                  }}
                />

                <div className="editor-toolbar">
                  <div className="telemetry-group">
                    <span className="telemetry-pill">Words: <strong>{liveWordCount}</strong></span>
                    <span className="telemetry-pill">Chars: <strong>{liveCharCount}</strong></span>
                    <span className="telemetry-pill">Unique: <strong>{liveUniqueWords}</strong></span>
                    <span className="telemetry-pill">Paras: <strong>{liveParaCount}</strong></span>
                    {liveWordCount > 0 && (
                      <span className="telemetry-pill telemetry-read">
                        <ClockIcon size={11} /> {liveReadTimeStr}
                      </span>
                    )}
                  </div>
                  <div className="telemetry-hint">
                    <kbd>Tab</kbd> indent · <kbd>Ctrl+Enter</kbd> submit
                  </div>
                </div>

                {liveWordCount >= 10 && (
                  <div className="diagnostics-toggle-container">
                    <button
                      type="button"
                      className="btn-diagnostics-toggle"
                      onClick={() => setShowDiagnostics(prev => !prev)}
                    >
                      <ActivityIcon size={13} />
                      <span>In-Draft Syntax & Diction Diagnostics</span>
                      <span className="diagnostics-badge">
                        {overusedWords.length} repeated · {longestSentenceWords > 32 ? 'Run-on alert' : 'Balanced lengths'}
                      </span>
                    </button>
                    {showDiagnostics && (
                      <div className="diagnostics-panel">
                        <div className="diag-row">
                          <span className="diag-title">Top Repeated Content Words:</span>
                          <div className="diag-chips">
                            {overusedWords.length > 0 ? overusedWords.map(([w, c]) => (
                              <span key={w} className="diag-chip"><strong>{w}</strong> ({c}×)</span>
                            )) : <span className="diag-empty">No high-repetition content words detected</span>}
                          </div>
                        </div>
                        <div className="diag-grid">
                          <div className="diag-stat">
                            <span className="diag-stat-label">Longest Sentence</span>
                            <span className="diag-stat-val">
                              {longestSentenceWords} words {longestSentenceWords > 32 && <small className="diag-flag">Run-on</small>}
                            </span>
                          </div>
                          <div className="diag-stat">
                            <span className="diag-stat-label">Lexical Density</span>
                            <span className="diag-stat-val">{lexicalDensityPct}%</span>
                          </div>
                          <div className="diag-stat">
                            <span className="diag-stat-label">Avg Words / Para</span>
                            <span className="diag-stat-val">
                              {liveParaCount > 0 ? Math.round(liveWordCount / liveParaCount) : 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Error */}
              {errorMsg && (
                <div className="alert-banner" role="alert">
                  <AlertTriangleIcon size={15} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Actions */}
              <div className="button-row">
                <button
                  className="btn-primary"
                  onClick={handleEvaluate}
                  disabled={isLoading}
                >
                  <RunIcon size={15} />
                  <span>{isLoading ? 'Running NLP pipeline...' : 'Grade Essay'}</span>
                </button>
                <button
                  className="btn-secondary-outline"
                  onClick={handleClear}
                  disabled={isLoading}
                >
                  Clear draft
                </button>
              </div>
            </section>

            {/* Right — Evaluation Analytics */}
            <section className="card-panel" aria-labelledby="analytics-heading">
              <div className="panel-header">
                <div className="panel-title-group">
                  <div className="title-icon-box title-icon-success">
                    <LayersIcon size={17} />
                  </div>
                  <div>
                    <h2 id="analytics-heading" className="panel-title">Evaluation Analytics</h2>
                    <span className="panel-subtitle">Objective ML scoring and feedback</span>
                  </div>
                </div>
                {result ? (
                  <span className="category-badge">Record #{result.id}</span>
                ) : (
                  <span className="category-badge">Telemetry</span>
                )}
              </div>

              {!result && !isLoading && (
                <div className="empty-state">
                  <div className="empty-state-avatar">
                    <FeatherIcon size={24} />
                  </div>
                  <h3 className="empty-state-title">Awaiting Submission</h3>
                  <p className="empty-state-desc">
                    Compose your draft on the left or upload a document (.pdf, .docx, .txt).
                    Reed will evaluate syntactic depth, lexical density, and semantic rubric alignment.
                  </p>
                  <div className="pipeline-steps-list">
                    <div className="pipeline-step-item">
                      <span className="pipeline-step-num">01</span>
                      <div className="pipeline-step-content">
                        <strong>Lexical & Syntactic Depth</strong>
                        <span>Type-Token Ratio (TTR), word diversity, sentence length</span>
                      </div>
                    </div>
                    <div className="pipeline-step-item">
                      <span className="pipeline-step-num">02</span>
                      <div className="pipeline-step-content">
                        <strong>Calibrated 10-Band Regression</strong>
                        <span>Cross-validated ML scoring aligned to academic benchmarks</span>
                      </div>
                    </div>
                    <div className="pipeline-step-item">
                      <span className="pipeline-step-num">03</span>
                      <div className="pipeline-step-content">
                        <strong>Qualitative Editorial Feedback</strong>
                        <span>Structured strengths, developmental gaps, and writing critique</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="empty-state">
                  <div className="empty-state-avatar loading-avatar">
                    <RefreshIcon size={24} className="spin-icon" />
                  </div>
                  <h3 className="empty-state-title">Running NLP Pipeline</h3>
                  <p className="empty-state-desc">
                    Lemmatizing tokens, parsing syntactic structures, and evaluating
                    semantic cosine similarity against benchmark rubrics...
                  </p>
                </div>
              )}

              {result && (
                <div>
                  {/* Score hero with SVG Gauge & Letter Grade */}
                  <div className="score-hero-card">
                    <div className="score-ring-wrapper">
                      <ScoreRing score={result.score_100} size={84} />
                      <div className="score-ring-letter">
                        {getLetterGrade(result.score_100).grade}
                      </div>
                    </div>

                    <div className="score-main-block">
                      <div className="score-header-row">
                        <span className="band-label">Holistic Prediction</span>
                        <span className="grade-pill-tag">
                          Grade {getLetterGrade(result.score_100).grade} · {getLetterGrade(result.score_100).label}
                        </span>
                        {prevResult && prevResult.id !== result.id && (
                          (() => {
                            const delta = Math.round((result.score_100 - prevResult.score_100) * 10) / 10;
                            if (delta > 0) {
                              return (
                                <span className="delta-pill delta-pos">
                                  <TrendingUpIcon size={12} /> +{delta} pts vs prev
                                </span>
                              );
                            } else if (delta < 0) {
                              return (
                                <span className="delta-pill delta-neg">
                                  <TrendingDownIcon size={12} /> {delta} pts vs prev
                                </span>
                              );
                            }
                            return <span className="delta-pill delta-neu">±0 pts vs prev</span>;
                          })()
                        )}
                      </div>
                      <div className="score-display">
                        <span className="score-number">{result.score_100}</span>
                        <span className="score-scale">/ 100</span>
                      </div>
                    </div>

                    <div className="score-band-pill">
                      <div className="score-band-meta">
                        <span className="band-label">Calibrated Band</span>
                        <span className="band-value">{result.score_10} <small>/ 10</small></span>
                      </div>
                      <div className="score-band-actions">
                        <span className={`vocab-badge vocab-${(result.vocabulary_tier || 'good').toLowerCase()}`}>
                          {result.vocabulary_tier} Vocab
                        </span>
                        <button
                          type="button"
                          className={`btn-copy-report ${copied ? 'copied' : ''}`}
                          onClick={handleCopyFeedback}
                          title="Copy feedback report to clipboard"
                        >
                          {copied ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
                          <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          type="button"
                          className="btn-print-report"
                          onClick={handlePrint}
                          title="Print evaluation report or export as PDF"
                        >
                          <PrintIcon size={13} />
                          <span>Print PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quantitative Telemetry Metrics */}
                  <div className="metrics-grid">
                    <div className="metric-tile tile-words">
                      <span className="metric-label">Words</span>
                      <span className="metric-value">{result.metrics.word_count}</span>
                      <div className="metric-mini-bar">
                        <div
                          className="metric-mini-fill fill-info"
                          style={{ width: `${Math.min(100, (result.metrics.word_count / 500) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="metric-tile tile-sentences">
                      <span className="metric-label">Sentences</span>
                      <span className="metric-value">{result.metrics.sentence_count}</span>
                      <div className="metric-mini-bar">
                        <div
                          className="metric-mini-fill fill-success"
                          style={{ width: `${Math.min(100, (result.metrics.sentence_count / 30) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="metric-tile tile-lexical">
                      <span className="metric-label">Lexical Div.</span>
                      <span className="metric-value">{result.metrics.lexical_diversity}</span>
                      <div className="metric-mini-bar">
                        <div
                          className="metric-mini-fill fill-accent"
                          style={{ width: `${Math.min(100, (result.metrics.lexical_diversity || 0) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="metric-tile tile-avglen">
                      <span className="metric-label">Avg Sent. Len</span>
                      <span className="metric-value">{result.metrics.avg_sentence_length}</span>
                      <div className="metric-mini-bar">
                        <div
                          className="metric-mini-fill fill-warning"
                          style={{ width: `${Math.min(100, ((result.metrics.avg_sentence_length || 0) / 30) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="metric-tile tile-complex">
                      <span className="metric-label">Complex Words</span>
                      <span className="metric-value">{Math.round((result.metrics.complex_word_ratio || 0) * 100)}%</span>
                      <div className="metric-mini-bar">
                        <div
                          className="metric-mini-fill fill-danger"
                          style={{ width: `${Math.min(100, (result.metrics.complex_word_ratio || 0) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="metric-tile tile-readability">
                      <span className="metric-label">Readability</span>
                      <span className="metric-value">{result.feedback.readability_label || 'Standard'}</span>
                      <div className="metric-mini-bar">
                        <div className="metric-mini-fill fill-neutral" style={{ width: '70%' }} />
                      </div>
                    </div>
                  </div>

                  {/* 4-Dimension Rubric Breakdown */}
                  <div className="rubric-breakdown-card">
                    <div className="rubric-header">
                      <span className="rubric-title">
                        <LayersIcon size={14} />
                        <span>Rubric Assessment Breakdown</span>
                      </span>
                      <span className="rubric-scale">4 Dimensions · 25 Pts Max Each</span>
                    </div>
                    <div className="rubric-grid">
                      {calculateRubric(result).map((dim, idx) => (
                        <div key={idx} className="rubric-row">
                          <div className="rubric-row-top">
                            <div className="rubric-row-info">
                              <span className="rubric-dim-name">{dim.name}</span>
                              <span className="rubric-dim-desc">{dim.desc}</span>
                            </div>
                            <span className="rubric-dim-score mono">
                              <strong>{dim.score}</strong> <small>/ {dim.max}</small>
                            </span>
                          </div>
                          <div className="rubric-bar">
                            <div
                              className={`rubric-bar-fill rubric-fill-${idx}`}
                              style={{ width: `${Math.min(100, (dim.score / dim.max) * 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div className="feedback-container">
                    <blockquote className="feedback-editorial-summary">
                      {result.feedback.summary}
                    </blockquote>

                    {result.feedback.strengths && result.feedback.strengths.length > 0 && (
                      <div className="feedback-group feedback-group-strength">
                        <div className="feedback-header strength">
                          <CheckCircleIcon size={15} />
                          <span>Demonstrated Strengths</span>
                        </div>
                        <ul className="feedback-list">
                          {result.feedback.strengths.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.feedback.weaknesses && result.feedback.weaknesses.length > 0 && (
                      <div className="feedback-group feedback-group-weakness">
                        <div className="feedback-header weakness">
                          <AlertTriangleIcon size={15} />
                          <span>Development Opportunities</span>
                        </div>
                        <ul className="feedback-list">
                          {result.feedback.weaknesses.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.feedback.suggestions && result.feedback.suggestions.length > 0 && (
                      <div className="feedback-group feedback-group-suggestion">
                        <div className="feedback-header suggestion">
                          <LightbulbIcon size={15} />
                          <span>Editorial Suggestions</span>
                        </div>
                        <ul className="feedback-list">
                          {result.feedback.suggestions.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {/* Submissions history */}
        {activeTab === 'history' && (() => {
          const totalSubmissions = history.length;
          const avgHistoryScore = totalSubmissions > 0
            ? Math.round(history.reduce((acc, row) => acc + (row.score_100 || 0), 0) / totalSubmissions)
            : 0;
          const highestHistoryScore = totalSubmissions > 0
            ? Math.max(...history.map(row => row.score_100 || 0))
            : 0;
          const lowestHistoryScore = totalSubmissions > 0
            ? Math.min(...history.map(row => row.score_100 || 0))
            : 0;

          const filteredHistory = history.filter(row => {
            if (!historySearch.trim()) return true;
            const q = historySearch.toLowerCase();
            return (
              (row.student_name && row.student_name.toLowerCase().includes(q)) ||
              (row.prompt_title && row.prompt_title.toLowerCase().includes(q)) ||
              (row.vocabulary_quality && row.vocabulary_quality.toLowerCase().includes(q)) ||
              String(row.score_100).includes(q) ||
              String(row.id).includes(q)
            );
          });

          return (
            <section className="card-panel" aria-labelledby="history-heading">
              <div className="panel-header">
                <div className="panel-title-group">
                  <div className="title-icon-box">
                    <BookIcon size={17} />
                  </div>
                  <div>
                    <h2 id="history-heading" className="panel-title">Evaluated Submissions Ledger</h2>
                    <span className="panel-subtitle">Transactional record of student evaluations</span>
                  </div>
                </div>
                <div className="history-header-actions">
                  <div className="history-search-wrapper">
                    <SearchIcon size={13} />
                    <input
                      type="text"
                      className="history-search-input"
                      placeholder="Filter submissions..."
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                    />
                    {historySearch && (
                      <button type="button" className="btn-clear-search" onClick={() => setHistorySearch('')}>
                        <XIcon size={12} />
                      </button>
                    )}
                  </div>
                  <button className="btn-secondary-outline" onClick={fetchHistory}>
                    <RefreshIcon size={13} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* Class aggregate telemetry summary tiles */}
              {history.length > 0 && (
                <div className="history-summary-grid">
                  <div className="history-stat-card">
                    <span className="history-stat-label">Total Submissions</span>
                    <span className="history-stat-value mono">{totalSubmissions}</span>
                  </div>
                  <div className="history-stat-card">
                    <span className="history-stat-label">Cohort Average</span>
                    <span className="history-stat-value mono">{avgHistoryScore} <small>/ 100</small></span>
                  </div>
                  <div className="history-stat-card">
                    <span className="history-stat-label">Highest Benchmark</span>
                    <span className="history-stat-value mono stat-high">{highestHistoryScore} <small>/ 100</small></span>
                  </div>
                  <div className="history-stat-card">
                    <span className="history-stat-label">Lowest Benchmark</span>
                    <span className="history-stat-value mono stat-low">{lowestHistoryScore} <small>/ 100</small></span>
                  </div>
                </div>
              )}

              {loadingHistory ? (
                <div className="empty-state">
                  <div className="empty-state-avatar loading-avatar">
                    <RefreshIcon size={24} className="spin-icon" />
                  </div>
                  <p>Loading submission records...</p>
                </div>
              ) : history.length === 0 ? (
                <div className="empty-state">
                  <p>No evaluations recorded yet. Grade an essay from the Evaluate tab.</p>
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="empty-state">
                  <p>No submissions match your search query "{historySearch}".</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="editorial-table">
                    <thead>
                      <tr>
                        <th>Ref</th>
                        <th>Author</th>
                        <th>Topic</th>
                        <th>Words</th>
                        <th>Vocab</th>
                        <th>Score / 100</th>
                        <th>Band / 10</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistory.map((row) => (
                        <tr key={row.id}>
                          <td className="mono" style={{ color: 'var(--app-accent)', fontWeight: 600 }}>#{row.id}</td>
                          <td><strong>{row.student_name}</strong></td>
                          <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {row.prompt_title || 'General'}
                          </td>
                          <td className="mono">{row.word_count}</td>
                          <td>
                            <span className={`vocab-badge vocab-${(row.vocabulary_quality || 'good').toLowerCase()}`}>
                              {row.vocabulary_quality}
                            </span>
                          </td>
                          <td className="mono">
                            <span className="score-pill-value">{row.score_100}</span>
                          </td>
                          <td className="mono">
                            <span className="band-pill-highlight">{row.score_10} / 10</span>
                          </td>
                          <td className="mono" style={{ fontSize: '0.76rem', color: 'var(--app-ink-subtle)' }}>
                            {row.created_at}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          );
        })()}

        {/* Architecture */}
        {activeTab === 'about' && (
          <section className="card-panel" aria-labelledby="architecture-heading">
            <div className="panel-header">
              <div className="panel-title-group">
                <div className="title-icon-box title-icon-warning">
                  <LayersIcon size={17} />
                </div>
                <div>
                  <h2 id="architecture-heading" className="panel-title">System Architecture</h2>
                  <span className="panel-subtitle">End-to-end NLP and supervised ML pipeline</span>
                </div>
              </div>
              <span className="category-badge">Spec</span>
            </div>

            <p style={{ color: 'var(--app-ink-muted)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              The Reed essay intelligence pipeline replaces manual evaluation with an objective,
              reproducible pipeline integrating lexical statistics, syntactic POS parsing,
              and ensemble tree regressors calibrated against human-scored benchmarks.
            </p>

            <div className="arch-grid">
              <div className="arch-item arch-item-1">
                <div className="arch-item-header">
                  <span className="arch-step-badge badge-step-1">Step 01</span>
                  <h4>Text Preprocessing</h4>
                </div>
                <p>
                  Incoming drafts undergo sentence boundary detection, word tokenization,
                  punctuation filtering, stop-word elimination, and WordNet lemmatization
                  via NLTK to yield standardized lexical root tokens.
                </p>
              </div>

              <div className="arch-item arch-item-2">
                <div className="arch-item-header">
                  <span className="arch-step-badge badge-step-2">Step 02</span>
                  <h4>Feature Extraction</h4>
                </div>
                <p>
                  Extracts Type-Token Ratio (TTR / Lexical Diversity), average sentence length,
                  syllable distribution for complexity scoring, and TF-IDF vectors measuring
                  semantic cosine similarity against prompt benchmark rubrics.
                </p>
              </div>

              <div className="arch-item arch-item-3">
                <div className="arch-item-header">
                  <span className="arch-step-badge badge-step-3">Step 03</span>
                  <h4>Supervised ML Scoring</h4>
                </div>
                <p>
                  Feature vectors feed into a calibrated ensemble Random Forest Regressor
                  cross-validated to minimize Quadratic Weighted Kappa error against
                  human-scored benchmarks.
                </p>
              </div>

              <div className="arch-item arch-item-4">
                <div className="arch-item-header">
                  <span className="arch-step-badge badge-step-4">Step 04</span>
                  <h4>Feedback Generation</h4>
                </div>
                <p>
                  Maps regression outputs and feature disparities to structured qualitative
                  critique, highlighting grammatical stability, lexical depth, and concrete
                  developmental guidance.
                </p>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="footer" role="contentinfo">
        <div className="footer-container">
          <div className="footer-copy">
            <p><strong>Reed</strong> · Essay Intelligence</p>
            <p>Automated NLP scoring · Lexical analysis · Supervised ML regression</p>
          </div>
          <div className="footer-badge">Reed Engine</div>
        </div>
      </footer>

    </div>
  );
}
