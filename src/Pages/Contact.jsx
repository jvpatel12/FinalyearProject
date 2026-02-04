import React, { useState } from 'react';
import { Mail, MapPin, Phone, Linkedin } from 'lucide-react';
import Button from '../common/Button';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setSubmitMessage('Thank you for your message! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitMessage(''), 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-lg rounded-2xl max-w-4xl w-full grid md:grid-cols-2 overflow-hidden">

        {/* Left Section */}
        <div className="bg-blue-600 text-white p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-blue-100 mb-6">
            Feel free to contact me for projects, internships, or collaborations.
          </p>

          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <MapPin size={20} />
              <div>
                <p className="font-semibold">Location:</p>
                <p>India</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={20} />
              <div>
                <p className="font-semibold">Email:</p>
                <a href="mailto:jeel@example.com" className="hover:underline">jeel@example.com</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={20} />
              <div>
                <p className="font-semibold">Phone:</p>
                <a href="tel:+919876543210" className="hover:underline">+91 98765 43210</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Linkedin size={20} />
              <div>
                <p className="font-semibold">LinkedIn:</p>
                <a href="https://linkedin.com/in/jeelpatel" target="_blank" rel="noopener noreferrer" className="hover:underline">linkedin.com/in/jeelpatel</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="p-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Contact Form
          </h3>

          {submitMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors resize-none ${
                  errors.message ? 'border-red-500' : 'border-gray-300'
                }`}
              ></textarea>
              {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Contact;
