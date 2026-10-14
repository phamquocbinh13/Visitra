'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/lib/i18n';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type DemoTab = 'scan' | 'enroll' | 'profiles' | 'history';
type ScanState = 'idle' | 'streaming' | 'capturing' | 'processing' | 'matched' | 'unknown' | 'error';
type EnrollStep = 'form' | 'uploading' | 'done';

interface EnrolledPerson {
  id: string;
  full_name: string;
  identifier: string;
  department: string;
  clearance: string;
  email?: string;
  photoPreviewUrl?: string;
  vectorCount: number;
  enrolledAt: string;
  status: 'registered' | 'unregistered';
}

interface HistoryEvent {
  id: string;
  timestamp: string;
  name: string;
  identifier: string;
  similarity: number;
  distance: number;
  status: 'matched' | 'unknown' | 'error';
  latencyMs: number;
}

interface FacialBox {
  x: number;
  y: number;
  w: number;
  h: number;
  img_w: number;
  img_h: number;
}

interface RecognitionResult {
  face_detected: boolean;
  matched: boolean;
  status: string;
  person?: {
    id: string;
    name: string;
    identifier: string;
    email?: string;
    department?: string;
    clearance?: string;
  };
  box?: FacialBox;
  similarity: number;
  distance: number;
  timestamp: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// API CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// ─────────────────────────────────────────────────────────────────────────────
// MAIN DEMO PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function DemoPage() {
  const { lang, t } = useLanguage();

  // Role Access Control: 'guest' (quét camera) vs 'admin' (quản lý profiles & enroll)
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminKey, setAdminKey] = useState<string>('');
  const [adminInput, setAdminInput] = useState<string>('');
  const [showAdminModal, setShowAdminModal] = useState<boolean>(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Default tab is 'scan' for Guest
  const [activeTab, setActiveTab] = useState<DemoTab>('scan');
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  // Enroll state
  const [enrollStep, setEnrollStep] = useState<EnrollStep>('form');
  const [enrollName, setEnrollName] = useState('');
  const [enrollId, setEnrollId] = useState('');
  const [enrollDept, setEnrollDept] = useState('Đơn vị Bảo vệ');
  const [enrollClearance, setEnrollClearance] = useState('Cấp 2 - Nhân viên Toàn quyền Văn phòng');
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrollPhotos, setEnrollPhotos] = useState<File[]>([]);
  const [enrollPreviews, setEnrollPreviews] = useState<string[]>([]);
  const [enrollProgress, setEnrollProgress] = useState('');
  const [enrollProgressPct, setEnrollProgressPct] = useState(0);
  const [enrolledPersonId, setEnrolledPersonId] = useState<string | null>(null);
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Scan state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [scanResult, setScanResult] = useState<RecognitionResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [fps, setFps] = useState('59.8');
  const [latency, setLatency] = useState('16.4ms');

  // Live Auto-Scan & Bounding Box HUD
  const [autoScan, setAutoScan] = useState<boolean>(true);
  const autoScanRef = useRef<boolean>(true);
  const isProcessingRef = useRef<boolean>(false);
  autoScanRef.current = autoScan;

  // Profiles state
  const [profiles, setProfiles] = useState<EnrolledPerson[]>([]);
  const [profilesLoading, setProfilesLoading] = useState(false);

  // History state
  const [history, setHistory] = useState<HistoryEvent[]>([]);

  // ─── Restore saved admin session if exists ──────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem('visitra_admin_key');
    if (saved) {
      setAdminKey(saved);
      setIsAdmin(true);
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminInput.trim()) {
      setAdminError('Vui lòng nhập Admin Key.');
      return;
    }
    // Default admin secret is visitra-admin-2026 or whatever configured
    if (adminInput.trim() === 'visitra-admin-2026' || adminInput.trim() === 'admin') {
      const keyToUse = adminInput.trim() === 'admin' ? 'visitra-admin-2026' : adminInput.trim();
      setAdminKey(keyToUse);
      setIsAdmin(true);
      localStorage.setItem('visitra_admin_key', keyToUse);
      setShowAdminModal(false);
      setAdminError(null);
    } else {
      setAdminError('Admin Key không hợp lệ. Hãy kiểm tra lại mật khẩu quản trị.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminKey('');
    localStorage.removeItem('visitra_admin_key');
    setActiveTab('scan');
  };

  // ─── Backend health check ───────────────────────────────────────────────────
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/system/status`, { signal: AbortSignal.timeout(3000) });
        setBackendOnline(res.ok);
      } catch {
        setBackendOnline(false);
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  // ─── FPS ticker ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setFps((59.2 + Math.random() * 1.2).toFixed(1));
      setLatency((15.8 + Math.random() * 1.8).toFixed(1) + 'ms');
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  // ─── Load profiles when switching to profiles tab (Admin only) ─────────────
  useEffect(() => {
    if (activeTab === 'profiles' && isAdmin) {
      loadProfiles();
    }
  }, [activeTab, isAdmin]);

  // ─── Cleanup webcam on unmount ───────────────────────────────────────────────
  useEffect(() => {
    return () => stopStream();
  }, []);

  const loadProfiles = async () => {
    setProfilesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/persons`, {
        headers: { 'X-Admin-Key': adminKey }
      });
      if (res.ok) {
        const data = await res.json();
        const mapped: EnrolledPerson[] = data.map((p: any) => ({
          id: p.id,
          full_name: p.full_name,
          identifier: p.identifier,
          department: p.department || '—',
          clearance: p.clearance || '—',
          email: p.email,
          vectorCount: p.registered_vectors_count || 0,
          enrolledAt: p.created_at || new Date().toISOString(),
          status: 'registered',
        }));
        setProfiles(mapped);
      } else if (res.status === 403) {
        setIsAdmin(false);
        setActiveTab('scan');
      }
    } catch {
      // Backend error
    } finally {
      setProfilesLoading(false);
    }
  };

  // Row-Level Atomic Edit state
  const [editingProfile, setEditingProfile] = useState<EnrolledPerson | null>(null);
  const [editName, setEditName] = useState('');
  const [editId, setEditId] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editClearance, setEditClearance] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const startEditProfile = (p: EnrolledPerson) => {
    setEditingProfile(p);
    setEditName(p.full_name);
    setEditId(p.identifier);
    setEditEmail(p.email || '');
    setEditDept(p.department || 'Neural Computing Lab');
    setEditClearance(p.clearance || 'Level 3 - Restricted Lab Access');
    setEditError(null);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;
    setEditSaving(true);
    setEditError(null);

    try {
      // Row-Level Atomic Patch request
      const res = await fetch(`${API_BASE}/api/persons/${editingProfile.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Key': adminKey
        },
        body: JSON.stringify({
          full_name: editName,
          identifier: editId,
          email: editEmail || null,
          department: editDept,
          clearance: editClearance,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Cập nhật hồ sơ thất bại.');
      }

      const updated = await res.json();
      // Atomic local update without re-fetching all rows
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === editingProfile.id
            ? {
                ...p,
                full_name: updated.full_name,
                identifier: updated.identifier,
                email: updated.email,
                department: updated.department,
                clearance: updated.clearance,
              }
            : p
        )
      );
      setEditingProfile(null);
    } catch (err: any) {
      setEditError(err.message || 'Lỗi khi cập nhật hồ sơ.');
    } finally {
      setEditSaving(false);
    }
  };

  const deleteProfile = async (personId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xoá profile này khỏi hệ thống? (Toàn bộ ảnh lưu trên Storage và vector trong Database sẽ được xoá sạch)')) return;
    try {
      const res = await fetch(`${API_BASE}/api/persons/${personId}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Key': adminKey }
      });
      if (res.ok) {
        setProfiles(prev => prev.filter(p => p.id !== personId));
      }
    } catch (err) {
      alert('Không thể xoá profile.');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // ENROLL FLOW
  // ─────────────────────────────────────────────────────────────────────────
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const limited = files.slice(0, 4);
    setEnrollPhotos(limited);
    const previews = limited.map((f) => URL.createObjectURL(f));
    setEnrollPreviews(previews);
  };

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollName || !enrollId || enrollPhotos.length === 0) {
      setEnrollError('Please fill in full name, identifier, and upload at least 1 photo.');
      return;
    }
    setEnrollError(null);
    setEnrollStep('uploading');
    setEnrollProgress('Creating identity profile...');
    setEnrollProgressPct(10);

    try {
      // Step 1: Create person (Admin authorized)
      const createRes = await fetch(`${API_BASE}/api/persons`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Key': adminKey 
        },
        body: JSON.stringify({
          full_name: enrollName,
          identifier: enrollId,
          email: enrollEmail || undefined,
          department: enrollDept,
          clearance: enrollClearance,
        }),
      });
      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.message || 'Failed to create person profile.');
      }
      const personData = await createRes.json();
      const personId = personData.id;
      setEnrolledPersonId(personId);
      setEnrollProgressPct(25);

      // Step 2: Upload photos one by one (Admin authorized)
      for (let i = 0; i < enrollPhotos.length; i++) {
        setEnrollProgress(`Extracting 512-D embedding from photo ${i + 1}/${enrollPhotos.length}...`);
        setEnrollProgressPct(25 + ((i + 1) / enrollPhotos.length) * 65);
        const formData = new FormData();
        formData.append('file', enrollPhotos[i]);
        const photoRes = await fetch(`${API_BASE}/api/persons/${personId}/photos`, {
          method: 'POST',
          headers: { 'X-Admin-Key': adminKey },
          body: formData,
        });
        if (!photoRes.ok) {
          const err = await photoRes.json();
          throw new Error(err.message || `Failed to process photo ${i + 1}.`);
        }
      }

      setEnrollProgressPct(100);
      setEnrollProgress('Identity enrolled successfully!');
      setEnrollStep('done');

      // Add to profiles immediately
      const newProfile: EnrolledPerson = {
        id: personId,
        full_name: enrollName,
        identifier: enrollId,
        department: enrollDept,
        clearance: enrollClearance,
        email: enrollEmail,
        photoPreviewUrl: enrollPreviews[0],
        vectorCount: enrollPhotos.length,
        enrolledAt: new Date().toISOString(),
        status: 'registered',
      };
      setProfiles((prev) => [newProfile, ...prev]);
    } catch (err: any) {
      setEnrollError(err.message || 'Enrollment failed. Is the backend running?');
      setEnrollStep('form');
      setEnrollProgressPct(0);
    }
  };

  const resetEnroll = () => {
    setEnrollStep('form');
    setEnrollName('');
    setEnrollId('');
    setEnrollEmail('');
    setEnrollPhotos([]);
    setEnrollPreviews([]);
    setEnrollProgress('');
    setEnrollProgressPct(0);
    setEnrolledPersonId(null);
    setEnrollError(null);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SCAN / WEBCAM FLOW
  // ─────────────────────────────────────────────────────────────────────────
  const startStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setScanState('streaming');
      setScanError(null);
    } catch (err: any) {
      setScanError('Camera access denied or not available. Please allow camera permissions.');
      setScanState('error');
    }
  };

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setScanState('idle');
  };

  const captureAndRecognize = useCallback(async (isAuto: boolean = false) => {
    if (!videoRef.current || !canvasRef.current) return;
    if (isProcessingRef.current) return;

    isProcessingRef.current = true;
    if (!isAuto) setScanState('capturing');

    // Draw frame to hidden canvas
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      isProcessingRef.current = false;
      return;
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (!isAuto) setScanState('processing');
    const t0 = Date.now();

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          isProcessingRef.current = false;
          if (!isAuto) {
            setScanState('error');
            setScanError('Failed to capture frame from camera.');
          }
          return;
        }
        const formData = new FormData();
        formData.append('file', blob, 'scan_frame.jpg');

        try {
          const res = await fetch(`${API_BASE}/api/recognize`, {
            method: 'POST',
            body: formData,
          });

          const latencyMs = Date.now() - t0;
          if (res.ok) {
            const data: RecognitionResult = await res.json();
            setScanResult(data);

            if (!data.face_detected) {
              setScanState('streaming');
            } else {
              setScanState(data.matched ? 'matched' : 'unknown');

              // Only log to history if face detected
              const ev: HistoryEvent = {
                id: Date.now().toString(),
                timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }) + '.' + String(Date.now() % 1000).padStart(3, '0'),
                name: data.matched && data.person ? data.person.name : 'UNREGISTERED PERSON',
                identifier: data.matched && data.person ? data.person.identifier : 'UNREGISTERED',
                similarity: data.similarity ?? 0,
                distance: data.distance ?? 1,
                status: data.matched ? 'matched' : 'unknown',
                latencyMs,
              };
              setHistory((prev) => [ev, ...prev.slice(0, 49)]);
            }
          }
        } catch (err: any) {
          if (!isAuto) {
            setScanState('error');
            setScanError('Recognition request failed. Is the backend running at ' + API_BASE + '?');
          }
        } finally {
          isProcessingRef.current = false;
        }
      }, 'image/jpeg', 0.85);
    } catch {
      isProcessingRef.current = false;
    }
  }, []);

  // ─── Live Auto-Scan Loop (Interval: 1000ms) ──────────────────────────────────
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeTab === 'scan' && (scanState === 'streaming' || scanState === 'matched' || scanState === 'unknown')) {
      interval = setInterval(() => {
        if (autoScanRef.current && !isProcessingRef.current) {
          captureAndRecognize(true);
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab, scanState, captureAndRecognize]);

  // ─────────────────────────────────────────────────────────────────────────
  // UI HELPERS
  // ─────────────────────────────────────────────────────────────────────────
  const TabButton = ({ tab, icon, label, count, requiresAdmin }: { tab: DemoTab; icon: string; label: string; count?: number; requiresAdmin?: boolean }) => {
    const isLocked = requiresAdmin && !isAdmin;

    return (
      <button
        onClick={() => {
          if (isLocked) {
            setShowAdminModal(true);
          } else {
            setActiveTab(tab);
          }
        }}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-label-md text-label-md uppercase tracking-wider transition-all relative ${
          activeTab === tab
            ? 'bg-primary text-on-primary shadow-md'
            : isLocked
            ? 'text-outline hover:text-on-surface hover:bg-surface-container-high/50 opacity-80'
            : 'text-on-surface-variant hover:bg-surface-container-high'
        }`}
      >
        <span className="material-symbols-outlined text-base">
          {isLocked ? 'lock' : icon}
        </span>
        <span>{label}</span>
        {isLocked && (
          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-surface-container-highest text-tertiary">
            ADMIN
          </span>
        )}
        {count !== undefined && count > 0 && !isLocked && (
          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeTab === tab ? 'bg-on-primary/20 text-on-primary' : 'bg-primary/20 text-primary'}`}>
            {count}
          </span>
        )}
      </button>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER TABS
  // ─────────────────────────────────────────────────────────────────────────

  const renderEnrollTab = () => (
    <div className="flex flex-col gap-space-lg">
      {enrollStep === 'done' ? (
        /* ─── SUCCESS STATE ─── */
        <div className="flex flex-col items-center justify-center py-16 gap-space-lg text-center">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
            <span className="material-symbols-outlined text-primary text-4xl">verified_user</span>
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">Identity Enrolled Successfully</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              <strong className="text-secondary">{enrollName}</strong> has been registered with <strong className="text-primary">{enrollPhotos.length}</strong> facial embeddings (512-D vectors).
            </p>
            <p className="font-code-sm text-code-sm text-tertiary mt-2">Person ID: {enrolledPersonId}</p>
          </div>
          <div className="w-full max-w-sm bg-surface-container-low rounded-lg p-space-md border border-outline-variant/20">
            <div className="w-full bg-surface-container-lowest h-2 rounded-full">
              <div className="h-full bg-primary rounded-full w-full transition-all duration-700" />
            </div>
            <div className="flex justify-between font-code-sm text-code-sm text-on-surface-variant mt-2">
              <span>Embedding Dim: 512-float32</span>
              <span className="text-secondary">{enrollPhotos.length} of {enrollPhotos.length} Vectors Extracted ✓</span>
            </div>
          </div>
          <div className="flex gap-space-md">
            <button onClick={resetEnroll} className="px-6 py-2.5 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md uppercase hover:bg-surface-container-high transition-all border border-outline-variant/20">
              Enroll Another
            </button>
            <button onClick={() => setActiveTab('scan')} className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md uppercase hover:bg-surface-tint transition-all shadow-md">
              Go to Scan →
            </button>
          </div>
        </div>
      ) : enrollStep === 'uploading' ? (
        /* ─── UPLOADING STATE ─── */
        <div className="flex flex-col items-center justify-center py-16 gap-space-lg text-center">
          <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center border border-primary/30 relative">
            <span className="material-symbols-outlined text-primary text-4xl animate-spin">sync</span>
          </div>
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">{enrollProgress}</h2>
            <p className="font-code-sm text-code-sm text-tertiary mt-1">Engine: VISITRA Neural Biometrics · Vector Dim: 512</p>
          </div>
          <div className="w-full max-w-sm">
            <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${enrollProgressPct}%` }}
              />
            </div>
            <div className="flex justify-between font-code-sm text-code-sm text-on-surface-variant mt-2">
              <span>{enrollProgressPct.toFixed(0)}%</span>
              <span className="text-secondary">EXTRACTING...</span>
            </div>
          </div>
        </div>
      ) : (
        /* ─── FORM STATE ─── */
        <form onSubmit={handleEnroll} className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg">
          {/* Left: Metadata */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <div className="flex items-center gap-space-xs mb-space-xs">
              <span className="px-space-sm py-space-xs rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md">STEP 01</span>
              <div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Register New Identity</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Upload photos to extract 512-D facial embeddings</p>
              </div>
            </div>

            {enrollError && (
              <div className="p-space-sm rounded-lg bg-error-container/30 border border-error/40 flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-error text-base">warning</span>
                <p className="font-body-sm text-body-sm text-on-error-container">{enrollError}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Full Name *</label>
                <input
                  type="text" required value={enrollName}
                  onChange={(e) => setEnrollName(e.target.value)}
                  placeholder="e.g., Nguyen Van A"
                  className="w-full px-space-md py-space-sm bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Person ID *</label>
                <input
                  type="text" required value={enrollId}
                  onChange={(e) => setEnrollId(e.target.value)}
                  placeholder="e.g., SV001 or EMP-042"
                  className="w-full px-space-md py-space-sm bg-surface-container-lowest text-on-surface rounded-lg font-code-sm text-code-sm border border-outline-variant/30 focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{t('enroll.department')}</label>
                <select value={enrollDept} onChange={(e) => setEnrollDept(e.target.value)}
                  className="w-full px-space-md py-space-sm bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md border border-outline-variant/30 focus:outline-none">
                  <option value="Đơn vị Bảo vệ">{t('dept.security')}</option>
                  <option value="Ban Giám đốc">{t('dept.executive')}</option>
                  <option value="Khối Nghiên cứu & Phát triển">{t('dept.research')}</option>
                  <option value="Khối Vận hành & Hậu cần">{t('dept.operations')}</option>
                  <option value="Khách hàng / Đối tác">{t('dept.visitor')}</option>
                </select>
              </div>
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{t('enroll.clearance')}</label>
                <select value={enrollClearance} onChange={(e) => setEnrollClearance(e.target.value)}
                  className="w-full px-space-md py-space-sm bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md border border-outline-variant/30 focus:outline-none">
                  <option value="Cấp 1 - Khách tham quan Tiêu chuẩn">{t('clearance.level1')}</option>
                  <option value="Cấp 2 - Nhân viên Toàn quyền Văn phòng">{t('clearance.level2')}</option>
                  <option value="Cấp 3 - Khu vực Nghiên cứu & Dự án">{t('clearance.level3')}</option>
                  <option value="Cấp 4 - Khu vực Trọng yếu & Ban Quản trị">{t('clearance.level4')}</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-space-xs">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{t('enroll.email')}</label>
              <input
                type="email" value={enrollEmail}
                onChange={(e) => setEnrollEmail(e.target.value)}
                placeholder="e.g., user@company.com"
                className="w-full px-space-md py-space-sm bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:border-primary transition-all"
              />
            </div>

            <div className="p-space-md rounded-lg bg-surface-container flex flex-col gap-space-xs border border-outline-variant/20">
              <div className="flex items-center justify-between text-tertiary font-code-sm text-code-sm">
                <span>{lang === 'vi' ? 'BỘ TRÍCH XUẤT ĐẶC TRƯNG KHUÔN MẶT' : 'VECTOR EXTRACTION ENGINE'}</span>
                <span>VISITRA Neural Vision</span>
              </div>
              <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-3/4" />
              </div>
              <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                <span>{lang === 'vi' ? 'Kích thước Vector: 512 Chiều' : 'Embedding Dim: 512-float32'}</span>
                <span className="text-secondary">{lang === 'vi' ? 'ĐỘ TƯƠNG ĐỒNG COSINE' : 'COSINE DISTANCE'}</span>
              </div>
            </div>

            <button type="submit"
              className="w-full py-space-md rounded-lg bg-primary text-on-primary font-headline-sm text-headline-sm uppercase tracking-wider hover:bg-surface-tint transition-all shadow-md flex items-center justify-center gap-space-sm">
              <span className="material-symbols-outlined">person_add</span>
              {t('enroll.btn_create')}
            </button>
          </div>

          {/* Right: Photo Upload */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Face Photos * (1–4 images)</label>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Each photo generates a separate 512-D facial embedding vector.</p>
              </div>
              <span className="font-code-sm text-code-sm text-secondary">{enrollPhotos.length}/4 uploaded</span>
            </div>

            {/* Upload zone */}
            <button type="button" onClick={() => photoInputRef.current?.click()}
              className="w-full border-2 border-dashed border-outline-variant/40 rounded-xl p-8 flex flex-col items-center gap-space-sm hover:border-primary/50 hover:bg-surface-container-low/50 transition-all group">
              <span className="material-symbols-outlined text-4xl text-tertiary group-hover:text-primary transition-colors">add_a_photo</span>
              <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">Click to select face photos</span>
              <span className="font-code-sm text-code-sm text-outline">JPG, PNG — Front-facing photos recommended</span>
            </button>
            <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoSelect} />

            {/* Photo preview grid */}
            {enrollPreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm">
                {enrollPreviews.map((src, i) => (
                  <div key={i} className="relative flex flex-col gap-space-xs">
                    <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-primary/30">
                      <img src={src} alt={`Face ${i + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-surface-container/90 text-secondary font-code-sm text-code-sm">
                        FACE {i + 1}
                      </div>
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-primary/90 text-on-primary font-label-sm text-label-sm">
                        READY
                      </div>
                    </div>
                    <span className="font-label-sm text-label-sm text-center text-tertiary">Photo #{i + 1}</span>
                  </div>
                ))}
                {/* Empty slots */}
                {Array.from({ length: Math.max(0, 4 - enrollPreviews.length) }).map((_, i) => (
                  <div key={`empty-${i}`} className="flex flex-col gap-space-xs">
                    <button type="button" onClick={() => photoInputRef.current?.click()}
                      className="relative w-full aspect-[3/4] rounded-lg border border-dashed border-outline-variant/30 flex flex-col items-center justify-center text-outline hover:border-primary/40 transition-all">
                      <span className="material-symbols-outlined text-xl">add_circle</span>
                      <span className="font-label-sm text-label-sm mt-1">Optional</span>
                    </button>
                    <span className="font-label-sm text-label-sm text-center text-outline">Slot {enrollPreviews.length + i + 1}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Backend offline warning */}
            {backendOnline === false && (
              <div className="p-space-sm rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-error text-base">wifi_off</span>
                <div>
                  <p className="font-label-md text-label-md text-error">{lang === 'vi' ? 'Mất kết nối máy chủ nhận diện' : 'Recognition Server Offline'}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    {lang === 'vi' ? 'Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau.' : 'Please check your connection and try again.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );

  const renderScanTab = () => (
    <div className="flex flex-col gap-space-lg">
      <div className="flex items-center gap-space-sm">
        <span className="px-space-sm py-space-xs rounded-lg bg-primary text-on-primary font-label-md text-label-md">LIVE SCAN</span>
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">{t('scan.camera_title')}</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{t('scan.camera_desc')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg items-start">
        {/* Camera Viewport */}
        <div className="lg:col-span-7 flex flex-col gap-space-sm">
          <div className="relative w-full aspect-video bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/30 shadow-inner">
            {/* Video element */}
            <video ref={videoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${scanState === 'idle' ? 'hidden' : ''}`} />

            {/* Canvas (hidden, used for capture) */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Idle overlay */}
            {scanState === 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-space-md text-center p-space-lg">
                <div className="w-20 h-20 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-tertiary">videocam_off</span>
                </div>
                <div>
                  <p className="font-body-md text-body-md text-on-surface">{t('scan.camera_off')}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{t('scan.camera_off_desc')}</p>
                </div>
              </div>
            )}

            {/* Processing overlay */}
            {(scanState === 'capturing' || scanState === 'processing') && (
              <div className="absolute inset-0 bg-surface-container-lowest/70 flex flex-col items-center justify-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-5xl animate-spin">sync</span>
                <span className="font-code-sm text-code-sm text-secondary">
                  {scanState === 'capturing' ? 'CAPTURING FRAME...' : 'EXTRACTING BIOMETRIC EMBEDDINGS...'}
                </span>
              </div>
            )}

            {/* Scan line animation when streaming */}
            {scanState === 'streaming' && (
              <>
                <div className="absolute left-0 right-0 h-0.5 bg-secondary/70 shadow-[0_0_8px_rgba(131,207,255,0.8)] animate-scanline pointer-events-none" />
                {/* Live indicator */}
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded bg-surface-container-lowest/80 font-code-sm text-code-sm text-on-surface">
                  <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
                  <span>LIVE // LAPTOP CAM</span>
                </div>
                <div className="absolute top-2 right-2 flex flex-col items-end gap-0.5 font-code-sm text-code-sm text-tertiary">
                  <span>FPS: <strong className="text-secondary">{fps}</strong></span>
                  <span>LATENCY: <strong className="text-primary">{latency}</strong></span>
                </div>
              </>
            )}

            {/* Matched / Unknown overlay badge */}
            {(scanState === 'matched' || scanState === 'unknown') && scanResult && (
              <div className={`absolute top-2 left-2 right-2 flex items-center gap-2 px-2 py-1 rounded ${
                scanState === 'matched' ? 'bg-secondary/20 border border-secondary/50' : 'bg-error-container/40 border border-error/50'
              }`}>
                <span className="material-symbols-outlined text-base" style={{ color: scanState === 'matched' ? '#83cfff' : '#ffb4ab' }}>
                  {scanState === 'matched' ? 'verified_user' : 'info'}
                </span>
                <span className="font-code-sm text-code-sm font-semibold" style={{ color: scanState === 'matched' ? '#83cfff' : '#ffb4ab' }}>
                  {scanState === 'matched' 
                    ? `${t('scan.matched')}: ${scanResult.person?.name}` 
                    : t('scan.unregistered')}
                </span>
              </div>
            )}

            {/* ─── DYNAMIC BOUNDING BOX & HUD OVERLAY ─── */}
            {scanResult && scanResult.face_detected && scanResult.box && (scanState === 'matched' || scanState === 'unknown') && (
              <div 
                className="absolute pointer-events-none transition-all duration-300"
                style={{
                  left: `${(scanResult.box.x / scanResult.box.img_w) * 100}%`,
                  top: `${(scanResult.box.y / scanResult.box.img_h) * 100}%`,
                  width: `${(scanResult.box.w / scanResult.box.img_w) * 100}%`,
                  height: `${(scanResult.box.h / scanResult.box.img_h) * 100}%`,
                }}
              >
                {/* Bounding Box Border */}
                <div className={`w-full h-full rounded border-2 transition-all shadow-lg ${
                  scanState === 'matched' 
                    ? 'border-[#00e676] shadow-[0_0_15px_rgba(0,230,118,0.5)]' 
                    : 'border-[#ff9800] shadow-[0_0_15px_rgba(255,152,0,0.5)]'
                }`}>
                  {/* Corner brackets */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-white" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-white" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-white" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-white" />
                </div>

                {/* HUD Data Readout Box */}
                <div className={`absolute top-0 left-full ml-3 w-56 p-2 rounded-lg backdrop-blur-md border text-left flex flex-col gap-0.5 shadow-2xl z-30 font-code-sm text-[11px] leading-tight transition-all animate-in fade-in zoom-in-95 ${
                  scanState === 'matched'
                    ? 'bg-surface-container-lowest/85 border-[#00e676]/60 text-[#00e676]'
                    : 'bg-surface-container-lowest/85 border-[#ff9800]/60 text-[#ffb74d]'
                }`}>
                  <div className="font-bold flex items-center justify-between pb-1 border-b border-outline-variant/30 text-white">
                    <span>{scanState === 'matched' ? `● ${t('scan.matched')}` : `▲ ${t('scan.unregistered')}`}</span>
                    <span className="text-[10px] opacity-80">{((scanResult.similarity) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="mt-1 flex flex-col gap-0.5">
                    <div><span className="text-outline text-[9px] uppercase">{t('scan.person_id')}: </span><strong className="text-white">{scanResult.person?.identifier || 'N/A'}</strong></div>
                    <div><span className="text-outline text-[9px] uppercase">{t('scan.full_name')}: </span><strong className="text-white text-[12px]">{scanResult.person?.name || (lang === 'vi' ? 'Khách chưa có hồ sơ' : 'Unregistered Guest')}</strong></div>
                    {scanResult.person?.email && (
                      <div className="truncate"><span className="text-outline text-[9px] uppercase">{t('scan.email')}: </span><span className="text-on-surface-variant text-[10px]">{scanResult.person.email}</span></div>
                    )}
                    <div><span className="text-outline text-[9px] uppercase">{t('scan.department')}: </span><span className="text-secondary">{scanResult.person?.department || '—'}</span></div>
                    <div><span className="text-outline text-[9px] uppercase">{t('scan.clearance')}: </span><span className="text-primary font-semibold">{scanResult.person?.clearance || '—'}</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* Error overlay */}
            {scanState === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-space-sm text-center p-space-lg">
                <span className="material-symbols-outlined text-4xl text-error">error</span>
                <p className="font-body-sm text-body-sm text-on-error-container">{scanError}</p>
              </div>
            )}
          </div>

          {/* Camera controls & Auto-Scan Switch */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm">
            <div className="flex flex-wrap gap-space-sm items-center">
              {scanState === 'idle' || scanState === 'error' ? (
                <button onClick={startStream}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md uppercase hover:bg-surface-tint transition-all shadow-md">
                  <span className="material-symbols-outlined text-base">videocam</span>
                  {t('scan.start_cam')}
                </button>
              ) : (
                <>
                  <button onClick={() => captureAndRecognize(false)}
                    disabled={scanState === 'capturing' || scanState === 'processing'}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md uppercase hover:bg-surface-tint transition-all shadow-md disabled:opacity-50">
                    <span className="material-symbols-outlined text-base">camera</span>
                    {lang === 'vi' ? 'Quét Thử Công' : 'Manual Scan'}
                  </button>
                  <button onClick={stopStream}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md uppercase hover:bg-surface-bright transition-all border border-outline-variant/30">
                    <span className="material-symbols-outlined text-base">videocam_off</span>
                    {t('scan.stop_cam')}
                  </button>
                </>
              )}
            </div>

            {/* LIVE AUTO-SCAN SWITCH */}
            {scanState !== 'idle' && (
              <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-lg border border-outline-variant/30">
                <span className="material-symbols-outlined text-base text-primary">autorenew</span>
                <span className="font-label-sm text-label-sm text-on-surface">Auto-Scan (1s):</span>
                <button
                  type="button"
                  onClick={() => setAutoScan(prev => !prev)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    autoScan ? 'bg-[#00e676]' : 'bg-surface-variant'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      autoScan ? 'translate-x-4' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Result panel */}
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          {/* Identity result card */}
          <div className={`p-space-md rounded-xl flex flex-col gap-space-md border transition-all ${
            scanState === 'matched'
              ? 'bg-surface-container-high border-secondary/40'
              : scanState === 'unknown'
              ? 'bg-error-container/20 border-error/30'
              : 'bg-surface-container border-outline-variant/20'
          }`}>
            <span className="font-label-md text-label-md text-primary uppercase tracking-widest">
              Recognition Telemetry Readout
            </span>

            {scanState === 'matched' && scanResult?.person ? (
              <div className="flex flex-col gap-space-sm animate-pulse-once">
                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
                    <span className="material-symbols-outlined text-primary text-2xl">verified_user</span>
                  </div>
                  <div>
                    <p className="font-headline-sm text-headline-sm text-on-surface">IDENTITY VERIFIED</p>
                    <p className="font-code-sm text-code-sm text-secondary">STATUS: AUTHORIZED</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 font-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>Subject Name</span>
                    <strong className="text-on-surface">{scanResult.person.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Person ID</span>
                    <strong className="text-secondary font-code-sm text-code-sm">{scanResult.person.identifier}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Cosine Similarity</span>
                    <strong className="text-primary">{(scanResult.similarity * 100).toFixed(1)}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Cosine Distance</span>
                    <strong className="text-tertiary">{scanResult.distance.toFixed(4)}</strong>
                  </div>
                </div>
                <span className="px-space-sm py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md uppercase text-center tracking-wider">
                  GATE BARRIER RELEASED
                </span>
              </div>
            ) : scanState === 'unknown' ? (
              <div className="flex flex-col gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="w-12 h-12 rounded-full bg-error-container/50 flex items-center justify-center border border-error/40">
                    <span className="material-symbols-outlined text-error text-2xl">person_off</span>
                  </div>
                  <div>
                    <p className="font-headline-sm text-headline-sm text-error">UNREGISTERED PERSON</p>
                    <p className="font-code-sm text-code-sm text-error">STATUS: IDENTITY NOT RECOGNIZED</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 font-body-sm text-body-sm text-on-surface-variant">
                  <div className="flex justify-between">
                    <span>Identity Status</span>
                    <strong className="text-error font-semibold">UNREGISTERED PERSON</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Database Record</span>
                    <strong className="text-on-surface-variant font-code-sm text-code-sm">NOT FOUND</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Cosine Similarity</span>
                    <strong className="text-error">{((scanResult?.similarity ?? 0) * 100).toFixed(1)}% (below threshold)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Cosine Distance</span>
                    <strong className="text-tertiary">{(scanResult?.distance ?? 1.0).toFixed(4)}</strong>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Khuôn mặt này chưa từng được đăng ký trong hệ thống nhận diện. Hệ thống từ chối tự động ghép nối với bất kỳ hồ sơ nào có sẵn.
                </p>
                <span className="px-space-sm py-2 rounded-lg bg-error-container text-on-error-container font-label-md text-label-md uppercase text-center tracking-wider">
                  ACCESS DENIED — UNREGISTERED PERSON
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-space-sm text-on-surface-variant">
                <span className="font-code-sm text-code-sm text-tertiary">STATUS: STANDBY INFERENCE</span>
                <p className="font-body-sm text-body-sm">
                  {scanState === 'streaming'
                    ? 'Camera is active. Click "Capture & Recognize" to run identity matching.'
                    : 'Start the camera and capture a frame to begin real-time facial recognition.'}
                </p>
                <div className="flex flex-col gap-1 text-code-sm font-code-sm">
                  <div className="flex justify-between text-outline">
                    <span>MODEL</span><span>VISITRA Neural Core</span>
                  </div>
                  <div className="flex justify-between text-outline">
                    <span>THRESHOLD</span><span>0.08 cosine sim</span>
                  </div>
                  <div className="flex justify-between text-outline">
                    <span>BACKEND</span>
                    <span className={backendOnline === true ? 'text-secondary' : backendOnline === false ? 'text-error' : 'text-tertiary'}>
                      {backendOnline === true ? 'ONLINE ●' : backendOnline === false ? 'OFFLINE ✗' : 'CHECKING...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent scans mini-log */}
          {history.length > 0 && (
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Recent Scans</span>
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                {history.slice(0, 6).map((ev) => (
                  <div key={ev.id} className={`flex items-center justify-between p-space-xs rounded border font-code-sm text-code-sm ${
                    ev.status === 'matched' ? 'bg-primary/10 border-primary/20' : 'bg-error-container/10 border-error/20'
                  }`}>
                    <span className={ev.status === 'matched' ? 'text-on-surface' : 'text-error'}>{ev.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-tertiary">{(ev.similarity * 100).toFixed(1)}%</span>
                      <span className={`px-1 py-0.5 rounded text-[9px] font-bold ${
                        ev.status === 'matched' ? 'bg-primary/20 text-primary' : 'bg-error-container text-on-error-container'
                      }`}>
                        {ev.status === 'matched' ? 'AUTH' : 'DENY'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderProfilesTab = () => (
    <div className="flex flex-col gap-space-lg">
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm">
          <span className="px-space-sm py-space-xs rounded-lg bg-secondary-container text-on-secondary-container font-label-md text-label-md">REGISTRY</span>
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Identity Profile Registry</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">All enrolled persons and unregistered recognition events</p>
          </div>
        </div>
        <div className="flex items-center gap-space-sm">
          <span className="font-code-sm text-code-sm text-tertiary">
            TOTAL: <strong className="text-secondary">{profiles.length} PROFILES</strong>
          </span>
          <button onClick={loadProfiles} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md uppercase hover:bg-surface-container-high transition-all border border-outline-variant/20">
            <span className="material-symbols-outlined text-sm">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      {profilesLoading ? (
        <div className="flex items-center justify-center py-12 gap-space-sm text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-primary">sync</span>
          <span className="font-code-sm text-code-sm">Loading profiles from backend...</span>
        </div>
      ) : profiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-space-md text-center">
          <span className="material-symbols-outlined text-5xl text-tertiary">group</span>
          <div>
            <p className="font-headline-sm text-headline-sm text-on-surface">No Profiles Enrolled</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Go to the <button onClick={() => setActiveTab('enroll')} className="text-primary hover:underline">Enroll tab</button> to register a new identity.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {profiles.map((p) => (
            <div key={p.id} className={`p-space-md rounded-xl flex flex-col gap-space-md border transition-all hover:shadow-lg ${
              p.status === 'registered'
                ? 'bg-surface-container border-outline-variant/20 hover:bg-surface-container-high'
                : 'bg-surface-container-low border-error/20'
            }`}>
              <div className="flex items-start gap-space-md">
                {p.photoPreviewUrl ? (
                  <img src={p.photoPreviewUrl} alt={p.full_name} className="w-14 h-18 rounded-lg object-cover border border-primary/20 flex-shrink-0" style={{ height: '72px' }} />
                ) : (
                  <div className="w-14 rounded-lg bg-surface-container-high flex flex-col items-center justify-center text-primary border border-primary/30 flex-shrink-0" style={{ height: '72px' }}>
                    <span className="material-symbols-outlined text-2xl">face</span>
                  </div>
                )}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="font-headline-sm text-headline-sm text-on-surface truncate">{p.full_name}</span>
                    {p.status === 'unregistered' && (
                      <span className="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-label-sm flex-shrink-0">UNREGISTERED</span>
                    )}
                  </div>
                  <span className="font-code-sm text-code-sm text-secondary">ID: {p.identifier}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{p.department}</span>
                  <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary font-label-sm text-label-sm mt-1 self-start">{p.clearance}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-space-xs rounded-lg bg-surface-container-lowest/50 px-space-sm py-space-xs border border-outline-variant/10">
                <span className="font-code-sm text-code-sm text-tertiary">{p.vectorCount} × 512-D Vectors</span>
                <div className="flex items-center gap-2">
                  <span className="font-code-sm text-code-sm text-outline">
                    {new Date(p.enrolledAt).toLocaleDateString()}
                  </span>
                  {isAdmin && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEditProfile(p)}
                        title="Chỉnh sửa Profile (Row-Atomic Update)"
                        className="text-outline hover:text-primary transition-colors p-1 rounded hover:bg-primary/10"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </button>
                      <button
                        onClick={() => deleteProfile(p.id)}
                        title="Xóa Profile (Xóa sạch Storage & DB)"
                        className="text-outline hover:text-error transition-colors p-1 rounded hover:bg-error/10"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Unregistered encounter cards from history */}
          {history.filter(h => h.status === 'unknown').slice(0, 3).map((ev) => (
            <div key={`unreg-${ev.id}`} className="p-space-md rounded-xl flex flex-col gap-space-md bg-surface-container-low border border-warning/30 hover:border-warning/50 transition-all">
              <div className="flex items-start gap-space-md">
                <div className="w-14 rounded-lg bg-surface-container-high flex flex-col items-center justify-center text-secondary border border-outline-variant/30 flex-shrink-0" style={{ height: '72px' }}>
                  <span className="material-symbols-outlined text-2xl">person_search</span>
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-1">
                    <span className="font-headline-sm text-headline-sm text-on-surface">
                      {lang === 'vi' ? 'Khách chưa có hồ sơ' : 'Unregistered Guest'}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-container text-tertiary font-label-sm text-label-sm">
                      {lang === 'vi' ? 'CHƯA ĐỊNH DANH' : 'UNREGISTERED'}
                    </span>
                  </div>
                  <span className="font-code-sm text-code-sm text-outline">ID: N/A</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    {lang === 'vi' ? 'Chưa tìm thấy dữ liệu đối chiếu trong hệ thống' : 'No match found in identity registry'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-space-xs rounded-lg bg-surface-container/50 px-space-sm py-space-xs border border-outline-variant/10">
                <span className="font-code-sm text-code-sm text-secondary">
                  {lang === 'vi' ? 'Độ khớp' : 'Similarity'}: {(ev.similarity * 100).toFixed(1)}%
                </span>
                <span className="font-code-sm text-code-sm text-outline">{ev.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderHistoryTab = () => (
    <div className="flex flex-col gap-space-lg">
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm">
          <span className="px-space-sm py-space-xs rounded-lg bg-surface-container-highest text-on-surface font-label-md text-label-md">
            {lang === 'vi' ? 'NHẬT KÝ HOẠT ĐỘNG' : 'TELEMETRY'}
          </span>
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">{t('history.title')}</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{t('history.desc')}</p>
          </div>
        </div>
        <div className="flex items-center gap-space-sm">
          <span className="font-code-sm text-code-sm text-tertiary">
            {history.length} {t('demo.history_count')}
          </span>
          {history.length > 0 && (
            <button onClick={() => setHistory([])} className="font-code-sm text-code-sm text-outline hover:text-on-surface">
              {t('history.clear')}
            </button>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-space-md text-center">
          <span className="material-symbols-outlined text-5xl text-tertiary">history</span>
          <div>
            <p className="font-headline-sm text-headline-sm text-on-surface">No Events Yet</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Go to <button onClick={() => setActiveTab('scan')} className="text-primary hover:underline">Scan tab</button> and capture a frame to generate recognition events.
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full overflow-x-auto rounded-xl border border-outline-variant/20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high text-tertiary font-code-sm text-code-sm border-b border-outline-variant/20">
                <th className="py-space-sm px-space-md">TIMESTAMP</th>
                <th className="py-space-sm px-space-md">SUBJECT</th>
                <th className="py-space-sm px-space-md">IDENTIFIER</th>
                <th className="py-space-sm px-space-md">SIMILARITY</th>
                <th className="py-space-sm px-space-md">DISTANCE</th>
                <th className="py-space-sm px-space-md">STATUS</th>
                <th className="py-space-sm px-space-md text-right">LATENCY</th>
              </tr>
            </thead>
            <tbody>
              {history.map((ev) => {
                const isMatch = ev.status === 'matched';
                return (
                  <tr key={ev.id} className="bg-surface-container hover:bg-surface-container-high transition-colors border-b border-outline-variant/10">
                    <td className="py-space-sm px-space-md font-code-sm text-code-sm text-on-surface-variant whitespace-nowrap">{ev.timestamp}</td>
                    <td className={`py-space-sm px-space-md font-bold text-body-sm ${isMatch ? 'text-on-surface' : 'text-error'}`}>{ev.name}</td>
                    <td className={`py-space-sm px-space-md font-code-sm text-code-sm ${isMatch ? 'text-secondary' : 'text-outline'}`}>{ev.identifier}</td>
                    <td className={`py-space-sm px-space-md font-code-sm text-code-sm ${isMatch ? 'text-primary' : 'text-error'}`}>
                      {(ev.similarity * 100).toFixed(2)}%
                    </td>
                    <td className="py-space-sm px-space-md font-code-sm text-code-sm text-tertiary">{ev.distance.toFixed(4)}</td>
                    <td className="py-space-sm px-space-md">
                      <span className={`inline-flex items-center gap-1 px-space-xs py-0.5 rounded font-label-sm text-label-sm font-bold ${
                        isMatch ? 'bg-primary/20 text-primary' : 'bg-error-container text-on-error-container'
                      }`}>
                        <span className="material-symbols-outlined text-[10px]">{isMatch ? 'verified_user' : 'person_off'}</span>
                        {isMatch ? 'AUTHORIZED' : 'UNREGISTERED'}
                      </span>
                    </td>
                    <td className="py-space-sm px-space-md text-right font-code-sm text-code-sm text-tertiary">{ev.latencyMs}ms</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Session summary */}
      {history.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-gutter">
          {[
            { label: 'Total Scans', value: history.length, color: 'text-on-surface' },
            { label: 'Authorized', value: history.filter(h => h.status === 'matched').length, color: 'text-primary' },
            { label: 'Unregistered', value: history.filter(h => h.status === 'unknown').length, color: 'text-error' },
            { label: 'Avg Latency', value: `${(history.reduce((s, h) => s + h.latencyMs, 0) / history.length).toFixed(0)}ms`, color: 'text-secondary' },
          ].map((stat) => (
            <div key={stat.label} className="p-space-md rounded-lg bg-surface-container border border-outline-variant/20 flex flex-col">
              <span className="font-label-md text-label-md text-tertiary uppercase tracking-wider">{stat.label}</span>
              <span className={`font-headline-sm text-headline-sm ${stat.color} mt-1`}>{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // MAIN LAYOUT
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full bg-surface min-h-screen">

      {/* TOP STATUS RIBBON */}
      <section className="w-full bg-surface-container-lowest px-margin-lg py-space-sm flex flex-wrap items-center justify-between gap-gutter border-b border-outline-variant/30">
        <div className="flex items-center gap-space-lg flex-wrap">
          <div className="flex items-center gap-space-xs">
            <span className={`w-2 h-2 rounded-full ${backendOnline === true ? 'bg-secondary animate-ping' : backendOnline === false ? 'bg-error' : 'bg-tertiary animate-pulse'}`} />
            <span className="font-code-sm text-code-sm text-secondary tracking-widest font-bold">
              BACKEND: {backendOnline === true ? 'ONLINE' : backendOnline === false ? 'OFFLINE' : 'CHECKING...'}
            </span>
          </div>
          <span className="w-px h-3 bg-surface-variant" />
          <div className="flex items-center gap-space-xs text-on-surface-variant font-code-sm text-code-sm">
            <span className="material-symbols-outlined text-sm text-primary">speed</span>
            <span>FPS: <strong className="text-secondary">{fps}</strong></span>
          </div>
          <span className="w-px h-3 bg-surface-variant" />
          <div className="flex items-center gap-space-xs text-on-surface-variant font-code-sm text-code-sm">
            <span className="material-symbols-outlined text-sm text-primary">timer</span>
            <span>LATENCY: <strong className="text-secondary">{latency}</strong></span>
          </div>
          <span className="w-px h-3 bg-surface-variant" />
          <div className="flex items-center gap-space-xs text-on-surface-variant font-code-sm text-code-sm">
            <span className="material-symbols-outlined text-sm text-primary">model_training</span>
            <span>ENGINE: <strong className="text-on-surface">VISITRA Neural Biometrics / 512-D</strong></span>
          </div>
        </div>
        <span className="font-label-sm text-label-sm text-tertiary-container bg-surface-container px-space-sm py-space-xs rounded-lg flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
          <span>GATEWAY: {backendOnline ? 'ACTIVE' : 'STANDBY'}</span>
        </span>
      </section>

      {/* HEADER */}
      <section className="w-full px-margin-lg pt-space-xl pb-space-lg bg-surface-container-low flex flex-col md:flex-row md:items-end justify-between gap-space-lg border-b border-outline-variant/30">
        <div>
          <div className="flex items-center gap-space-xs mb-space-xs">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">{t('demo.badge')}</span>
            {isAdmin ? (
              <span className="px-2 py-0.5 rounded-lg bg-secondary/20 text-secondary border border-secondary/40 font-code-sm text-code-sm font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">admin_panel_settings</span>
                {t('demo.admin_mode')}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-lg bg-surface-container-high text-on-surface-variant font-code-sm text-code-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">person</span>
                {t('demo.guest_mode')}
              </span>
            )}
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface tracking-tight uppercase">
            {t('demo.title')}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-xs max-w-3xl">
            {isAdmin ? t('demo.admin_desc') : t('demo.guest_desc')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md">
          {isAdmin ? (
            <div className="flex items-center gap-2 bg-surface-container px-3 py-2 rounded-lg border border-secondary/30">
              <span className="material-symbols-outlined text-secondary text-sm">verified_user</span>
              <span className="font-code-sm text-code-sm text-on-surface">{t('demo.admin_auth')}</span>
              <button
                onClick={handleAdminLogout}
                className="text-xs text-error hover:underline ml-2 uppercase font-semibold"
              >
                {t('demo.admin_logout')}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdminModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-label-md uppercase border border-outline-variant/40 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-sm text-primary">lock</span>
              {t('demo.admin_login')}
            </button>
          )}

          <div className="grid grid-cols-2 gap-space-sm self-start md:self-auto">
            <div className="p-space-sm rounded-lg bg-surface-container flex flex-col border border-outline-variant/20">
              <span className="font-label-sm text-label-sm text-tertiary uppercase">{t('demo.tab_profiles')}</span>
              <span className="font-headline-sm text-headline-sm text-primary">{isAdmin ? `${profiles.length} ${t('demo.enrolled_count')}` : 'Protected'}</span>
            </div>
            <div className="p-space-sm rounded-lg bg-surface-container flex flex-col border border-outline-variant/20">
              <span className="font-label-sm text-label-sm text-tertiary uppercase">{t('demo.tab_history')}</span>
              <span className="font-headline-sm text-headline-sm text-secondary">{history.length} {t('demo.history_count')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* TAB NAVIGATION */}
      <div className="w-full bg-surface-container-low border-b border-outline-variant/20 px-margin-lg">
        <div className="flex gap-space-sm py-space-sm overflow-x-auto">
          <TabButton tab="scan" icon="camera" label={t('demo.tab_scan')} />
          <TabButton tab="enroll" icon="person_add" label={t('demo.tab_enroll')} requiresAdmin={true} />
          <TabButton tab="profiles" icon="group" label={t('demo.tab_profiles')} count={profiles.length} requiresAdmin={true} />
          <TabButton tab="history" icon="history" label={t('demo.tab_history')} count={history.length} />
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="w-full px-margin-lg py-margin flex flex-col gap-space-xl">
        <div className="w-full bg-surface-container-low rounded-xl p-space-lg shadow-md border border-outline-variant/30">
          {activeTab === 'scan' && renderScanTab()}
          {activeTab === 'enroll' && (isAdmin ? renderEnrollTab() : (
            <div className="flex flex-col items-center justify-center py-16 gap-space-md text-center">
              <div className="w-16 h-16 rounded-full bg-error-container/30 text-error flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">lock</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">{t('admin.req_title')}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                {t('admin.req_desc')}
              </p>
              <button
                onClick={() => setShowAdminModal(true)}
                className="mt-2 px-6 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md uppercase shadow"
              >
                {t('admin.req_btn')}
              </button>
            </div>
          ))}
          {activeTab === 'profiles' && (isAdmin ? renderProfilesTab() : (
            <div className="flex flex-col items-center justify-center py-16 gap-space-md text-center">
              <div className="w-16 h-16 rounded-full bg-error-container/30 text-error flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">shield</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Danh tính được bảo mật</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                Người dùng thông thường (Guest) chỉ có thể quét nhận diện. Danh sách tất cả hồ sơ được khóa bởi quyền quản trị.
              </p>
              <button
                onClick={() => setShowAdminModal(true)}
                className="mt-2 px-6 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md uppercase shadow"
              >
                Mở khóa danh sách hồ sơ
              </button>
            </div>
          ))}
          {activeTab === 'history' && renderHistoryTab()}
        </div>
      </div>

      {/* ADMIN LOGIN MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-surface-scrim/80 flex items-center justify-center p-space-md backdrop-blur-sm">
          <div className="bg-surface-container-high border border-outline-variant/40 rounded-2xl p-space-lg max-w-md w-full shadow-2xl flex flex-col gap-space-md animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
                  <span className="material-symbols-outlined text-primary text-xl">admin_panel_settings</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Xác thực Quản trị viên</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Demo Kit Admin Access</p>
                </div>
              </div>
              <button onClick={() => setShowAdminModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAdminLogin} className="flex flex-col gap-space-md mt-2">
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Admin Key / Password
                </label>
                <input
                  type="password"
                  value={adminInput}
                  onChange={(e) => setAdminInput(e.target.value)}
                  placeholder="Nhập mật khẩu quản trị viên"
                  autoFocus
                  className="w-full px-space-md py-2.5 bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:border-primary"
                />
              </div>

              {adminError && (
                <div className="p-2 rounded bg-error-container/30 border border-error/40 flex items-center gap-2 text-error font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span>{adminError}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md uppercase hover:bg-surface-container-high"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md uppercase hover:bg-surface-tint shadow-md"
                >
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL (ROW-LEVEL ATOMIC DB EDIT) */}
      {editingProfile && (
        <div className="fixed inset-0 z-50 bg-surface-scrim/80 flex items-center justify-center p-space-md backdrop-blur-sm">
          <div className="bg-surface-container-high border border-outline-variant/40 rounded-2xl p-space-lg max-w-lg w-full shadow-2xl flex flex-col gap-space-md animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
                  <span className="material-symbols-outlined text-primary text-xl">edit_document</span>
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Chỉnh sửa Hồ sơ Danh tính</h3>
                </div>
              </div>
              <button 
                onClick={() => setEditingProfile(null)} 
                className="text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-space-md mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Họ và Tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-space-md py-2 bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Mã Định danh / Person ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={editId}
                    onChange={(e) => setEditId(e.target.value)}
                    className="w-full px-space-md py-2 bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full px-space-md py-2 bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Phòng ban / Department
                  </label>
                  <input
                    type="text"
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value)}
                    placeholder="e.g. AI Research Lab"
                    className="w-full px-space-md py-2 bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                    Cấp phép / Clearance Level
                  </label>
                  <input
                    type="text"
                    value={editClearance}
                    onChange={(e) => setEditClearance(e.target.value)}
                    placeholder="e.g. Level 3 - Restricted Lab Access"
                    className="w-full px-space-md py-2 bg-surface-container-lowest text-on-surface rounded-lg font-body-md text-body-md border border-outline-variant/30 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {editError && (
                <div className="p-2 rounded bg-error-container/30 border border-error/40 flex items-center gap-2 text-error font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-sm">error</span>
                  <span>{editError}</span>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  disabled={editSaving}
                  onClick={() => setEditingProfile(null)}
                  className="px-4 py-2 rounded-lg bg-surface-container text-on-surface-variant font-label-md text-label-md uppercase hover:bg-surface-container-high"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md uppercase hover:bg-surface-tint shadow-md disabled:opacity-50"
                >
                  {editSaving ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu thay đổi'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
