import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, CheckCircle, Target, Users, Lightbulb, TrendingUp, Award, Briefcase, MapPin, Clock, ChevronRight } from 'lucide-react';

const RamanujWebsite = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    message: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    alert('Thank you for your interest! We will get back to you soon.');
    setFormData({ firstName: '', lastName: '', email: '', company: '', message: '' });
  };

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Careers', id: 'careers' },
    { name: 'Contact', id: 'contact' }
  ];

  const jobListings = [
    {
      title: 'Senior AI Data Engineer',
      location: 'Bangalore, India',
      type: 'Full-time',
      department: 'Engineering',
      description: 'Lead the development of precision data pipelines for global AI systems. Work with cutting-edge technology to ensure zero-error data validation.',
      requirements: ['5+ years in data engineering', 'Expertise in Python, SQL, and distributed systems', 'Experience with AI/ML data workflows']
    },
    {
      title: 'Quality Assurance Specialist',
      location: 'Remote',
      type: 'Full-time',
      department: 'Operations',
      description: 'Ensure exceptional quality standards across all data deliverables. Be the guardian of our commitment to zero-error datasets.',
      requirements: ['3+ years in QA or data validation', 'Meticulous attention to detail', 'Understanding of AI/ML data requirements']
    },
    {
      title: 'Business Development Manager',
      location: 'Hybrid',
      type: 'Full-time',
      department: 'Sales',
      description: 'Drive growth by building relationships with global AI companies. Help us expand our mission of universal machine intelligence.',
      requirements: ['4+ years in B2B sales', 'Experience in AI/tech industry', 'Track record of exceeding targets']
    }
  ];

  const renderHome = () => (
    <div className="min-h-screen">
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-semibold">
                Building the Future of Embedded Intelligence
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight">
                Making Every Machine <span className="text-indigo-600">Think</span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                The world's most precise, trustworthy, and secure datasets—meticulously verified by humans—powering the next century of AI innovation.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setCurrentPage('contact')}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg">
                  Get Started <ArrowRight size={20} />
                </button>
                <button 
                  onClick={() => setCurrentPage('about')}
                  className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-slate-50 transition-all border-2 border-indigo-600">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative h-96 lg:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-3xl transform rotate-3 opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center text-white">
                <div className="text-center space-y-4 p-8">
                  <Target size={80} className="mx-auto mb-4 opacity-90" />
                  <h3 className="text-3xl font-bold">Universal Trust</h3>
                  <p className="text-lg opacity-90">Zero-error AI systems worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: '100%', label: 'Data Accuracy' },
              { value: '50+', label: 'Global Clients' },
              { value: '1B+', label: 'Data Points Verified' },
              { value: '24/7', label: 'Support' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-6 rounded-xl bg-slate-50 hover:bg-indigo-50 transition-all transform hover:scale-105">
                <div className="text-4xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gradient-to-br from-indigo-50 to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all">
              <Target className="text-indigo-600 mb-6" size={48} />
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Our Vision</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                To make every machine on Earth smart enough to think for itself, creating a future of universal trust.
              </p>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all">
              <Lightbulb className="text-indigo-600 mb-6" size={48} />
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Our Mission</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                We provide the world's most precise, trustworthy, and secure datasets, checked meticulously by people, to ensure every global AI system operates with zero error.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderAbout = () => (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">The Ramanuj Code</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Inspired by the genius of Srinivasa Ramanujan—pursuing profound truth from first principles and finding order in impossible complexity.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: <Users size={40} />, title: 'Customer Origin', desc: 'Every effort begins and ends with client trust' },
            { icon: <Award size={40} />, title: 'Exceptional Quality', desc: 'Relentless demand for the highest standards' },
            { icon: <TrendingUp size={40} />, title: 'Innovation First', desc: 'Simplify, then innovate at every step' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="text-indigo-600 mb-4">{item.icon}</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-3xl p-12 text-center">
          <h3 className="text-4xl font-bold mb-6">Building the Next Century</h3>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            We're not just creating technology—we're establishing the foundation for autonomous, embedded intelligence that will define the next hundred years.
          </p>
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">Our Services</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Precision data solutions that power the world's most advanced AI systems
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { 
              title: 'Data Validation', 
              desc: 'Human-verified datasets with zero-error guarantee for AI training and deployment',
              features: ['Manual verification', 'Quality assurance', 'Continuous monitoring']
            },
            { 
              title: 'AI Data Engineering', 
              desc: 'Custom data pipelines designed for precision and scalability in embedded systems',
              features: ['Custom pipelines', 'Real-time processing', 'Edge optimization']
            },
            { 
              title: 'Quality Assurance', 
              desc: 'End-to-end quality control ensuring every data point meets the highest standards',
              features: ['Automated testing', 'Manual review', 'Compliance verification']
            },
            { 
              title: 'Consultation Services', 
              desc: 'Strategic guidance on building trustworthy AI systems from the ground up',
              features: ['Architecture design', 'Best practices', 'Implementation support']
            },
            { 
              title: 'Embedded AI Solutions', 
              desc: 'Specialized datasets for edge computing and embedded intelligence applications',
              features: ['IoT optimization', 'Low-latency data', 'Resource-efficient']
            },
            { 
              title: 'Custom Data Projects', 
              desc: 'Tailored data solutions for unique industry requirements and use cases',
              features: ['Industry-specific', 'Flexible scope', 'Dedicated teams']
            }
          ].map((service, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
              <p className="text-slate-600 mb-6">{service.desc}</p>
              <ul className="space-y-2">
                {service.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle size={18} className="text-indigo-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );


  const renderCareers = () => (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">Join Our Mission</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Be part of building the next century of autonomous intelligence. We're looking for pioneers who dare to think differently.
          </p>
        </div>

        <div className="space-y-8">
          {jobListings.map((job, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden">
              <div className="p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 mb-3">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-indigo-600" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={18} className="text-indigo-600" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase size={18} className="text-indigo-600" />
                        <span>{job.department}</span>
                      </div>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2">
                    Apply Now <ChevronRight size={18} />
                  </button>
                </div>
                
                <p className="text-lg text-slate-700 mb-6">{job.description}</p>
                
                <div>
                  <h4 className="font-bold text-slate-900 mb-3">Requirements:</h4>
                  <ul className="space-y-2">
                    {job.requirements.map((req, ridx) => (
                      <li key={ridx} className="flex items-start gap-3 text-slate-600">
                        <CheckCircle size={20} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-3xl p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">Don't see the right role?</h3>
          <p className="text-xl opacity-90 mb-6">We're always looking for exceptional talent. Send us your resume and let's talk about how you can contribute to our mission.</p>
          <button 
            onClick={() => setCurrentPage('contact')}
            className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-slate-100 transition-all transform hover:scale-105">
            Get in Touch
          </button>
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">Let's Build Together</h2>
          <p className="text-xl text-slate-600">
            Ready to power your AI systems with zero-error data? Let's start the conversation.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-700 font-semibold mb-2">First Name</label>
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => handleFormChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Last Name</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => handleFormChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-all" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-slate-700 font-semibold mb-2">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-all" 
              />
            </div>
            
            <div>
              <label className="block text-slate-700 font-semibold mb-2">Company</label>
              <input 
                type="text" 
                value={formData.company}
                onChange={(e) => handleFormChange('company', e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-all" 
              />
            </div>
            
            <div>
              <label className="block text-slate-700 font-semibold mb-2">Message</label>
              <textarea 
                rows="5" 
                value={formData.message}
                onChange={(e) => handleFormChange('message', e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-all"
              ></textarea>
            </div>
            
            <button 
              onClick={handleSubmit}
              className="w-full px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2">
              Send Message <ArrowRight size={20} />
            </button>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-slate-50 rounded-xl">
            <h4 className="font-bold text-slate-900 mb-2">Email</h4>
            <p className="text-slate-600">contact@ramanuj.com</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl">
            <h4 className="font-bold text-slate-900 mb-2">Phone</h4>
            <p className="text-slate-600">+91 98400 00000</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl">
            <h4 className="font-bold text-slate-900 mb-2">Location</h4>
            <p className="text-slate-600">Erode, Tamil Nadu, India</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white bg-opacity-95'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-indigo-600 cursor-pointer" onClick={() => setCurrentPage('home')}>
              RAMANUJ
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`font-semibold transition-all hover:text-indigo-600 ${
                    currentPage === item.id ? 'text-indigo-600' : 'text-slate-700'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <button
              className="md:hidden text-slate-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4">
              {navigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`block w-full text-left font-semibold py-2 transition-all hover:text-indigo-600 ${
                    currentPage === item.id ? 'text-indigo-600' : 'text-slate-700'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {currentPage === 'home' && renderHome()}
      {currentPage === 'about' && renderAbout()}
      {currentPage === 'services' && renderServices()}
      {currentPage === 'careers' && renderCareers()}
      {currentPage === 'contact' && renderContact()}

      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-indigo-400 mb-4">RAMANUJ</h3>
              <p className="text-slate-400">Building the next century of autonomous intelligence</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <div className="space-y-2">
                {['About', 'Services', 'Culture', 'Careers'].map((item) => (
                  <button key={item} onClick={() => setCurrentPage(item.toLowerCase())} className="block text-slate-400 hover:text-white transition-all">
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <div className="space-y-2 text-slate-400">
                <p>Documentation</p>
                <p>API Reference</p>
                <p>Case Studies</p>
                <p>Blog</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <div className="space-y-2 text-slate-400">
                <p>contact@ramanuj.com</p>
                <p>+91 98400 00000</p>
                <p>Erode, Tamil Nadu, India</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2025 Ramanuj. Building universal trust, one dataset at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RamanujWebsite;