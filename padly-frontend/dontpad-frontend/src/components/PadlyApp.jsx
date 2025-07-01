import React, { useState, useEffect, useRef } from 'react';
import { FileText, Clock, Save } from 'lucide-react';
import './PadlyApp.css';

const API_BASE_URL = 'http://localhost:8080/pads';

export default function PadlyApp() {
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [currentSlug, setCurrentSlug] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const saveTimeoutRef = useRef(null);
  const textareaRef = useRef(null);

  // Extract slug from URL path on component mount
  useEffect(() => {
    const path = window.location.pathname;
    const extractedSlug = path.startsWith('/') ? path.substring(1) : path;

    if (extractedSlug && extractedSlug.trim()) {
      const cleanSlug = extractedSlug.trim();
      setSlug(cleanSlug);
      setCurrentSlug(cleanSlug);
      loadPad(cleanSlug);
    } else {
      setIsInitialLoad(false);
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    // Don't auto-save during initial load or if no slug
    if (currentSlug && content !== undefined && !isInitialLoad) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        savePad();
      }, 2000);

      return () => {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
      };
    }
  }, [content, currentSlug, isInitialLoad]);

  const loadPad = async (padSlug) => {
    if (!padSlug) return;

    setIsLoading(true);
    setIsInitialLoad(true);

    try {
      console.log('Loading pad:', padSlug);
      const response = await fetch(`${API_BASE_URL}/${padSlug}`);

      if (response.ok) {
        const data = await response.json();
        console.log('Loaded pad data:', data);
        setContent(data.content || '');
        if (data.updatedAt) {
          setLastSaved(new Date(data.updatedAt));
        }
      } else if (response.status === 404) {
        console.log('Pad not found, creating new one');
        setContent('');
        setLastSaved(null);
      } else {
        console.error('Error loading pad:', response.status, response.statusText);
        setContent('');
      }
    } catch (error) {
      console.error('Error loading pad:', error);
      setContent('');
    } finally {
      setIsLoading(false);
      // Allow auto-save after initial load is complete
      setTimeout(() => setIsInitialLoad(false), 100);
    }
  };

  const savePad = async () => {
    if (!currentSlug || isSaving) return;

    // Don't save if content is empty or just whitespace
    if (!content || content.trim().length === 0) {
      console.log('Skipping save - content is empty');
      return;
    }

    setIsSaving(true);
    try {
      const requestBody = { content };
      console.log('Sending request to:', `${API_BASE_URL}/${currentSlug}`);
      console.log('Request body:', requestBody);

      const response = await fetch(`${API_BASE_URL}/${currentSlug}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        setLastSaved(new Date());
        console.log('Pad saved successfully');
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error saving pad:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSlugSubmit = (e) => {
    if (e) e.preventDefault();
    if (slug.trim()) {
      const cleanSlug = slug.trim();
      setCurrentSlug(cleanSlug);
      window.history.pushState({}, '', `/${cleanSlug}`);
      loadPad(cleanSlug);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    // Mark that this is no longer initial load once user starts typing
    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  };

  const formatLastSaved = (date) => {
    if (!date) return 'Never saved';
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Saved just now';
    if (diffInSeconds < 3600) return `Saved ${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `Saved ${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `Saved on ${date.toLocaleDateString()}`;
  };

  const handleNewPad = () => {
    setCurrentSlug('');
    setSlug('');
    setContent('');
    setLastSaved(null);
    setIsInitialLoad(false);
    window.history.pushState({}, '', '/');
  };

  if (!currentSlug) {
    return (
      <div className="padly-landing-container">
        <div className="padly-landing-card">
          <div className="padly-landing-header">
            <FileText className="padly-icon" />
            <h1 className="padly-title">Padly</h1>
            <p className="padly-subtitle">Create or access a shared notepad</p>
          </div>

          <form onSubmit={handleSlugSubmit}>
            <div className="padly-input-group">
              <label htmlFor="slug" className="padly-label">
                Notepad Name
              </label>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="my-awesome-notes"
                className="padly-input"
                required
              />
              <p className="padly-url-preview">
                URL will be: /{slug || 'your-notepad-name'}
              </p>
            </div>

            <button type="submit" className="padly-button">
              Open Notepad
            </button>
          </form>

          <div className="padly-notice">
            <p>Anyone with the link can view and edit this notepad</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="padly-container">
      <div className="padly-header">
        <div className="padly-header-content">
          <div className="padly-header-left">
            <FileText className="padly-header-icon" />
            <h1 className="padly-header-title">
              /{currentSlug}
            </h1>
          </div>

          <div className="padly-header-right">
            {isSaving && (
              <div className="padly-status-item padly-saving-status">
                <Save className="padly-status-icon padly-saving-icon" />
                Saving...
              </div>
            )}

            <div className="padly-status-item">
              <Clock className="padly-status-icon" />
              {formatLastSaved(lastSaved)}
            </div>

            <button onClick={handleNewPad} className="padly-new-pad-button">
              New Pad
            </button>
          </div>
        </div>
      </div>

      <div className="padly-main-content">
        {isLoading ? (
          <div className="padly-loading-container">
            <div className="padly-spinner"></div>
            <span className="padly-loading-text">Loading notepad...</span>
          </div>
        ) : (
          <div className="padly-textarea-container">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="Start typing... Your content will be saved automatically after a few seconds of inactivity."
              className="padly-textarea"
            />

            <div className="padly-char-count">
              {content.length} characters
            </div>
          </div>
        )}
      </div>

      <div className="padly-footer">
        <div className="padly-footer-content">
          <p>Share this URL with others to collaborate: {window.location.origin}/{currentSlug}</p>
        </div>
      </div>
    </div>
  );
}