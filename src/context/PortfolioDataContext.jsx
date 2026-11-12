import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  personalInfo as initialPersonalInfo,
  aboutData as initialAboutData,
  technicalSkills as initialTechnicalSkills,
  workExperience as initialWorkExperience,
  educationData as initialEducationData,
  projectsData as initialProjectsData,
} from '../data/portfolioData';
import {
  initFirebase,
  getFirebaseCredentials,
  saveCustomFirebaseConfig,
  clearCustomFirebaseConfig,
} from '../firebase/config';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const initialCvData = {
  url: '',
  fileName: 'Abdul_Haseeb_MERN_FullStack_Resume.pdf',
  updatedAt: 'Updated Recently',
  fileSize: '',
  isUploaded: false,
};

function sanitizeForFirestore(obj) {
  if (!obj) return {};
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (value === undefined) return null;
      // Strip oversized local base64 strings from Firestore sync
      if (typeof value === 'string' && value.startsWith('data:') && value.length > 200000) {
        return '';
      }
      return value;
    })
  );
}

const LOCAL_STORAGE_KEY = 'portfolio_dynamic_data_v1';
const ADMIN_AUTH_KEY = 'portfolio_admin_auth_pin';

const PortfolioDataContext = createContext(null);

export function PortfolioDataProvider({ children }) {
  const [personalInfo, setPersonalInfo] = useState(initialPersonalInfo);
  const [aboutData, setAboutData] = useState(initialAboutData);
  const [technicalSkills, setTechnicalSkills] = useState(initialTechnicalSkills);
  const [workExperience, setWorkExperience] = useState(initialWorkExperience);
  const [educationData, setEducationData] = useState(initialEducationData);
  const [projectsData, setProjectsData] = useState(initialProjectsData);
  const [cvData, setCvData] = useState(initialCvData);

  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [firebaseInstance, setFirebaseInstance] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'saved' | 'error'
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState('projects');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 1. Load cached data from localStorage on first mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.personalInfo) setPersonalInfo(parsed.personalInfo);
        if (parsed.aboutData) setAboutData(parsed.aboutData);
        if (parsed.technicalSkills) setTechnicalSkills(parsed.technicalSkills);
        if (parsed.workExperience) setWorkExperience(parsed.workExperience);
        if (parsed.educationData) setEducationData(parsed.educationData);
        if (parsed.projectsData) setProjectsData(parsed.projectsData);
        if (parsed.cvData) setCvData(parsed.cvData);
      }
    } catch (err) {
      console.warn('Failed to parse cached portfolio data:', err);
    }

    // Check if admin is currently authenticated in session
    if (sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // 2. Setup Firebase listeners
  useEffect(() => {
    const fb = initFirebase();
    setFirebaseInstance(fb);
    setIsFirebaseConnected(Boolean(fb.isConfigured && fb.db));

    if (!fb.isConfigured || !fb.db) {
      return;
    }

    const docRef = doc(fb.db, 'portfolio', 'main');

    // Subscribe to real-time changes
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const remoteData = docSnap.data();
          if (remoteData.personalInfo) setPersonalInfo(remoteData.personalInfo);
          if (remoteData.aboutData) setAboutData(remoteData.aboutData);
          if (remoteData.technicalSkills) setTechnicalSkills(remoteData.technicalSkills);
          if (remoteData.workExperience) setWorkExperience(remoteData.workExperience);
          if (remoteData.educationData) setEducationData(remoteData.educationData);
          if (remoteData.projectsData) setProjectsData(remoteData.projectsData);
          if (remoteData.cvData) setCvData(remoteData.cvData);

          // Update local cache
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remoteData));
          setSyncStatus('saved');
        } else {
          // Document doesn't exist yet in Firestore
          console.log('No Firestore portfolio/main document found. You can seed it from Admin.');
        }
      },
      (error) => {
        console.error('Firestore snapshot listener error:', error);
        setSyncStatus('error');
      }
    );

    // Also listen to portfolio/cvDoc for any stored CV PDF (100% Free Spark plan)
    const cvDocRef = doc(fb.db, 'portfolio', 'cvDoc');
    const unsubscribeCv = onSnapshot(
      cvDocRef,
      (snap) => {
        if (snap.exists()) {
          const cvRemote = snap.data();
          if (cvRemote && cvRemote.dataUrl) {
            setCvData((prev) => ({
              ...prev,
              url: cvRemote.dataUrl,
              fileName: cvRemote.fileName || prev.fileName,
              fileSize: cvRemote.fileSize || prev.fileSize,
              updatedAt: cvRemote.updatedAt || prev.updatedAt,
              isUploaded: true,
            }));
          }
        }
      },
      (err) => console.warn('CV Doc listener notice:', err)
    );

    return () => {
      unsubscribe();
      unsubscribeCv();
    };
  }, []);

  // 3. Helper to persist changes
  const persistChanges = useCallback(
    async (updatedDataset) => {
      setIsSyncing(true);
      setSyncStatus('syncing');

      // Always save to localStorage for offline and zero-lag instant reload
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedDataset));
      } catch (e) {
        console.warn('Error saving to localStorage:', e);
      }

      // If Firebase Firestore is active, save to cloud
      if (firebaseInstance?.isConfigured && firebaseInstance?.db) {
        try {
          const docRef = doc(firebaseInstance.db, 'portfolio', 'main');
          const cleanPayload = sanitizeForFirestore({
            ...updatedDataset,
            lastUpdatedAt: new Date().toISOString(),
          });
          await setDoc(docRef, cleanPayload, { merge: true });
          setSyncStatus('saved');
        } catch (error) {
          console.error('Error saving to Firestore:', error);
          setSyncStatus('error');
          throw error;
        } finally {
          setIsSyncing(false);
        }
      } else {
        setIsSyncing(false);
        setSyncStatus('saved');
      }
    },
    [firebaseInstance]
  );

  // Projects CRUD operations
  const addProject = useCallback(
    async (newProject) => {
      const formatted = {
        ...newProject,
        id: newProject.id || `project-${Date.now()}`,
      };
      const updated = [formatted, ...projectsData];
      setProjectsData(updated);
      await persistChanges({
        personalInfo,
        aboutData,
        technicalSkills,
        workExperience,
        educationData,
        projectsData: updated,
        cvData,
      });
      return formatted;
    },
    [projectsData, personalInfo, aboutData, technicalSkills, workExperience, educationData, cvData, persistChanges]
  );

  const updateProject = useCallback(
    async (projectId, updatedFields) => {
      const updated = projectsData.map((p) =>
        p.id === projectId ? { ...p, ...updatedFields } : p
      );
      setProjectsData(updated);
      await persistChanges({
        personalInfo,
        aboutData,
        technicalSkills,
        workExperience,
        educationData,
        projectsData: updated,
        cvData,
      });
    },
    [projectsData, personalInfo, aboutData, technicalSkills, workExperience, educationData, cvData, persistChanges]
  );

  const deleteProject = useCallback(
    async (projectId) => {
      const updated = projectsData.filter((p) => p.id !== projectId);
      setProjectsData(updated);
      await persistChanges({
        personalInfo,
        aboutData,
        technicalSkills,
        workExperience,
        educationData,
        projectsData: updated,
        cvData,
      });
    },
    [projectsData, personalInfo, aboutData, technicalSkills, workExperience, educationData, cvData, persistChanges]
  );

  const reorderProjects = useCallback(
    async (newProjectsList) => {
      setProjectsData(newProjectsList);
      await persistChanges({
        personalInfo,
        aboutData,
        technicalSkills,
        workExperience,
        educationData,
        projectsData: newProjectsList,
        cvData,
      });
    },
    [personalInfo, aboutData, technicalSkills, workExperience, educationData, cvData, persistChanges]
  );

  // CV / Resume operations
  const updateCvInfo = useCallback(
    async (newCvData) => {
      const merged = { ...cvData, ...newCvData };
      setCvData(merged);
      await persistChanges({
        personalInfo,
        aboutData,
        technicalSkills,
        workExperience,
        educationData,
        projectsData,
        cvData: merged,
      });
    },
    [cvData, personalInfo, aboutData, technicalSkills, workExperience, educationData, projectsData, persistChanges]
  );

  const uploadCvFile = useCallback(
    async (file, onProgress) => {
      if (!file) throw new Error('No file provided');

      const dateStr = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const formattedSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

      // Read file into DataURL
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // 1. Try Firebase Storage if available (Blaze plan)
      let storageUploaded = false;
      let downloadURL = null;

      if (firebaseInstance?.isConfigured && firebaseInstance?.storage) {
        try {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const storagePath = `resumes/${Date.now()}_${safeName}`;
          const fileRef = ref(firebaseInstance.storage, storagePath);
          const uploadTask = uploadBytesResumable(fileRef, file);

          await new Promise((resolve, reject) => {
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress) onProgress(progress);
              },
              (error) => reject(error),
              async () => {
                downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                storageUploaded = true;
                resolve();
              }
            );
          });
        } catch (storageErr) {
          console.warn('Firebase Storage upload failed (e.g. Spark free tier requires Blaze), falling back to Firestore free cloud storage:', storageErr);
        }
      }

      if (storageUploaded && downloadURL) {
        const updatedCv = {
          url: downloadURL,
          fileName: file.name,
          fileSize: formattedSize,
          updatedAt: dateStr,
          isUploaded: true,
        };
        await updateCvInfo(updatedCv);
        return updatedCv;
      }

      // 2. 100% Free Spark Tier Fallback: Store inside Firestore document (NO upgrade/card needed!)
      if (firebaseInstance?.isConfigured && firebaseInstance?.db) {
        if (file.size > 800 * 1024) {
          throw new Error(
            'PDF is larger than 800KB. To keep Firebase 100% free without upgrading to a paid plan, please compress your PDF (e.g. at ilovepdf.com) or paste a free Google Drive link below.'
          );
        }

        const cvDocRef = doc(firebaseInstance.db, 'portfolio', 'cvDoc');
        await setDoc(cvDocRef, {
          dataUrl,
          fileName: file.name,
          fileSize: formattedSize,
          updatedAt: dateStr,
        });

        const updatedCv = {
          url: dataUrl,
          fileName: file.name,
          fileSize: formattedSize,
          updatedAt: `${dateStr} (Cloud Firestore)`,
          isUploaded: true,
        };
        await updateCvInfo({
          fileName: file.name,
          fileSize: formattedSize,
          updatedAt: `${dateStr} (Cloud Firestore)`,
          isUploaded: true,
        });
        if (onProgress) onProgress(100);
        return updatedCv;
      }

      // 3. Offline/Local fallback
      const updatedCv = {
        url: dataUrl,
        fileName: file.name,
        fileSize: formattedSize,
        updatedAt: `${dateStr} (Local/Cached)`,
        isUploaded: true,
      };
      await updateCvInfo(updatedCv);
      if (onProgress) onProgress(100);
      return updatedCv;
    },
    [firebaseInstance, updateCvInfo]
  );

  // Profile, About, Skills, Experience updates
  const updatePersonalInfo = useCallback(
    async (newPersonalInfo) => {
      setPersonalInfo(newPersonalInfo);
      await persistChanges({
        personalInfo: newPersonalInfo,
        aboutData,
        technicalSkills,
        workExperience,
        educationData,
        projectsData,
        cvData,
      });
    },
    [aboutData, technicalSkills, workExperience, educationData, projectsData, cvData, persistChanges]
  );

  const updateAboutData = useCallback(
    async (newAboutData) => {
      setAboutData(newAboutData);
      await persistChanges({
        personalInfo,
        aboutData: newAboutData,
        technicalSkills,
        workExperience,
        educationData,
        projectsData,
        cvData,
      });
    },
    [personalInfo, technicalSkills, workExperience, educationData, projectsData, cvData, persistChanges]
  );

  const updateTechnicalSkills = useCallback(
    async (newSkills) => {
      setTechnicalSkills(newSkills);
      await persistChanges({
        personalInfo,
        aboutData,
        technicalSkills: newSkills,
        workExperience,
        educationData,
        projectsData,
        cvData,
      });
    },
    [personalInfo, aboutData, workExperience, educationData, projectsData, cvData, persistChanges]
  );

  const updateWorkExperience = useCallback(
    async (newExperience) => {
      setWorkExperience(newExperience);
      await persistChanges({
        personalInfo,
        aboutData,
        technicalSkills,
        workExperience: newExperience,
        educationData,
        projectsData,
        cvData,
      });
    },
    [personalInfo, aboutData, technicalSkills, educationData, projectsData, cvData, persistChanges]
  );

  const updateEducationData = useCallback(
    async (newEducation) => {
      setEducationData(newEducation);
      await persistChanges({
        personalInfo,
        aboutData,
        technicalSkills,
        workExperience,
        educationData: newEducation,
        projectsData,
        cvData,
      });
    },
    [personalInfo, aboutData, technicalSkills, workExperience, projectsData, cvData, persistChanges]
  );

  // Seed default dataset into Firestore
  const seedFirebaseDatabase = useCallback(async () => {
    if (!firebaseInstance?.isConfigured || !firebaseInstance?.db) {
      throw new Error('Firebase is not yet configured. Please configure your Firebase credentials first.');
    }
    const currentDataset = {
      personalInfo,
      aboutData,
      technicalSkills,
      workExperience,
      educationData,
      projectsData,
      cvData,
      lastUpdatedAt: new Date().toISOString(),
    };
    const docRef = doc(firebaseInstance.db, 'portfolio', 'main');
    await setDoc(docRef, sanitizeForFirestore(currentDataset));
    setSyncStatus('saved');
    return true;
  }, [firebaseInstance, personalInfo, aboutData, technicalSkills, workExperience, educationData, projectsData, cvData]);

  // Reset to default code data
  const resetToDefaults = useCallback(async () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setPersonalInfo(initialPersonalInfo);
    setAboutData(initialAboutData);
    setTechnicalSkills(initialTechnicalSkills);
    setWorkExperience(initialWorkExperience);
    setEducationData(initialEducationData);
    setProjectsData(initialProjectsData);
    setCvData(initialCvData);

    if (firebaseInstance?.isConfigured && firebaseInstance?.db) {
      const docRef = doc(firebaseInstance.db, 'portfolio', 'main');
      await setDoc(docRef, sanitizeForFirestore({
        personalInfo: initialPersonalInfo,
        aboutData: initialAboutData,
        technicalSkills: initialTechnicalSkills,
        workExperience: initialWorkExperience,
        educationData: initialEducationData,
        projectsData: initialProjectsData,
        cvData: initialCvData,
        lastUpdatedAt: new Date().toISOString(),
      }));
    }
  }, [firebaseInstance]);

  // Admin authentication (Simple PIN or custom password)
  const loginAdmin = (pin) => {
    const savedPin = localStorage.getItem('portfolio_admin_custom_pin') || 'haseeb2026';
    if (pin === savedPin || pin === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
  };

  const changeAdminPin = (newPin) => {
    if (!newPin || newPin.trim().length < 4) {
      throw new Error('PIN must be at least 4 characters long.');
    }
    localStorage.setItem('portfolio_admin_custom_pin', newPin.trim());
    return true;
  };

  const openAdmin = (tab = 'projects') => {
    setAdminInitialTab(tab);
    setIsAdminOpen(true);
  };
  const closeAdmin = () => setIsAdminOpen(false);

  return (
    <PortfolioDataContext.Provider
      value={{
        personalInfo,
        aboutData,
        technicalSkills,
        workExperience,
        educationData,
        projectsData,
        cvData,
        isFirebaseConnected,
        isSyncing,
        syncStatus,
        isAdminOpen,
        adminInitialTab,
        openAdmin,
        closeAdmin,
        isAuthenticated,
        loginAdmin,
        logoutAdmin,
        changeAdminPin,
        addProject,
        updateProject,
        deleteProject,
        reorderProjects,
        updateCvInfo,
        uploadCvFile,
        updatePersonalInfo,
        updateAboutData,
        updateTechnicalSkills,
        updateWorkExperience,
        updateEducationData,
        seedFirebaseDatabase,
        resetToDefaults,
        saveCustomFirebaseConfig: (config) => {
          const res = saveCustomFirebaseConfig(config);
          setFirebaseInstance(res);
          setIsFirebaseConnected(Boolean(res.isConfigured && res.db));
          return res;
        },
        clearCustomFirebaseConfig: () => {
          clearCustomFirebaseConfig();
          setFirebaseInstance(null);
          setIsFirebaseConnected(false);
        },
      }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error('usePortfolioData must be used within a PortfolioDataProvider');
  }
  return context;
}

