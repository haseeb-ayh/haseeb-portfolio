import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Upload,
  FileText,
  ExternalLink,
  Save,
  Check,
  AlertCircle,
  Database,
  ShieldCheck,
  FolderGit2,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Download,
  Key,
  RefreshCw,
  LogOut,
  Eye,
  Settings,
  Layers,
  Code2,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import { usePortfolioData } from '../../context/PortfolioDataContext';

// High-performance client-side image compressor for Firestore
function compressImage(file, maxWidth = 600, maxHeight = 600, quality = 0.84) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export default function AdminModal() {
  const {
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
    saveCustomFirebaseConfig,
  } = usePortfolioData();

  const [activeTab, setActiveTab] = useState('projects');
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [notification, setNotification] = useState(null);

  // Sync initial tab whenever it changes
  useEffect(() => {
    if (adminInitialTab) {
      setActiveTab(adminInitialTab);
    }
  }, [adminInitialTab]);

  // Project Form State
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: '',
    title: '',
    stackSummary: '',
    category: 'Full-Stack',
    status: 'Completed',
    statusType: 'completed',
    description: '',
    bullets: [''],
    tech: '',
    language: 'React · Node.js',
    languageColor: '#0969da',
    github: 'https://github.com/haseeb-ayh',
    demo: '',
  });

  // Skills Form State
  const [isSkillFormOpen, setIsSkillFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null); // { catId, originalName }
  const [skillFilter, setSkillFilter] = useState('all');
  const [skillForm, setSkillForm] = useState({
    categoryId: 'frontend',
    name: '',
    desc: '',
  });

  // CV Upload State
  const [uploadProgress, setUploadProgress] = useState(null);
  const [cvForm, setCvForm] = useState({
    url: cvData.url || '',
    fileName: cvData.fileName || 'Abdul_Haseeb_Resume.pdf',
    updatedAt: cvData.updatedAt || 'Updated Recently',
  });
  const fileInputRef = useRef(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: personalInfo.name,
    title: personalInfo.title,
    shortBio: personalInfo.shortBio,
    location: personalInfo.location,
    email: personalInfo.email,
    phone: personalInfo.phone,
    portfolioUrl: personalInfo.portfolioUrl,
    currentCompany: personalInfo.currentCompany,
    currentRole: personalInfo.currentRole,
    availability: personalInfo.availability,
    avatar: personalInfo.images?.avatar || '/images/profile.jpg',
    aboutImg: personalInfo.images?.about || '/images/about.jpg',
    github: personalInfo.socials?.github || '',
    linkedin: personalInfo.socials?.linkedin || '',
    twitter: personalInfo.socials?.twitter || '',
    instagram: personalInfo.socials?.instagram || '',
  });

  // Keep profile form in sync when personalInfo updates
  useEffect(() => {
    if (personalInfo) {
      setProfileForm((prev) => ({
        ...prev,
        name: personalInfo.name || '',
        title: personalInfo.title || '',
        shortBio: personalInfo.shortBio || '',
        location: personalInfo.location || '',
        email: personalInfo.email || '',
        phone: personalInfo.phone || '',
        portfolioUrl: personalInfo.portfolioUrl || '',
        currentCompany: personalInfo.currentCompany || '',
        currentRole: personalInfo.currentRole || '',
        availability: personalInfo.availability || '',
        avatar: personalInfo.images?.avatar || '/images/profile.jpg',
        aboutImg: personalInfo.images?.about || '/images/about.jpg',
        github: personalInfo.socials?.github || '',
        linkedin: personalInfo.socials?.linkedin || '',
        twitter: personalInfo.socials?.twitter || '',
        instagram: personalInfo.socials?.instagram || '',
      }));
    }
  }, [personalInfo]);

  // Firebase Config Form State
  const [fbConfigForm, setFbConfigForm] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  });

  // Change PIN State
  const [newPin, setNewPin] = useState('');

  if (!isAdminOpen) return null;

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginAdmin(pinInput)) {
      setPinError('');
      setPinInput('');
      showNotification('Authenticated successfully! Welcome, Haseeb.');
    } else {
      setPinError('Incorrect PIN. Default is "haseeb2026" or "admin123"');
    }
  };

  // Projects Handler
  const openNewProjectForm = () => {
    setEditingProjectId(null);
    setProjectForm({
      name: 'new-awesome-project',
      title: '',
      stackSummary: 'React · Node.js · MongoDB',
      category: 'Full-Stack',
      status: 'Completed',
      statusType: 'completed',
      description: '',
      bullets: [''],
      tech: 'React, Node.js, Express, MongoDB',
      language: 'MERN Stack',
      languageColor: '#0969da',
      github: 'https://github.com/haseeb-ayh',
      demo: '',
    });
    setIsProjectFormOpen(true);
  };

  const openEditProjectForm = (project) => {
    setEditingProjectId(project.id);
    setProjectForm({
      name: project.name || '',
      title: project.title || '',
      stackSummary: project.stackSummary || '',
      category: project.category || 'Full-Stack',
      status: project.status || 'Completed',
      statusType: project.statusType || 'completed',
      description: project.description || '',
      bullets: project.bullets && project.bullets.length ? [...project.bullets] : [''],
      tech: Array.isArray(project.tech) ? project.tech.join(', ') : project.tech || '',
      language: project.language || 'React',
      languageColor: project.languageColor || '#0969da',
      github: project.github || '',
      demo: project.demo || '',
    });
    setIsProjectFormOpen(true);
  };

  const saveProject = async (e) => {
    e.preventDefault();
    const formattedBullets = projectForm.bullets.filter((b) => b.trim().length > 0);
    const techArray = projectForm.tech
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const projectPayload = {
      name: projectForm.name.trim() || 'project',
      title: projectForm.title.trim(),
      stackSummary: projectForm.stackSummary.trim(),
      category: projectForm.category,
      status: projectForm.status,
      statusType: projectForm.status.toLowerCase().includes('progress') ? 'progress' : 'completed',
      description: projectForm.description.trim(),
      bullets: formattedBullets.length ? formattedBullets : ['Implemented core features and modular architecture.'],
      tech: techArray,
      language: projectForm.language,
      languageColor: projectForm.languageColor || '#0969da',
      github: projectForm.github.trim(),
      demo: projectForm.demo.trim() || null,
    };

    try {
      if (editingProjectId) {
        await updateProject(editingProjectId, projectPayload);
        showNotification('Project updated successfully!');
      } else {
        await addProject(projectPayload);
        showNotification('New project added to portfolio!');
      }
      setIsProjectFormOpen(false);
      setEditingProjectId(null);
    } catch (err) {
      showNotification('Failed to save project: ' + err.message, 'error');
    }
  };

  const handleDeleteProject = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteProject(id);
        showNotification('Project deleted.');
      } catch (err) {
        showNotification('Failed to delete project: ' + err.message, 'error');
      }
    }
  };

  const moveProject = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projectsData.length) return;
    const newList = [...projectsData];
    const [moved] = newList.splice(index, 1);
    newList.splice(targetIndex, 0, moved);
    reorderProjects(newList);
  };

  // Skills Handler
  const openNewSkillForm = (defaultCatId = 'frontend') => {
    setEditingSkill(null);
    setSkillForm({
      categoryId: defaultCatId,
      name: '',
      desc: '',
    });
    setIsSkillFormOpen(true);
  };

  const openEditSkillForm = (catId, skill) => {
    setEditingSkill({ catId, originalName: skill.name });
    setSkillForm({
      categoryId: catId,
      name: skill.name,
      desc: skill.desc || '',
    });
    setIsSkillFormOpen(true);
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    const sName = skillForm.name.trim();
    const sDesc = skillForm.desc.trim();
    if (!sName) return;

    try {
      let updated;
      if (editingSkill) {
        updated = technicalSkills.map((cat) => {
          if (cat.id === editingSkill.catId) {
            if (editingSkill.catId === skillForm.categoryId) {
              return {
                ...cat,
                skills: cat.skills.map((s) =>
                  s.name === editingSkill.originalName ? { name: sName, desc: sDesc } : s
                ),
              };
            } else {
              return {
                ...cat,
                skills: cat.skills.filter((s) => s.name !== editingSkill.originalName),
              };
            }
          }
          if (cat.id === skillForm.categoryId && editingSkill.catId !== skillForm.categoryId) {
            return {
              ...cat,
              skills: [...cat.skills, { name: sName, desc: sDesc }],
            };
          }
          return cat;
        });
        showNotification(`Skill "${sName}" updated!`);
      } else {
        updated = technicalSkills.map((cat) => {
          if (cat.id === skillForm.categoryId) {
            return {
              ...cat,
              skills: [...cat.skills, { name: sName, desc: sDesc }],
            };
          }
          return cat;
        });
        showNotification(`Skill "${sName}" added!`);
      }

      await updateTechnicalSkills(updated);
      setIsSkillFormOpen(false);
      setEditingSkill(null);
    } catch (err) {
      showNotification('Failed to save skill: ' + err.message, 'error');
    }
  };

  const handleDeleteSkill = async (catId, skillName) => {
    if (window.confirm(`Are you sure you want to delete "${skillName}"?`)) {
      try {
        const updated = technicalSkills.map((cat) => {
          if (cat.id === catId) {
            return {
              ...cat,
              skills: cat.skills.filter((s) => s.name !== skillName),
            };
          }
          return cat;
        });
        await updateTechnicalSkills(updated);
        showNotification(`Skill "${skillName}" deleted.`);
      } catch (err) {
        showNotification('Failed to delete skill: ' + err.message, 'error');
      }
    }
  };

  // CV Handler
  const handleCvFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(10);
      const res = await uploadCvFile(file, (progress) => {
        setUploadProgress(Math.round(progress));
      });
      setCvForm({
        url: res.url,
        fileName: res.fileName,
        updatedAt: res.updatedAt,
      });
      showNotification('CV / Resume file uploaded and updated successfully!');
    } catch (err) {
      showNotification('Upload failed: ' + err.message, 'error');
    } finally {
      setUploadProgress(null);
    }
  };

  const handleSaveCvDetails = async (e) => {
    e.preventDefault();
    try {
      await updateCvInfo({
        url: cvForm.url.trim(),
        fileName: cvForm.fileName.trim(),
        updatedAt: cvForm.updatedAt.trim() || 'Updated Recently',
      });
      showNotification('CV details updated!');
    } catch (err) {
      showNotification('Error updating CV: ' + err.message, 'error');
    }
  };

  // Image Upload Handlers
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showNotification('Optimizing and updating profile photo...', 'success');
      const compressed = await compressImage(file, 500, 500, 0.85);
      setProfileForm((prev) => ({ ...prev, avatar: compressed }));
      const updated = {
        ...personalInfo,
        images: {
          ...personalInfo.images,
          avatar: compressed,
        },
      };
      await updatePersonalInfo(updated);
      showNotification('Profile avatar updated successfully!');
    } catch (err) {
      showNotification('Failed to upload image: ' + err.message, 'error');
    }
  };

  const handleAboutImgUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      showNotification('Optimizing and updating about portrait...', 'success');
      const compressed = await compressImage(file, 700, 850, 0.85);
      setProfileForm((prev) => ({ ...prev, aboutImg: compressed }));
      const updated = {
        ...personalInfo,
        images: {
          ...personalInfo.images,
          about: compressed,
        },
      };
      await updatePersonalInfo(updated);
      showNotification('About portrait updated successfully!');
    } catch (err) {
      showNotification('Failed to upload image: ' + err.message, 'error');
    }
  };

  // Profile Handler
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = {
        ...personalInfo,
        name: profileForm.name,
        title: profileForm.title,
        shortBio: profileForm.shortBio,
        location: profileForm.location,
        email: profileForm.email,
        phone: profileForm.phone,
        portfolioUrl: profileForm.portfolioUrl,
        currentCompany: profileForm.currentCompany,
        currentRole: profileForm.currentRole,
        availability: profileForm.availability,
        images: {
          ...personalInfo.images,
          avatar: profileForm.avatar || personalInfo.images?.avatar || '/images/profile.jpg',
          about: profileForm.aboutImg || personalInfo.images?.about || '/images/about.jpg',
        },
        socials: {
          ...personalInfo.socials,
          github: profileForm.github,
          linkedin: profileForm.linkedin,
          twitter: profileForm.twitter,
          instagram: profileForm.instagram,
        },
      };
      await updatePersonalInfo(updated);
      showNotification('Profile information saved!');
    } catch (err) {
      showNotification('Error saving profile: ' + err.message, 'error');
    }
  };

  // Firebase Config Save
  const handleSaveFirebaseConfig = (e) => {
    e.preventDefault();
    if (!fbConfigForm.apiKey || !fbConfigForm.projectId) {
      showNotification('API Key and Project ID are required!', 'error');
      return;
    }
    const res = saveCustomFirebaseConfig(fbConfigForm);
    if (res.isConfigured) {
      showNotification('Firebase connected successfully! Real-time cloud sync is now ACTIVE.');
    } else {
      showNotification('Could not connect with provided credentials. Please check details.', 'error');
    }
  };

  const handleSeedFirebase = async () => {
    if (window.confirm('This will upload all current portfolio projects, CV, and profile data to Firebase Firestore. Proceed?')) {
      try {
        await seedFirebaseDatabase();
        showNotification('Database seeded successfully to Firebase Firestore!');
      } catch (err) {
        if (err.message && err.message.toLowerCase().includes('permission')) {
          showNotification('Permission Denied: Please update your Firestore Rules in Firebase Console (see instructions below)', 'error');
        } else {
          showNotification('Failed to seed database: ' + err.message, 'error');
        }
      }
    }
  };

  const totalSkillsCount = (technicalSkills || []).reduce((acc, c) => acc + (c.skills?.length || 0), 0);
  const filteredSkillsCategories = skillFilter === 'all'
    ? technicalSkills
    : technicalSkills.filter((c) => c.id === skillFilter);

  return (
    <div className="admin-overlay" onClick={closeAdmin}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-title">
            <ShieldCheck size={20} className="text-blue" />
            <div>
              <h3>Portfolio Admin CMS</h3>
              <span className="admin-sync-tag">
                {isFirebaseConnected ? (
                  <span className="sync-badge cloud">
                    <span className="status-dot green"></span> Live Cloud Sync (Firebase)
                  </span>
                ) : (
                  <span className="sync-badge local">
                    <span className="status-dot amber"></span> Local Browser Mode
                  </span>
                )}
                {isSyncing && <span className="sync-spinner">Saving...</span>}
              </span>
            </div>
          </div>

          <div className="admin-header-actions">
            {isAuthenticated && (
              <button 
                type="button" 
                className="btn btn-ghost btn-sm"
                onClick={logoutAdmin}
                title="Lock Dashboard"
              >
                <LogOut size={15} />
                <span>Lock</span>
              </button>
            )}
            <button 
              type="button" 
              className="admin-close-btn"
              onClick={closeAdmin}
              title="Close CMS"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className={`admin-alert ${notification.type}`}>
            {notification.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
            <span>{notification.msg}</span>
          </div>
        )}

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="admin-login-screen">
            <div className="admin-lock-card">
              <Key size={36} className="text-blue mb-3" />
              <h4>Enter Admin Passcode</h4>
              <p className="text-muted text-sm mb-4">
                Access your dynamic dashboard to manage projects, skills, upload new CV, or modify content without touching code.
              </p>

              <form onSubmit={handleLogin} className="admin-pin-form">
                <input
                  type="password"
                  placeholder="Enter PIN (Default: haseeb2026)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="admin-input pin-input"
                  autoFocus
                />
                {pinError && <p className="error-text">{pinError}</p>}
                
                <button type="submit" className="btn btn-primary w-full mt-3">
                  <span>Unlock CMS</span>
                  <Check size={15} />
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard Tabs */
          <div className="admin-dashboard-container">
            
            {/* Sidebar Navigation */}
            <div className="admin-nav-sidebar">
              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
                onClick={() => setActiveTab('projects')}
              >
                <FolderGit2 size={16} />
                <span>Projects ({projectsData.length})</span>
              </button>

              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
                onClick={() => setActiveTab('skills')}
              >
                <Layers size={16} />
                <span>Skills ({totalSkillsCount})</span>
              </button>

              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'cv' ? 'active' : ''}`}
                onClick={() => setActiveTab('cv')}
              >
                <FileText size={16} />
                <span>CV / Resume</span>
              </button>

              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={16} />
                <span>Bio & Profile</span>
              </button>

              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'cloud' ? 'active' : ''}`}
                onClick={() => setActiveTab('cloud')}
              >
                <Database size={16} />
                <span>Firebase & Sync</span>
              </button>

              <button
                type="button"
                className={`admin-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <Settings size={16} />
                <span>Security / PIN</span>
              </button>
            </div>

            {/* Main Tab Panels */}
            <div className="admin-tab-content">
              
              {/* TAB 1: PROJECTS MANAGER */}
              {activeTab === 'projects' && (
                <div className="tab-pane">
                  
                  <div className="pane-header">
                    <div>
                      <h4>Manage Projects</h4>
                      <p className="text-muted text-sm">
                        Add new projects, update existing ones, or reorder how they appear to visitors.
                      </p>
                    </div>

                    {!isProjectFormOpen && (
                      <button 
                        type="button" 
                        className="btn btn-primary btn-sm"
                        onClick={openNewProjectForm}
                      >
                        <Plus size={15} />
                        <span>Add Project</span>
                      </button>
                    )}
                  </div>

                  {isProjectFormOpen ? (
                    /* Project Add/Edit Form */
                    <form onSubmit={saveProject} className="admin-form-box">
                      <div className="form-head-strip">
                        <h5>{editingProjectId ? 'Edit Project' : 'Add New Project'}</h5>
                        <button 
                          type="button" 
                          className="btn btn-ghost btn-sm"
                          onClick={() => setIsProjectFormOpen(false)}
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="form-grid-2">
                        <div className="form-field">
                          <label>Project Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. School Management ERP"
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                            className="admin-input"
                          />
                        </div>

                        <div className="form-field">
                          <label>Slug / Repo Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. school-management-erp"
                            value={projectForm.name}
                            onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                            className="admin-input"
                          />
                        </div>
                      </div>

                      <div className="form-grid-3">
                        <div className="form-field">
                          <label>Category *</label>
                          <select
                            value={projectForm.category}
                            onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                            className="admin-input"
                          >
                            <option value="Full-Stack">Full-Stack</option>
                            <option value="Front-End">Front-End</option>
                            <option value="Back-End">Back-End</option>
                          </select>
                        </div>

                        <div className="form-field">
                          <label>Status Badge *</label>
                          <select
                            value={projectForm.status}
                            onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                            className="admin-input"
                          >
                            <option value="Featured Project">Featured Project</option>
                            <option value="Completed">Completed</option>
                            <option value="In Progress (CorePro)">In Progress (CorePro)</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Live Project">Live Project</option>
                          </select>
                        </div>

                        <div className="form-field">
                          <label>Stack Summary *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. React · Redux Toolkit · Firebase"
                            value={projectForm.stackSummary}
                            onChange={(e) => setProjectForm({ ...projectForm, stackSummary: e.target.value })}
                            className="admin-input"
                          />
                        </div>
                      </div>

                      <div className="form-field">
                        <label>Description *</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Comprehensive description of what you developed and built..."
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                          className="admin-textarea"
                        />
                      </div>

                      {/* Bullet Highlights */}
                      <div className="form-field">
                        <div className="bullet-header">
                          <label>Technical Highlights / Architecture Bullets</label>
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs text-blue"
                            onClick={() => setProjectForm({ ...projectForm, bullets: [...projectForm.bullets, ''] })}
                          >
                            <Plus size={13} />
                            <span>Add Bullet</span>
                          </button>
                        </div>

                        {projectForm.bullets.map((bullet, idx) => (
                          <div key={idx} className="bullet-input-row">
                            <span className="bullet-num">{idx + 1}.</span>
                            <input
                              type="text"
                              placeholder="e.g. Designed MongoDB schema across 15 collections..."
                              value={bullet}
                              onChange={(e) => {
                                const copy = [...projectForm.bullets];
                                copy[idx] = e.target.value;
                                setProjectForm({ ...projectForm, bullets: copy });
                              }}
                              className="admin-input"
                            />
                            {projectForm.bullets.length > 1 && (
                              <button
                                type="button"
                                className="icon-danger-btn"
                                onClick={() => {
                                  const copy = projectForm.bullets.filter((_, i) => i !== idx);
                                  setProjectForm({ ...projectForm, bullets: copy });
                                }}
                                title="Remove bullet"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="form-field">
                        <label>Technologies (Comma separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. React, Node.js, Express, MongoDB, Firebase Auth, Redux"
                          value={projectForm.tech}
                          onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                          className="admin-input"
                        />
                      </div>

                      <div className="form-grid-2">
                        <div className="form-field">
                          <label>GitHub Repository URL</label>
                          <input
                            type="url"
                            placeholder="https://github.com/..."
                            value={projectForm.github}
                            onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                            className="admin-input"
                          />
                        </div>

                        <div className="form-field">
                          <label>Live Demo URL (Optional)</label>
                          <input
                            type="url"
                            placeholder="https://..."
                            value={projectForm.demo}
                            onChange={(e) => setProjectForm({ ...projectForm, demo: e.target.value })}
                            className="admin-input"
                          />
                        </div>
                      </div>

                      <div className="form-grid-2">
                        <div className="form-field">
                          <label>Language Badge Label</label>
                          <input
                            type="text"
                            placeholder="e.g. MERN Stack"
                            value={projectForm.language}
                            onChange={(e) => setProjectForm({ ...projectForm, language: e.target.value })}
                            className="admin-input"
                          />
                        </div>

                        <div className="form-field">
                          <label>Language Badge Color</label>
                          <div className="color-picker-row">
                            <input
                              type="color"
                              value={projectForm.languageColor}
                              onChange={(e) => setProjectForm({ ...projectForm, languageColor: e.target.value })}
                              className="color-input"
                            />
                            <input
                              type="text"
                              value={projectForm.languageColor}
                              onChange={(e) => setProjectForm({ ...projectForm, languageColor: e.target.value })}
                              className="admin-input"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-actions-bar">
                        <button type="submit" className="btn btn-primary">
                          <Save size={15} />
                          <span>{editingProjectId ? 'Update Project' : 'Save Project'}</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => setIsProjectFormOpen(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Project List */
                    <div className="admin-project-list">
                      {projectsData.map((project, idx) => (
                        <div key={project.id} className="admin-project-row">
                          <div className="project-reorder-controls">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveProject(idx, -1)}
                              className="reorder-btn"
                              title="Move Up"
                            >
                              <ArrowUp size={13} />
                            </button>
                            <span className="order-num">{idx + 1}</span>
                            <button
                              type="button"
                              disabled={idx === projectsData.length - 1}
                              onClick={() => moveProject(idx, 1)}
                              className="reorder-btn"
                              title="Move Down"
                            >
                              <ArrowDown size={13} />
                            </button>
                          </div>

                          <div className="project-info-col">
                            <div className="project-main-line">
                              <strong>{project.title}</strong>
                              <span className="badge badge-neutral text-xs">{project.category}</span>
                              <span className={`repo-status-badge ${project.statusType === 'progress' ? 'status-progress' : 'status-completed'}`}>
                                {project.status}
                              </span>
                            </div>
                            <p className="project-sub-line text-muted text-xs">
                              {project.stackSummary} • {project.bullets?.length || 0} highlights
                            </p>
                          </div>

                          <div className="project-actions-col">
                            {project.demo && (
                              <a
                                href={project.demo}
                                target="_blank"
                                rel="noreferrer"
                                className="icon-action-btn"
                                title="Open Live Site"
                              >
                                <ExternalLink size={14} />
                              </a>
                            )}
                            <button
                              type="button"
                              className="icon-action-btn edit"
                              onClick={() => openEditProjectForm(project)}
                              title="Edit Project"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              className="icon-action-btn delete"
                              onClick={() => handleDeleteProject(project.id, project.title)}
                              title="Delete Project"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* TAB 2: SKILLS MANAGER */}
              {activeTab === 'skills' && (
                <div className="tab-pane">
                  <div className="pane-header">
                    <div>
                      <h4>Manage Technical Skills</h4>
                      <p className="text-muted text-sm">
                        Add new skills, modify descriptions, or remove technologies from any category.
                      </p>
                    </div>

                    {!isSkillFormOpen && (
                      <button 
                        type="button" 
                        className="btn btn-primary btn-sm"
                        onClick={() => openNewSkillForm(skillFilter === 'all' ? 'frontend' : skillFilter)}
                      >
                        <Plus size={15} />
                        <span>Add Skill</span>
                      </button>
                    )}
                  </div>

                  {/* Category Filter for Admin */}
                  <div className="filter-pills-bar mb-3">
                    <button
                      type="button"
                      className={`filter-pill-btn ${skillFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setSkillFilter('all')}
                    >
                      All ({totalSkillsCount})
                    </button>
                    {technicalSkills.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className={`filter-pill-btn ${skillFilter === c.id ? 'active' : ''}`}
                        onClick={() => setSkillFilter(c.id)}
                      >
                        {c.category} ({c.skills?.length || 0})
                      </button>
                    ))}
                  </div>

                  {/* Add / Edit Skill Form */}
                  {isSkillFormOpen ? (
                    <form onSubmit={handleSaveSkill} className="admin-form-box">
                      <div className="form-head-strip">
                        <h5>{editingSkill ? `Edit Skill (${editingSkill.originalName})` : 'Add New Skill'}</h5>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => setIsSkillFormOpen(false)}
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="form-grid-2">
                        <div className="form-field">
                          <label>Category *</label>
                          <select
                            value={skillForm.categoryId}
                            onChange={(e) => setSkillForm({ ...skillForm, categoryId: e.target.value })}
                            className="admin-input"
                          >
                            {technicalSkills.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.category}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="form-field">
                          <label>Skill Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Next.js, Docker, TypeScript, GraphQL"
                            value={skillForm.name}
                            onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                            className="admin-input"
                          />
                        </div>
                      </div>

                      <div className="form-field">
                        <label>Description / Core Competencies *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. SSR, App Router, Server Actions, API routes"
                          value={skillForm.desc}
                          onChange={(e) => setSkillForm({ ...skillForm, desc: e.target.value })}
                          className="admin-input"
                        />
                      </div>

                      <div className="form-actions-bar">
                        <button type="submit" className="btn btn-primary">
                          <Save size={15} />
                          <span>{editingSkill ? 'Update Skill' : 'Save Skill'}</span>
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => setIsSkillFormOpen(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Skills List Grouped by Category */
                    <div className="admin-skills-accordion">
                      {filteredSkillsCategories.map((cat) => (
                        <div key={cat.id} className="admin-skill-cat-block">
                          <div className="admin-skill-cat-head">
                            <strong>{cat.category}</strong>
                            <span className="badge badge-neutral text-xs">
                              {cat.skills?.length || 0} skills
                            </span>
                            <button
                              type="button"
                              className="btn btn-ghost btn-xs text-blue ml-auto"
                              onClick={() => openNewSkillForm(cat.id)}
                            >
                              <Plus size={13} />
                              <span>Add to {cat.category}</span>
                            </button>
                          </div>

                          <div className="admin-skill-items-grid">
                            {cat.skills?.map((skill, sIdx) => (
                              <div key={sIdx} className="admin-skill-card">
                                <div className="admin-skill-main">
                                  <span className="skill-title-text">{skill.name}</span>
                                  {skill.desc && (
                                    <p className="skill-detail-text">{skill.desc}</p>
                                  )}
                                </div>
                                <div className="admin-skill-actions">
                                  <button
                                    type="button"
                                    className="icon-action-btn edit"
                                    onClick={() => openEditSkillForm(cat.id, skill)}
                                    title="Edit Skill"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    className="icon-action-btn delete"
                                    onClick={() => handleDeleteSkill(cat.id, skill.name)}
                                    title="Delete Skill"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* TAB 3: CV / RESUME MANAGER */}
              {activeTab === 'cv' && (
                <div className="tab-pane">
                  <div className="pane-header">
                    <div>
                      <h4>Update CV / Resume</h4>
                      <p className="text-muted text-sm">
                        Upload your latest CV PDF or provide a direct link. Visitors can immediately view and download it from the Hero and Navbar.
                      </p>
                    </div>
                  </div>

                  <div className="cv-manager-card">
                    
                    {/* Current CV status */}
                    <div className="cv-status-box">
                      <div className="cv-icon-wrap">
                        <FileText size={32} className="text-blue" />
                      </div>
                      <div className="cv-details-wrap">
                        <h5>{cvData.fileName || 'No CV Uploaded Yet'}</h5>
                        <p className="text-muted text-xs">
                          Status: {cvData.url ? 'Active & Available on Website' : 'Not configured'} 
                          {cvData.updatedAt && ` • ${cvData.updatedAt}`}
                          {cvData.fileSize && ` • ${cvData.fileSize}`}
                        </p>
                      </div>
                      {cvData.url && (
                        <a
                          href={cvData.url}
                          target="_blank"
                          rel="noreferrer"
                          download={cvData.fileName}
                          className="btn btn-outline btn-sm"
                        >
                          <Eye size={14} />
                          <span>Preview / Download</span>
                        </a>
                      )}
                    </div>

                    {/* File Upload Zone */}
                    <div className="cv-upload-dropzone" onClick={() => fileInputRef.current?.click()}>
                      <Upload size={32} className="text-blue mb-2" />
                      <h6>Click to Upload Updated CV (PDF)</h6>
                      <p className="text-muted text-xs">
                        Upload your PDF (up to 800KB). Stored 100% free in Cloud Firestore — zero upgrade or credit card required.
                      </p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".pdf,.doc,.docx"
                        onChange={handleCvFileUpload}
                        style={{ display: 'none' }}
                      />
                    </div>

                    {uploadProgress !== null && (
                      <div className="upload-progress-box">
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                        <span className="text-xs text-muted">Uploading: {uploadProgress}%</span>
                      </div>
                    )}

                    {/* Or URL Input Form */}
                    <form onSubmit={handleSaveCvDetails} className="cv-url-form mt-4">
                      <h6>Or provide a Google Drive / Cloud CV Link:</h6>
                      
                      <div className="form-field mt-2">
                        <label>Direct CV URL (Google Drive, Dropbox, Vercel, etc.)</label>
                        <input
                          type="url"
                          placeholder="https://drive.google.com/... or https://..."
                          value={cvForm.url}
                          onChange={(e) => setCvForm({ ...cvForm, url: e.target.value })}
                          className="admin-input"
                        />
                      </div>

                      <div className="form-grid-2">
                        <div className="form-field">
                          <label>Download File Name</label>
                          <input
                            type="text"
                            placeholder="Abdul_Haseeb_MERN_Resume.pdf"
                            value={cvForm.fileName}
                            onChange={(e) => setCvForm({ ...cvForm, fileName: e.target.value })}
                            className="admin-input"
                          />
                        </div>

                        <div className="form-field">
                          <label>Display Timestamp</label>
                          <input
                            type="text"
                            placeholder="e.g. Updated Recently"
                            value={cvForm.updatedAt}
                            onChange={(e) => setCvForm({ ...cvForm, updatedAt: e.target.value })}
                            className="admin-input"
                          />
                        </div>
                      </div>

                      <button type="submit" className="btn btn-primary mt-3">
                        <Save size={14} />
                        <span>Save CV Details</span>
                      </button>
                    </form>

                  </div>
                </div>
              )}

              {/* TAB 4: BIO & PROFILE */}
              {activeTab === 'profile' && (
                <div className="tab-pane">
                  <div className="pane-header">
                    <div>
                      <h4>Profile & Bio Details</h4>
                      <p className="text-muted text-sm">
                        Update your title, current role at CorePro Techno, bio summary, and contact information.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="admin-form-box">
                    
                    {/* Profile & Avatar Photos */}
                    <div className="profile-photos-row">
                      <div className="photo-editor-card">
                        <div className="photo-preview-avatar">
                          <img
                            src={profileForm.avatar || '/images/profile.jpg'}
                            alt="Avatar Preview"
                            onError={(e) => {
                              e.target.src = '/image/WhatsApp Image 2025-11-14 at 4.57.00 PM.jpeg';
                            }}
                          />
                        </div>
                        <div className="photo-editor-details">
                          <span className="photo-label-title">Profile Avatar (Hero &amp; Navbar)</span>
                          <span className="photo-label-desc">Display photo for navbar, header, and social preview</span>
                          
                          <div className="photo-editor-actions mt-2">
                            <label className="btn btn-outline btn-sm photo-upload-btn">
                              <Camera size={14} />
                              <span>Upload Photo</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleAvatarUpload}
                              />
                            </label>
                            <input
                              type="text"
                              placeholder="Or paste image URL..."
                              value={profileForm.avatar}
                              onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                              className="admin-input text-xs mt-2"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="photo-editor-card">
                        <div className="photo-preview-portrait">
                          <img
                            src={profileForm.aboutImg || '/images/about.jpg'}
                            alt="About Portrait Preview"
                            onError={(e) => {
                              e.target.src = '/image/WhatsApp Image 2025-11-14 at 6.09.43 PM.jpeg';
                            }}
                          />
                        </div>
                        <div className="photo-editor-details">
                          <span className="photo-label-title">About Section Portrait</span>
                          <span className="photo-label-desc">Large photo displayed in About Me card</span>
                          
                          <div className="photo-editor-actions mt-2">
                            <label className="btn btn-outline btn-sm photo-upload-btn">
                              <ImageIcon size={14} />
                              <span>Upload Portrait</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleAboutImgUpload}
                              />
                            </label>
                            <input
                              type="text"
                              placeholder="Or paste image URL..."
                              value={profileForm.aboutImg}
                              onChange={(e) => setProfileForm({ ...profileForm, aboutImg: e.target.value })}
                              className="admin-input text-xs mt-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-field">
                        <label>Full Name</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="admin-input"
                        />
                      </div>

                      <div className="form-field">
                        <label>Professional Title</label>
                        <input
                          type="text"
                          value={profileForm.title}
                          onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label>Hero & Profile Bio</label>
                      <textarea
                        rows={3}
                        value={profileForm.shortBio}
                        onChange={(e) => setProfileForm({ ...profileForm, shortBio: e.target.value })}
                        className="admin-textarea"
                      />
                    </div>

                    <div className="form-grid-2">
                      <div className="form-field">
                        <label>Current Role</label>
                        <input
                          type="text"
                          value={profileForm.currentRole}
                          onChange={(e) => setProfileForm({ ...profileForm, currentRole: e.target.value })}
                          className="admin-input"
                        />
                      </div>

                      <div className="form-field">
                        <label>Current Company</label>
                        <input
                          type="text"
                          value={profileForm.currentCompany}
                          onChange={(e) => setProfileForm({ ...profileForm, currentCompany: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                    </div>

                    <div className="form-grid-3">
                      <div className="form-field">
                        <label>Location</label>
                        <input
                          type="text"
                          value={profileForm.location}
                          onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                          className="admin-input"
                        />
                      </div>

                      <div className="form-field">
                        <label>Email</label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="admin-input"
                        />
                      </div>

                      <div className="form-field">
                        <label>Phone</label>
                        <input
                          type="text"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-field">
                        <label>GitHub Profile</label>
                        <input
                          type="url"
                          value={profileForm.github}
                          onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                          className="admin-input"
                        />
                      </div>

                      <div className="form-field">
                        <label>LinkedIn Profile</label>
                        <input
                          type="url"
                          value={profileForm.linkedin}
                          onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary mt-3">
                      <Save size={15} />
                      <span>Save Profile Updates</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 5: FIREBASE & CLOUD SYNC */}
              {activeTab === 'cloud' && (
                <div className="tab-pane">
                  <div className="pane-header">
                    <div>
                      <h4>Firebase Cloud Database & Storage</h4>
                      <p className="text-muted text-sm">
                        Connect your Firebase project to sync updates in real-time to all visitors on Vercel.
                      </p>
                    </div>
                  </div>

                  <div className="cloud-status-card">
                    <div className="status-indicator-box">
                      <Database size={24} className={isFirebaseConnected ? 'text-green' : 'text-amber'} />
                      <div>
                        <h6>{isFirebaseConnected ? 'Firebase is Connected & Active' : 'Running in Local Storage Mode'}</h6>
                        <p className="text-muted text-xs">
                          {isFirebaseConnected
                            ? 'All changes to projects, CV, and bio update live in Firestore & Storage for every visitor.'
                            : 'Changes are currently saved in your browser. Connect Firebase below to broadcast changes globally.'}
                        </p>
                      </div>
                    </div>

                    {isFirebaseConnected && (
                      <div className="seed-box mt-3">
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={handleSeedFirebase}
                        >
                          <RefreshCw size={14} />
                          <span>Push Current Portfolio Data to Firestore</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Firebase Security Rules Quick Guide */}
                  <div className="rules-helper-card mt-4">
                    <div className="rules-helper-head">
                      <AlertCircle size={18} className="text-amber" />
                      <div>
                        <h6>Fix "Missing or insufficient permissions" Error</h6>
                        <p className="text-muted text-xs">
                          By default, Firebase locks new databases. To allow your portfolio to save data and upload CV files, update your Firebase Console rules:
                        </p>
                      </div>
                    </div>

                    <div className="rules-content-grid mt-3">
                      <div className="rules-block">
                        <div className="rules-block-header">
                          <strong>1. Firestore Rules</strong>
                          <span className="text-muted text-xs">Console → Firestore Database → Rules tab:</span>
                        </div>
                        <pre className="rules-code-box">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                        </pre>
                      </div>

                      <div className="rules-block mt-3">
                        <div className="rules-block-header">
                          <strong>2. Storage Rules (for CV & Photos)</strong>
                          <span className="text-muted text-xs">Console → Storage → Rules tab:</span>
                        </div>
                        <pre className="rules-code-box">
{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Firebase Config Form */}
                  <form onSubmit={handleSaveFirebaseConfig} className="admin-form-box mt-4">
                    <h6>Enter Firebase Project Credentials:</h6>
                    <p className="text-muted text-xs mb-3">
                      Found in your Firebase Console → Project Settings → General → "Your apps" (Web config object).
                    </p>

                    <div className="form-grid-2">
                      <div className="form-field">
                        <label>apiKey</label>
                        <input
                          type="text"
                          required
                          placeholder="AIzaSy..."
                          value={fbConfigForm.apiKey}
                          onChange={(e) => setFbConfigForm({ ...fbConfigForm, apiKey: e.target.value })}
                          className="admin-input"
                        />
                      </div>

                      <div className="form-field">
                        <label>projectId</label>
                        <input
                          type="text"
                          required
                          placeholder="your-project-id"
                          value={fbConfigForm.projectId}
                          onChange={(e) => setFbConfigForm({ ...fbConfigForm, projectId: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-field">
                        <label>storageBucket</label>
                        <input
                          type="text"
                          placeholder="your-project-id.appspot.com"
                          value={fbConfigForm.storageBucket}
                          onChange={(e) => setFbConfigForm({ ...fbConfigForm, storageBucket: e.target.value })}
                          className="admin-input"
                        />
                      </div>

                      <div className="form-field">
                        <label>authDomain</label>
                        <input
                          type="text"
                          placeholder="your-project-id.firebaseapp.com"
                          value={fbConfigForm.authDomain}
                          onChange={(e) => setFbConfigForm({ ...fbConfigForm, authDomain: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-field">
                        <label>messagingSenderId</label>
                        <input
                          type="text"
                          placeholder="1234567890"
                          value={fbConfigForm.messagingSenderId}
                          onChange={(e) => setFbConfigForm({ ...fbConfigForm, messagingSenderId: e.target.value })}
                          className="admin-input"
                        />
                      </div>

                      <div className="form-field">
                        <label>appId</label>
                        <input
                          type="text"
                          placeholder="1:1234567890:web:abcdef..."
                          value={fbConfigForm.appId}
                          onChange={(e) => setFbConfigForm({ ...fbConfigForm, appId: e.target.value })}
                          className="admin-input"
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary mt-2">
                      <Save size={14} />
                      <span>Connect Firebase</span>
                    </button>
                  </form>

                  {/* Reset defaults */}
                  <div className="danger-zone-box mt-4">
                    <h6>Reset Data to Code Defaults</h6>
                    <p className="text-muted text-xs">
                      Reverts all local edits back to original portfolio data.
                    </p>
                    <button
                      type="button"
                      className="btn btn-ghost text-danger btn-sm mt-2"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to restore code defaults?')) {
                          resetToDefaults();
                          showNotification('Restored to default portfolio data.');
                        }
                      }}
                    >
                      <Trash2 size={13} />
                      <span>Reset to Original</span>
                    </button>
                  </div>

                </div>
              )}

              {/* TAB 6: SECURITY / CHANGE PIN */}
              {activeTab === 'security' && (
                <div className="tab-pane">
                  <div className="pane-header">
                    <div>
                      <h4>Admin Passcode & Security</h4>
                      <p className="text-muted text-sm">
                        Change the secret PIN used to unlock this CMS panel.
                      </p>
                    </div>
                  </div>

                  <div className="admin-form-box">
                    <div className="form-field">
                      <label>Set New Passcode (Min 4 chars)</label>
                      <input
                        type="password"
                        placeholder="Enter new PIN..."
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className="admin-input"
                      />
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary mt-2"
                      onClick={() => {
                        try {
                          changeAdminPin(newPin);
                          setNewPin('');
                          showNotification('Passcode updated successfully!');
                        } catch (err) {
                          showNotification(err.message, 'error');
                        }
                      }}
                    >
                      <Key size={14} />
                      <span>Update Passcode</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
