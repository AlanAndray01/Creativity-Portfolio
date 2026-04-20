'use client';

import React, { useState } from 'react';
import './ContactSection.css';

interface ToastState {
  show: boolean;
  type: 'success' | 'error';
  message: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    message: '',
    newsletter: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>({ show: false, type: 'success', message: '' });

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    // Handle checkbox separately
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [id]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Frontend Email Validation (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('error', 'The email address is invalid.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullname,
          email: formData.email,
          message: formData.message,
          newsletter: formData.newsletter
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      showToast('success', 'Message sent successfully!');
      setFormData({ fullname: '', email: '', message: '', newsletter: false }); // Reset form
    } catch (error) {
      if (error instanceof Error) {
        showToast('error', error.message);
      } else {
        showToast('error', 'Failed to send message.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="contact-card-wrapper">
        
        {/* LEFT SIDEBAR */}
        <div className="contact-sidebar">
          <div className="sidebar-header">
            <span className="accent-line"></span>
            <h2>Get In Touch</h2>
          </div>
          <div className="sidebar-features">
            <div className="feature-item">
              <div className="feature-icon">✔</div>
              <div className="feature-text">
                <h4>Quick Response</h4>
                <p>We aim to respond to all inquiries within 24 hours.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✔</div>
              <div className="feature-text">
                <h4>Project Consulting</h4>
                <p>Book a free 30-min consultation for your new idea.</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✔</div>
              <div className="feature-text">
                <h4>Global Reach</h4>
                <p>Available for remote work worldwide.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT FORM AREA */}
        <div className="contact-form-container">
          <div className="form-header">
            <h3>Send a Message</h3>
          </div>
          
          <form className="form-form" onSubmit={handleSubmit}>
            <div className="fields-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                className="input-field" 
                placeholder="Enter your email address" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>

            <div className="fields-group">
              <label htmlFor="fullname">Full name</label>
              <input 
                type="text" 
                id="fullname" 
                className="input-field" 
                placeholder="Enter your full name" 
                value={formData.fullname}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="fields-group">
              <label htmlFor="message">Message</label>
              <textarea 
                id="message" 
                className="input-field" 
                placeholder="Type your message here..." 
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="checkbox-group">
              <input 
                type="checkbox" 
                id="newsletter" 
                checked={formData.newsletter}
                onChange={handleChange}
              />
              <label htmlFor="newsletter">Get updates and notifications about our work.</label>
            </div>
            
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      {/* TOAST ALERT */}
      {toast.show && (
        <div className={`toast-alert ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}>
          {toast.type === 'success' ? (
             <span>✅</span>
          ) : (
             <span>⚠️</span>
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </section>
  );
}
