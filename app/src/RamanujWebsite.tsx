import { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, CheckCircle, Target, Users, Lightbulb, TrendingUp, Award, Briefcase, MapPin, Clock, ChevronRight, Cpu, Database, Shield, Zap } from 'lucide-react';
import { gsap } from 'gsap';
import Splide from '@splidejs/splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import '@splidejs/splide/dist/css/splide.min.css';

// CountUp Component for animated statistics
const CountUp = ({ 
  end, 
  duration = 2000, 
  start = 0, 
  suffix = '', 
  prefix = '',
  className = ''
}: { 
  end: number; 
  duration?: number; 
  start?: number; 
  suffix?: string; 
  prefix?: string;
  className?: string;
}) => {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const countRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(start + (end - start) * easeOutQuart);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, start, duration]);

  return (
    <div ref={countRef} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
};


// RollingWordAnimation Component with GSAP
const RollingWordAnimation = ({ 
  words, 
  className = "", 
  delay = 0,
  wordDelay = 0.8,
  charSpeed = 0.1
}: { 
  words: (string | { text: string; style?: React.CSSProperties })[];
  className?: string; 
  delay?: number;
  wordDelay?: number;
  charSpeed?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    const container = containerRef.current;
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Create word elements
    const wordElements: HTMLSpanElement[] = [];
    words.forEach((word) => {
      const wordSpan = document.createElement('span');
      const wordText = typeof word === 'string' ? word : word.text;
      const wordStyle = typeof word === 'object' ? word.style : {};
      
      wordSpan.textContent = wordText;
      wordSpan.style.display = 'inline-block';
      wordSpan.style.marginRight = '1rem';
      wordSpan.style.opacity = '0';
      wordSpan.style.transform = 'translateY(50px) rotateX(90deg)';
      wordSpan.style.transformOrigin = 'bottom';
      
      // Apply custom styles if provided
      if (wordStyle) {
        Object.assign(wordSpan.style, wordStyle);
      }
      
      container.appendChild(wordSpan);
      wordElements.push(wordSpan);
    });

    // Create timeline
    const tl = gsap.timeline({ delay });

    // Animate each word with rolling effect
    wordElements.forEach((wordEl, index) => {
      tl.to(wordEl, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
        transformOrigin: "bottom"
      }, index * wordDelay);
    });

    // Add cursor animation
    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.className = 'animate-pulse';
    cursor.style.marginLeft = '0.25rem';
    container.appendChild(cursor);

    // Animate cursor
    tl.to(cursor, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    }, wordElements.length * wordDelay);

    return () => {
      tl.kill();
    };
  }, [isVisible, words, delay, wordDelay, charSpeed]);

  return (
    <div ref={containerRef} className={className}>
    </div>
  );
};


type PageId = 'home' | 'services' | 'careers' | 'contact';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  message: string;
}

const RamanujWebsite = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [testimonialsInView, setTestimonialsInView] = useState<boolean>(false);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const [ramanujCodeInView, setRamanujCodeInView] = useState<boolean>(false);
  const ramanujCodeRef = useRef<HTMLDivElement>(null);
  const [visionMissionInView, setVisionMissionInView] = useState<boolean>(false);
  const visionMissionRef = useRef<HTMLDivElement>(null);
  const [mandatesInView, setMandatesInView] = useState<boolean>(false);
  const mandatesRef = useRef<HTMLDivElement>(null);
  const splideRef = useRef<Splide | null>(null);
  const careersSplideRef = useRef<Splide | null>(null);
  const [openRolesInView, setOpenRolesInView] = useState<boolean>(false);
  const openRolesRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);
  const [heroSrc, setHeroSrc] = useState<string>('/team-work.jpg');
  const [heroLoaded, setHeroLoaded] = useState<boolean>(false);
  const [servicesHeroSrc, setServicesHeroSrc] = useState<string>('/services.jpg');
  const [servicesHeroLoaded, setServicesHeroLoaded] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Check if testimonials section is in view (30% threshold)
      if (testimonialsRef.current) {
        const rect = testimonialsRef.current.getBoundingClientRect();
        const elementHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        // Calculate how much of the element is visible
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        const visibilityPercentage = (visibleHeight / elementHeight) * 100;
        
        // Trigger animation when 30% of the element is visible
        const isInView = visibilityPercentage >= 30;
        setTestimonialsInView(isInView);
      }

      // Check if Ramanuj Code section is in view (30% threshold)
      if (ramanujCodeRef.current) {
        const rect = ramanujCodeRef.current.getBoundingClientRect();
        const elementHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        // Calculate how much of the element is visible
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        const visibilityPercentage = (visibleHeight / elementHeight) * 100;
        
        // Trigger animation when 30% of the element is visible
        const isInView = visibilityPercentage >= 30;
        setRamanujCodeInView(isInView);
      }

      // Check if Vision & Mission section is in view (30% threshold)
      if (visionMissionRef.current) {
        const rect = visionMissionRef.current.getBoundingClientRect();
        const elementHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        // Calculate how much of the element is visible
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        const visibilityPercentage = (visibleHeight / elementHeight) * 100;
        
        // Trigger animation when 30% of the element is visible
        const isInView = visibilityPercentage >= 30;
        setVisionMissionInView(isInView);
      }

      // Check if Mandates section is in view (20% threshold)
      if (mandatesRef.current) {
        const rect = mandatesRef.current.getBoundingClientRect();
        const elementHeight = rect.height;
        const viewportHeight = window.innerHeight;
        
        // Calculate how much of the element is visible
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        const visibilityPercentage = (visibleHeight / elementHeight) * 100;
        
        // Trigger animation when 20% of the element is visible
        const isInView = visibilityPercentage >= 10;
        setMandatesInView(isInView);
      }

      // Check if Open Roles section is in view (30% threshold)
      if (openRolesRef.current) {
        const rect = openRolesRef.current.getBoundingClientRect();
        const elementHeight = rect.height;
        const viewportHeight = window.innerHeight;
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        const visibilityPercentage = (visibleHeight / Math.max(elementHeight, 1)) * 100;
        const isInView = visibilityPercentage >= 30;
        setOpenRolesInView(isInView);
      }
    };
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize Splide carousel when services page is active
  useEffect(() => {
    if (currentPage === 'services' && !splideRef.current) {
      // Preload all service images for smooth carousel experience
      const serviceImages = [
        '/quality-assurance-iso-din-service-guarantee-standard-retail-concept-photo.jpg',
        '/2212d129fa7839fd210452cdc0093e41.jpg',
        '/Testing.png',
        '/Strategic-AI-Consultation.png',
        '/Embedded-AI.png',
        '/project.png'
      ];
      
      // Preload images
      serviceImages.forEach(src => {
        const img = new Image();
        img.src = src;
      });

      // Wait for DOM to be ready, then initialize Splide
      const initSplide = () => {
        const splideElement = document.querySelector('.splide') as HTMLElement;
        if (splideElement) {
          splideRef.current = new Splide('.splide', {
            type: 'loop',
            drag: 'free',
            focus: 'center',
            perPage: 3,
            gap: '2rem',
            padding: '2rem',
            pagination: true,
            arrows: false,
            breakpoints: {
              1024: {
                perPage: 2,
                gap: '1.5rem',
                padding: '1.5rem',
              },
              768: {
                perPage: 1,
                gap: '1rem',
                padding: '1rem',
              },
            },
            autoScroll: {
              speed: 1,
              pauseOnHover: true,
              pauseOnFocus: false,
            },
            // Ensure images are loaded before carousel starts
            preloadPages: 2,
            updateOnMove: true,
            rewind: true,
          });

          splideRef.current.mount({ AutoScroll });

          // No custom progress bar or controls; using built-in pagination dots

          // Autoplay only when in viewport
          const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (!splideRef.current) return;
              const autoScroll =
                // @ts-ignore
                splideRef.current.Components && splideRef.current.Components.AutoScroll;
              if (entry.isIntersecting) {
                if (autoScroll) { autoScroll.play(); }
                else {
                  // @ts-ignore
                  splideRef.current?.Components?.Autoplay?.play?.();
                }
              } else {
                if (autoScroll) { autoScroll.pause(); }
                else {
                  // @ts-ignore
                  splideRef.current?.Components?.Autoplay?.pause?.();
                }
              }
            });
          }, { threshold: 0.3 });
          io.observe(splideElement);
          splideRef.current.on('destroy', () => io.disconnect());
          
          // Force refresh after mounting to ensure images display
          setTimeout(() => {
            if (splideRef.current) {
              splideRef.current.refresh();
            }
          }, 100);
        }
      };

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(initSplide);
    }

    return () => {
      if (splideRef.current) {
        splideRef.current.destroy();
        splideRef.current = null;
      }
    };
  }, [currentPage]);

  // Initialize Splide for Careers Qualities when careers page is active
  useEffect(() => {
    if (currentPage === 'careers' && !careersSplideRef.current) {
      const init = () => {
        const el = document.querySelector('.careers-splide') as HTMLElement | null;
        if (!el) return;
        careersSplideRef.current = new Splide('.careers-splide', {
          type: 'loop',
          perPage: 3,
          autoplay: true,
          pagination: true,
          arrows: true,
          gap: '1.5rem',
          padding: '0.5rem',
          breakpoints: {
            1024: { perPage: 2 },
            768: { perPage: 1 }
          }
        });
        careersSplideRef.current.mount();

        // Using built-in pagination dots; removed custom progress and controls

        // Autoplay only when in viewport
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!careersSplideRef.current) return;
            if (entry.isIntersecting) {
              // @ts-ignore
              careersSplideRef.current?.Components?.Autoplay?.play?.();
            } else {
              // @ts-ignore
              careersSplideRef.current?.Components?.Autoplay?.pause?.();
            }
          });
        }, { threshold: 0.3 });
        observer.observe(el);
        careersSplideRef.current.on('destroy', () => observer.disconnect());
      };
      requestAnimationFrame(init);
    }
    return () => {
      if (careersSplideRef.current) {
        careersSplideRef.current.destroy();
        careersSplideRef.current = null;
      }
    };
  }, [currentPage]);

  // Handle image loading for service cards
  useEffect(() => {
    if (currentPage === 'services') {
      const serviceImages = [
        '/quality-assurance-iso-din-service-guarantee-standard-retail-concept-photo.jpg',
        '/2212d129fa7839fd210452cdc0093e41.jpg',
        '/Testing.png',
        '/Strategic-AI-Consultation.png',
        '/Embedded-AI.png',
        '/project.png'
      ];

      let loadedCount = 0;
      const totalImages = serviceImages.length;

      const handleImageLoad = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          setImagesLoaded(true);
          // Force refresh Splide after all images are loaded
          setTimeout(() => {
            if (splideRef.current) {
              splideRef.current.refresh();
            }
          }, 100);
        }
      };

      serviceImages.forEach(src => {
        const img = new Image();
        img.onload = handleImageLoad;
        img.onerror = handleImageLoad; // Count as loaded even if error
        img.src = src;
      });
    }
  }, [currentPage]);

  const handleFormChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev: ContactFormData) => ({ ...prev, [field]: value }));
  };

  const validateForm = (data: ContactFormData) => {
    const errors: Partial<Record<keyof ContactFormData, string>> = {};
    if (!data.firstName.trim()) errors.firstName = 'First name is required';
    if (!data.lastName.trim()) errors.lastName = 'Last name is required';
    if (!data.email.trim()) errors.email = 'Email is required';
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) errors.email = 'Enter a valid email';
    }
    if (!data.message.trim()) errors.message = 'Please add a brief message';
    return errors;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setSubmitStatus('idle');
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    setIsSubmitting(true);
    try {
      const submission = { ...formData };

      // Send to backend API
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';
      const res = await fetch(`${API_BASE_URL}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission)
      });

      if (!res.ok) {
        throw new Error('Failed to submit');
      }

      // Persist to localStorage (append to array) as a local history
      try {
        const key = 'ramanuj_contact_submissions';
        const existing = localStorage.getItem(key);
        const list = existing ? JSON.parse(existing) : [];
        list.push({ ...submission, submittedAt: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(list));
      } catch {}

      // Optional webhook POST
      const webhookUrl = (import.meta as any)?.env?.VITE_CONTACT_WEBHOOK_URL as string | undefined;
      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...submission, submittedAt: new Date().toISOString() })
          });
        } catch {}
      }

      setSubmitStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', company: '', message: '' });
      setFormErrors({});
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigation: { name: string; id: PageId }[] = [
    { name: 'Home', id: 'home' },
    { name: 'Services', id: 'services' },
    { name: 'Careers', id: 'careers' },
    { name: 'Contact', id: 'contact' }
  ];

  interface JobListing {
    id?: number;
    title: string;
    location: string;
    type: string;
    department: string;
    description: string;
    requirements: string[];
  }

  const [jobListings, setJobListings] = useState<JobListing[]>([
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
  ]);

  // Fetch jobs from backend when visiting careers, fallback to static list on error
  useEffect(() => {
    if (currentPage !== 'careers') return;
    (async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';
        const res = await fetch(`${API_BASE_URL}/api/jobs`);
        if (!res.ok) return;
        const jobs: JobListing[] = await res.json();
        if (Array.isArray(jobs) && jobs.length > 0) {
          setJobListings(jobs);
        }
      } catch {
        // ignore and keep defaults
      }
    })();
  }, [currentPage]);

  const renderHome = () => (
    <div className="min-h-screen">
      <section className="relative min-h-[90vh] pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            className="w-full h-full object-cover"
            src="/AI_Business_Video_Creation.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-white">
              <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-full text-white text-sm font-semibold">
                Building the Future of Embedded Intelligence
              </div>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <RollingWordAnimation 
                    words={[
                      "Making",
                      "Every",
                      "Machine",
                      { text: "Think", style: { color: "#4f46e5" } }
                    ]}
                    delay={0.5}
                    wordDelay={0.8}
                    charSpeed={0.1}
                  />
                </h1>
              <p className="text-xl text-slate-100/90 leading-relaxed">
                The world's most precise, trustworthy, and secure datasets—meticulously verified by humans—powering the next century of AI innovation.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setCurrentPage('contact')}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg">
                  Get Started <ArrowRight size={20 as number} />
                </button>
                <button 
                  onClick={() => {
                    setCurrentPage('home');
                    setTimeout(() => {
                      document.getElementById('home-about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 0);
                  }}
                  className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-slate-50 transition-all border-2 border-white/60">
                  Learn More
                </button>
              </div>
            </div>
            <div className="hidden lg:block" />
          </div>
        </div>
      </section>

      

      

      {/* Moved About content below Vision & Mission */}
      <section ref={ramanujCodeRef} id="home-about" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            ramanujCodeInView 
              ? 'animate-auto-show opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
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
              <div 
                key={idx} 
                className={`bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-700 transform advanced-card magnetic-card ${
                  ramanujCodeInView 
                    ? 'animate-auto-show opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  animationDelay: `${idx * 200}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="text-indigo-600 mb-4 animate-icon-pulse">{item.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3 animate-text-shimmer">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>

          <div 
            className={`bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-3xl p-12 text-center transition-all duration-700 transform ${
              ramanujCodeInView 
                ? 'animate-auto-show opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
            style={{
              animationDelay: '600ms',
              animationFillMode: 'both'
            }}
          >
            <h3 className="text-4xl font-bold mb-6">Building the Next Century</h3>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              We're not just creating technology—we're establishing the foundation for autonomous, embedded intelligence that will define the next hundred years.
            </p>
          </div>
        </div>
      </section>

      <section ref={visionMissionRef} className="py-20 px-6 bg-gradient-to-br from-indigo-50 to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div 
              className={`bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-700 transform advanced-card magnetic-card animate-card-glow ${
                visionMissionInView 
                  ? 'animate-auto-show opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                animationDelay: '200ms',
                animationFillMode: 'both'
              }}
            >
              <Target className="text-indigo-600 mb-6 animate-icon-pulse" size={48} />
              <h3 className="text-3xl font-bold text-slate-900 mb-4 animate-text-shimmer">Our Vision</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                To make every machine on Earth smart enough to think for itself, creating a future of universal trust.
              </p>
            </div>
            <div 
              className={`bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-700 transform advanced-card magnetic-card animate-card-glow ${
                visionMissionInView 
                  ? 'animate-auto-show opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{
                animationDelay: '400ms',
                animationFillMode: 'both'
              }}
            >
              <Lightbulb className="text-indigo-600 mb-6 animate-icon-pulse" size={48} />
              <h3 className="text-3xl font-bold text-slate-900 mb-4 animate-text-shimmer">Our Mission</h3>
              <p className="text-lg text-slate-600 leading-relaxed">
                We provide the world's most precise, trustworthy, and secure datasets, checked meticulously by people, to ensure every global AI system operates with zero error.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: 100, suffix: '%', label: 'Data Accuracy' },
              { value: 50, suffix: '+', label: 'Global Clients' },
              { value: 10, suffix: 'M', label: 'Data Points Verified' },
              { value: 24, suffix: '/7', label: 'Support' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-6 rounded-xl bg-slate-50 hover:bg-indigo-50 transition-all transform hover:scale-105">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  <CountUp 
                    end={stat.value} 
                    suffix={stat.suffix}
                    duration={2500}
                    className="text-4xl font-bold text-indigo-600"
                  />
                </div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Ramanuj Way: Our Nine Core Mandates Section */}
      <section ref={mandatesRef} className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            mandatesInView 
              ? 'animate-auto-show opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">The Ramanuj Way: Our Nine Core Mandates</h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto">
              These nine principles are more than just a list—they are the DNA of Ramanuj. They guide how we innovate, how we build, and how we succeed. We look for partners who are ready to embrace these mandates and help us build the future.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Customer is the Origin",
                description: "Every great solution starts and ends with the customer. We are not just building technology; we are building trust. Our mission is to create profoundly useful and demonstrably valuable products that solve real-world problems.",
                image: "/customer.jpg",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                title: "Insistence on Exceptional Quality",
                description: "For us, quality isn't a goal—it's the baseline. We are relentless in our pursuit of excellence, and every decision is driven by transparent, verifiable data. We minimize subjective judgment and focus on precision at the atomic level.",
                image: "/quality.jpg",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                title: "Innovation by Subtraction, then Addition",
                description: "Before we can build something new, we must first simplify. Our approach to innovation is to remove complexity first, then build with purpose. We meticulously break down problems into smaller components, ensuring that elegance and efficiency are woven into every step.",
                image: "/sub-add.png",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                title: "The Mandate of Frugality",
                description: "We believe that ingenuity isn't about unlimited resources; it's about making every resource count. Whether it's time, money, or computing power, we are committed to finding innovative ways to achieve breakthroughs with the lowest possible cost.",
                image: "/Frugality.jpg",
                gradient: "from-yellow-500 to-orange-500"
              },
              {
                title: "Decisive Call to Action",
                description: "In our fast-paced industry, inertia is a fatal flaw. We value velocity and empower our partners to make high-quality decisions autonomously, right where the problem exists. We believe in taking calculated risks and executing with speed.",
                image: "/Call-to-Action.jpg",
                gradient: "from-red-500 to-pink-500"
              },
              {
                title: "Laser Focus on Execution",
                description: "Once a brilliant idea has been defined and approved, our team transitions immediately into a state of undistracted, single-minded delivery. We move from open deliberation to focused implementation with a collective, laser-sharp concentration.",
                image: "/Laser-Focus.jpg",
                gradient: "from-indigo-500 to-blue-500"
              },
              {
                title: "Serve the Nano, Power the Macro",
                description: "Every contribution, no matter how small, must align with our company's ultimate mission. While we appreciate scientific pursuits, we focus all our intellectual capital on accelerating Ramanuj's core progress.",
                image: "/ecosystem.jpg",
                gradient: "from-teal-500 to-cyan-500"
              },
              {
                title: "Be a Collaborative Multiplier",
                description: "Our success is a shared outcome, driven by the best ideas regardless of their origin. Inspired by the work of Srinivasa Ramanujan, we believe that the joint output must always exceed the linear sum of individual efforts.",
                image: "/Collaborative.jpg",
                gradient: "from-violet-500 to-purple-500"
              },
              {
                title: "Zero-Cost Failure",
                description: "We view every experiment and setback not as a personal failure, but as a critical, non-negotiable data point. We place the highest value on the lessons gained from mistakes, using them to accelerate our progress.",
                image: "/Zero-Cost.jpg",
                gradient: "from-rose-500 to-pink-500"
              }
            ].map((mandate, idx) => (
              <div 
                key={idx} 
                className={`group relative h-80 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 overflow-hidden cursor-pointer ${
                  mandatesInView 
                    ? 'animate-auto-show opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  animationDelay: `${idx * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={mandate.image} 
                    alt={mandate.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                
                {/* Gradient Overlay - Always visible but subtle */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                {/* Rising Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-full group-hover:translate-y-0"></div>
                
                {/* Title - Moves from bottom to top on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 group-hover:bottom-auto group-hover:top-0 transition-all duration-500">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors duration-300">
                    {mandate.title}
                  </h3>
                </div>
                
                {/* Description - Only visible on hover, positioned at bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <p className="text-white leading-relaxed text-sm">
                    {mandate.description}
                  </p>
                </div>
                
                {/* Subtle border effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonials Section */}
      <section ref={testimonialsRef} className="py-20 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 ${
            testimonialsInView 
              ? 'animate-auto-show opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Trusted by Industry Leaders</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Global enterprises rely on our precision data solutions to power their most critical AI systems
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Ramanuj's data validation process is unmatched. Their zero-error guarantee gave us the confidence to deploy AI systems in mission-critical applications.",
                author: "S. Madhavan",
                role: "Founder",
                company: "Arctic Tern International",
                rating: 5
              },
              {
                quote: "The precision and reliability of their datasets transformed our embedded AI capabilities. We've seen 40% improvement in model accuracy.",
                author: "Sanjay V G",
                role: "Founder",
                company: "Sealark International",
                rating: 5
              },
              {
                quote: "Working with Ramanuj has been a game-changer. Their human-verified datasets eliminated the uncertainty that was holding back our AI initiatives.",
                author: "Janamuukesh",
                role: "CEO",
                company: "Mahee Solutions",
                rating: 5
              }
            ].map((testimonial, idx) => (
              <div 
                key={idx} 
                className={`bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-700 transform ${
                  testimonialsInView 
                    ? 'animate-auto-show opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  animationDelay: `${idx * 200}ms`,
                  animationFillMode: 'both'
                }}
                onAnimationEnd={() => {
                  // Add continuous floating animation after initial animation completes
                  if (testimonialsInView) {
                    const element = document.querySelector(`[data-testimonial="${idx}"]`) as HTMLElement;
                    if (element) {
                      element.classList.add('animate-continuous-float');
                    }
                  }
                }}
                data-testimonial={idx}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="border-t pt-4">
                  <div className="font-bold text-slate-900">{testimonial.author}</div>
                  <div className="text-indigo-600 font-semibold">{testimonial.role}</div>
                  <div className="text-slate-600">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Technical Capabilities Section with Blur Animation */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Advanced Technical Capabilities</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Cutting-edge technology and methodologies that ensure unmatched data precision
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "AI/ML Data Pipelines",
                description: "Custom-built pipelines optimized for machine learning workflows with real-time validation",
                technologies: ["TensorFlow", "PyTorch", "Apache Spark", "Kubernetes"],
                icon: <Cpu className="w-8 h-8" />,
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Edge Computing",
                description: "Specialized datasets for embedded systems and IoT applications with ultra-low latency",
                technologies: ["ARM Cortex", "RISC-V", "TensorRT", "ONNX Runtime"],
                icon: <Zap className="w-8 h-8" />,
                color: "from-yellow-500 to-orange-500"
              },
              {
                title: "Blockchain Verification",
                description: "Immutable data integrity verification using distributed ledger technology",
                technologies: ["Ethereum", "Hyperledger", "IPFS", "Zero-Knowledge Proofs"],
                icon: <Database className="w-8 h-8" />,
                color: "from-green-500 to-emerald-500"
              },
              {
                title: "Quantum-Safe Security",
                description: "Future-proof encryption and data protection against quantum computing threats",
                technologies: ["Post-Quantum Crypto", "Lattice-based", "Hash-based", "Code-based"],
                icon: <Shield className="w-8 h-8" />,
                color: "from-purple-500 to-pink-500"
              }
            ].map((expertise, idx) => (
              <div 
                key={idx} 
                className="tech-card-blur bg-white p-8 rounded-2xl shadow-lg transition-all duration-500 transform"
              >
                {/* Icon with gradient background */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${expertise.color} text-white mb-6`}>
                  {expertise.icon}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-4">{expertise.title}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">{expertise.description}</p>
                
                <div className="space-y-2">
                  {expertise.technologies.map((tech, tidx) => (
                    <div 
                      key={tidx} 
                      className={`inline-block px-3 py-1 bg-gradient-to-r ${expertise.color} text-white rounded-full text-sm font-medium mr-2 mb-2 transition-all duration-300 hover:scale-105`}
                    >
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Trusted by Global Leaders</h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              We power AI systems for Fortune 500 companies and innovative startups worldwide
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {[
              "Microsoft", "Google", "Amazon", "Tesla", "OpenAI", "NVIDIA",
              "Intel", "IBM", "Meta", "Apple", "Samsung", "Oracle"
            ].map((company, idx) => (
              <div key={idx} className="text-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                <div className="text-2xl font-bold text-slate-300">{company}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section id="industry-recognition" className="py-20 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Industry Recognition</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Our commitment to excellence has been recognized by leading industry organizations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                award: "Best AI Data Company 2024",
                organization: "AI Innovation Awards",
                description: "Recognized for breakthrough data validation methodologies"
              },
              {
                award: "Excellence in Quality",
                organization: "International Data Standards",
                description: "Zero-error data delivery across 1000+ projects"
              },
              {
                award: "Innovation Leader",
                organization: "TechCrunch Disrupt",
                description: "Pioneering human-AI collaboration in data verification"
              },
              {
                award: "Security Excellence",
                organization: "Cybersecurity Alliance",
                description: "Quantum-safe data protection implementation"
              }
            ].map((award, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center hover:bg-white/20 transition-all">
                <div className="text-3xl mb-4">🏆</div>
                <h3 className="text-xl font-bold mb-2">{award.award}</h3>
                <div className="text-indigo-200 font-semibold mb-3">{award.organization}</div>
                <p className="text-sm opacity-90">{award.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      
      {/* <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Success Stories</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Real-world impact of our precision data solutions across diverse industries
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                industry: "Autonomous Vehicles",
                client: "Leading EV Manufacturer",
                challenge: "Real-time object detection accuracy",
                solution: "Custom edge-optimized datasets",
                result: "99.7% accuracy improvement, 60% faster processing",
                color: "from-blue-500 to-cyan-500"
              },
              {
                industry: "Financial Services",
                client: "Global Investment Bank",
                challenge: "Fraud detection model reliability",
                solution: "Human-verified transaction datasets",
                result: "Zero false positives, $2M+ fraud prevented",
                color: "from-green-500 to-emerald-500"
              },
              {
                industry: "Healthcare AI",
                client: "Medical Imaging Company",
                challenge: "Diagnostic accuracy in radiology",
                solution: "Expert-validated medical image datasets",
                result: "95% diagnostic accuracy, FDA approval achieved",
                color: "from-purple-500 to-pink-500"
              }
            ].map((caseStudy, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${caseStudy.color}`}></div>
                <div className="p-8">
                  <div className="text-sm font-semibold text-indigo-600 mb-2">{caseStudy.industry}</div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{caseStudy.client}</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="font-semibold text-slate-700 mb-1">Challenge:</div>
                      <div className="text-slate-600 text-sm">{caseStudy.challenge}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-700 mb-1">Solution:</div>
                      <div className="text-slate-600 text-sm">{caseStudy.solution}</div>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-700 mb-1">Result:</div>
                      <div className="text-slate-600 text-sm">{caseStudy.result}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );

  // About page removed; content moved to Home section

  const renderServices = () => (
    <div className="min-h-screen pt-0 pb-20 px-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating orbs with enhanced animations */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float-background"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-float-background animate-delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-float-background animate-delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl animate-float-background animate-delay-3000"></div>
        <div className="absolute bottom-1/3 left-1/2 w-56 h-56 bg-gradient-to-r from-rose-400/15 to-pink-400/15 rounded-full blur-3xl animate-float-background animate-delay-4000"></div>
        
        {/* Enhanced floating particles with different sizes and animations */}
        <div className="absolute top-32 left-1/4 w-2 h-2 bg-indigo-400 rounded-full floating-particle animate-delay-100"></div>
        <div className="absolute top-64 right-1/3 w-3 h-3 bg-purple-400 rounded-full floating-particle animate-delay-300"></div>
        <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-blue-400 rounded-full floating-particle animate-delay-500"></div>
        <div className="absolute top-96 right-1/4 w-2 h-2 bg-pink-400 rounded-full floating-particle animate-delay-200"></div>
        <div className="absolute bottom-64 right-1/2 w-3 h-3 bg-cyan-400 rounded-full floating-particle animate-delay-400"></div>
        <div className="absolute top-1/3 left-1/6 w-1 h-1 bg-emerald-400 rounded-full floating-particle animate-delay-600"></div>
        <div className="absolute bottom-1/4 right-1/6 w-2 h-2 bg-rose-400 rounded-full floating-particle animate-delay-700"></div>
        <div className="absolute top-2/3 left-2/3 w-1 h-1 bg-amber-400 rounded-full floating-particle animate-delay-800"></div>
        
        {/* Animated geometric shapes */}
        <div className="absolute top-1/4 left-1/3 w-8 h-8 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rotate-45 animate-float-up-down animate-delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-6 h-6 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full animate-float-up-down animate-delay-2000"></div>
        <div className="absolute top-1/2 left-1/5 w-4 h-4 bg-gradient-to-r from-pink-500/30 to-rose-500/30 rotate-12 animate-float-up-down animate-delay-3000"></div>
        
        {/* Enhanced animated grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, #6366f1 2px, transparent 0)`,
            backgroundSize: '50px 50px',
            animation: 'floatParticle 8s ease-in-out infinite'
          }}></div>
        </div>
        
        {/* Additional grid pattern with different timing */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 40px 40px, #8b5cf6 1px, transparent 0)`,
            backgroundSize: '80px 80px',
            animation: 'floatParticle 12s ease-in-out infinite reverse'
          }}></div>
        </div>
        
        {/* Animated lines and connections */}
        <div className="absolute top-1/3 left-1/4 w-32 h-0.5 bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-0.5 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-pulse animate-delay-1000"></div>
        <div className="absolute top-2/3 left-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse animate-delay-2000"></div>
        
        {/* Floating data visualization elements */}
        <div className="absolute top-1/5 right-1/5 w-16 h-16 border border-indigo-400/30 rounded-lg animate-float-up-down animate-delay-1500">
          <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg animate-pulse"></div>
        </div>
        <div className="absolute bottom-1/5 left-1/5 w-12 h-12 border border-cyan-400/30 rounded-lg animate-float-up-down animate-delay-2500">
          <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg animate-pulse"></div>
        </div>
        
        {/* Animated circuit-like patterns */}
        <div className="absolute top-1/6 right-1/3 w-20 h-20 opacity-20">
          <div className="w-full h-full border-2 border-indigo-400/40 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-8 h-8 border-2 border-purple-400/40 rounded-full animate-spin" style={{animationDuration: '15s', animationDirection: 'reverse'}}></div>
        </div>
        
        <div className="absolute bottom-1/6 left-1/3 w-16 h-16 opacity-20">
          <div className="w-full h-full border-2 border-cyan-400/40 rounded-full animate-spin" style={{animationDuration: '25s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-6 h-6 border-2 border-blue-400/40 rounded-full animate-spin" style={{animationDuration: '18s', animationDirection: 'reverse'}}></div>
        </div>
      </div>

      {/* Hero Section - same structure as Careers hero */}
      <section className="relative min-h-[90vh] pt-24 md:pt-32 pb-40 pl-60 overflow-hidden flex items-end mb-16 md:mb-24 mt-16 md:mt-10">
        <div className="absolute inset-0 z-0">
          <img
            src={servicesHeroSrc}
            alt="Services"
            className={`hero-cover-img ${servicesHeroLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
            loading="eager"
            onLoad={() => setServicesHeroLoaded(true)}
            onError={() => {
              setServicesHeroLoaded(false);
              setServicesHeroSrc((prev) => prev === '/services.jpg' ? '/photos/services.jpg' : '/e98c975ef14d95ee449fda24d8dd3a7a.jpg');
            }}
          />
          {!servicesHeroLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-500" />
          )}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="max-w-7xl text-left text-white relative z-10">
          <h2 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <RollingWordAnimation 
              words={[
                "Our",
                "Services"
              ]}
              delay={0.3}
              wordDelay={0.7}
              charSpeed={0.1}
            />
          </h2>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <RollingWordAnimation 
              words={[
                
                { text: "Delivered", style: { color: "#4f46e5" } },
                
              ]}
              delay={1.8}
              wordDelay={1}
              charSpeed={0.1}
            />
          </h1>
          <p className="text-lg lg:text-xl text-slate-100/90 max-w-3xl mb-6">
            Precision data solutions powering the world’s most advanced AI systems.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setCurrentPage('contact')}
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 flex items-center gap-2 shadow-lg">
              Get Started <ArrowRight size={20 as number} />
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Service Process Overview */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Our Proven Process</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From initial consultation to final delivery, we ensure every step meets our uncompromising standards
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery & Analysis', desc: 'Deep dive into your requirements and data challenges', icon: '🔍' },
              { step: '02', title: 'Strategy & Planning', desc: 'Custom solution design tailored to your specific needs', icon: '📋' },
              { step: '03', title: 'Implementation', desc: 'Expert execution with continuous quality monitoring', icon: '⚙️' },
              { step: '04', title: 'Delivery & Support', desc: 'Ongoing maintenance and optimization services', icon: '🚀' }
            ].map((process, idx) => (
              <div key={idx} className="text-center process-step">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-2xl mx-auto animate-gradient-flow">
                    {process.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-indigo-600 shadow-lg">
                    {process.step}
                  </div>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{process.title}</h4>
                <p className="text-slate-600">{process.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Splide Services Carousel */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Our Services</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Discover our comprehensive range of precision data solutions
            </p>
          </div>
          
          {/* Splide Carousel */}
          <div className="splide">
            <div className="splide__track">
              <ul className="splide__list">
                {[
                  { 
                    title: 'Data Validation & Quality Assurance', 
                    desc: 'Human-verified datasets with zero-error guarantee for AI training and deployment.',
                    features: ['Manual verification by domain experts', 'Multi-layer quality assurance', 'Continuous monitoring & validation'],
                    gradient: 'from-blue-500 to-cyan-500',
                      image: '/quality-assurance-iso-din-service-guarantee-standard-retail-concept-photo.jpg',
                    industries: ['Healthcare', 'Finance', 'Autonomous Vehicles'],
                    benefits: ['99.9% accuracy rate', 'Zero false positives', 'Enhanced AI reliability']
                  },
                  { 
                    title: 'AI Data Engineering & Pipelines', 
                    desc: 'Custom data pipelines designed for precision and scalability in embedded systems.',
                    features: ['Custom pipeline architecture', 'Real-time data processing', 'Edge computing optimization'],
                    gradient: 'from-purple-500 to-pink-500',
                      image: '/2212d129fa7839fd210452cdc0093e41.jpg',
                    industries: ['IoT', 'Edge Computing', 'Real-time Analytics'],
                    benefits: ['60% faster processing', 'Reduced latency', 'Improved scalability']
                  },
                  { 
                    title: 'Quality Assurance & Testing', 
                    desc: 'End-to-end quality control ensuring every data point meets the highest standards.',
                    features: ['Automated testing frameworks', 'Manual review processes', 'Compliance verification'],
                    gradient: 'from-green-500 to-emerald-500',
                      image: '/Testing.png',
                    industries: ['Banking', 'Insurance', 'Government'],
                    benefits: ['100% compliance rate', 'Zero data breaches', 'Reduced risk exposure']
                  },
                  { 
                    title: 'Strategic AI Consultation', 
                    desc: 'Strategic guidance on building trustworthy AI systems from the ground up.',
                    features: ['AI strategy development', 'Architecture design', 'Best practices implementation'],
                    gradient: 'from-yellow-500 to-orange-500',
                      image: '/Strategic-AI-Consultation.png',
                    industries: ['Enterprise', 'Startups', 'Government'],
                    benefits: ['Faster time to market', 'Reduced implementation risk', 'Competitive advantage']
                  },
                  { 
                    title: 'Embedded AI Solutions', 
                    desc: 'Specialized datasets for edge computing and embedded intelligence applications.',
                    features: ['IoT data optimization', 'Low-latency processing', 'Resource-efficient algorithms'],
                    gradient: 'from-indigo-500 to-blue-500',
                      image: '/Embedded-AI.png',
                    industries: ['Manufacturing', 'Agriculture', 'Energy'],
                    benefits: ['50% reduction in power consumption', 'Real-time decision making', 'Offline capability']
                  },
                  { 
                    title: 'Custom Data Projects', 
                    desc: 'Tailored data solutions for unique industry requirements and use cases.',
                    features: ['Industry-specific expertise', 'Flexible project scope', 'Dedicated project teams'],
                    gradient: 'from-red-500 to-pink-500',
                      image: '/project.png',
                    industries: ['Research', 'Space', 'Biotech'],
                    benefits: ['Custom solutions', 'Expert domain knowledge', 'Innovation focus']
                  }
                ].map((service, idx) => (
                  <li key={idx} className="splide__slide">
                    <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border border-white/20 overflow-hidden service-card h-full"
                    >
                      {/* Service Image */}
                      <div className="relative h-48 overflow-hidden rounded-t-3xl">
                        {/* Fallback gradient background - only shown if image fails to load */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} flex items-center justify-center`}>
                          <div className="text-white text-4xl font-bold opacity-80">
                            {service.title.charAt(0)}
                          </div>
                        </div>
                        
                        {/* Service image with proper loading and error handling */}
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className={`service-image absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ${
                            imagesLoaded ? 'opacity-100' : 'opacity-0'
                          }`}
                          loading="eager"
                          onLoad={(e) => {
                            // Hide fallback when image loads successfully
                            const target = e.target as HTMLImageElement;
                            const fallback = target.parentElement?.querySelector('.absolute.inset-0.bg-gradient-to-br') as HTMLElement;
                            if (fallback) {
                              fallback.style.display = 'none';
                            }
                            target.style.opacity = '1';
                          }}
                          onError={(e) => {
                            // Show fallback when image fails to load
                            const target = e.target as HTMLImageElement;
                            const fallback = target.parentElement?.querySelector('.absolute.inset-0.bg-gradient-to-br') as HTMLElement;
                            if (fallback) {
                              fallback.style.display = 'flex';
                            }
                            target.style.display = 'none';
                          }}
                        />
                        
                        {/* Overlay gradient on hover */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none`}></div>
                      </div>

                      {/* Content */}
                      <div className="p-6 relative z-10">
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                          {service.title}
                        </h3>
                        <p className="text-slate-600 mb-4 leading-relaxed group-hover:text-slate-700 transition-colors duration-300 text-sm">
                          {service.desc}
                        </p>
                        
                        {/* Features List */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-slate-900 mb-2 text-sm">Key Features:</h4>
                          <ul className="space-y-1">
                            {service.features.slice(0, 2).map((feature, fidx) => (
                              <li 
                                key={fidx} 
                                className="flex items-center gap-2 text-slate-700 group-hover:text-slate-800 transition-colors duration-300"
                              >
                                <div className={`w-4 h-4 bg-gradient-to-r ${service.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                                  <CheckCircle size={10} className="text-white" />
                                </div>
                                <span className="text-xs font-medium">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Industries */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-slate-900 mb-2 text-sm">Industries:</h4>
                          <div className="flex flex-wrap gap-1">
                            {service.industries.slice(0, 2).map((industry, iidx) => (
                              <span 
                                key={iidx}
                                className={`px-2 py-1 bg-gradient-to-r ${service.gradient} text-white text-xs rounded-full font-medium`}
                              >
                                {industry}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Benefits */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-slate-900 mb-2 text-sm">Key Benefits:</h4>
                          <ul className="space-y-1">
                            {service.benefits.slice(0, 2).map((benefit, bidx) => (
                              <li key={bidx} className="text-xs text-slate-600 flex items-center gap-2">
                                <div className="w-1 h-1 bg-indigo-500 rounded-full flex-shrink-0"></div>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Hover Effect Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
                      
                      {/* Animated Border */}
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-[2px]`}>
                        <div className="w-full h-full bg-white rounded-3xl"></div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        

        {/* Enhanced Call to Action Section */}
        <div className="text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5"></div>
            <div className="relative z-10">
              <h3 className="text-4xl font-bold text-slate-900 mb-6">
                Ready to Transform Your Data?
              </h3>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Let's discuss how our precision data solutions can accelerate your AI initiatives and drive breakthrough innovations
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setCurrentPage('contact')}
                  className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-button-pulse"
                >
                  Get Started Today
                </button>
                <button className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-2xl border-2 border-indigo-600 hover:bg-indigo-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  Schedule Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  // Job Application modal state and handlers
  const [applyOpen, setApplyOpen] = useState<boolean>(false);
  const [applyJobId, setApplyJobId] = useState<number | null>(null);
  const [applyName, setApplyName] = useState<string>('');
  const [applyEmail, setApplyEmail] = useState<string>('');
  const [applyPhone, setApplyPhone] = useState<string>('');
  const [applyResumeFile, setApplyResumeFile] = useState<File | null>(null);
  const [applyCoverLetter, setApplyCoverLetter] = useState<string>('');
  const [applySubmitting, setApplySubmitting] = useState<boolean>(false);
  const [applyStatus, setApplyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const openApply = (jobIdGuess: number) => {
    setApplyJobId(jobIdGuess);
    setApplyOpen(true);
    setApplyStatus('idle');
  };

  const submitApplication = async () => {
    if (applySubmitting) return;
    if (!applyJobId || !applyName.trim() || !applyEmail.trim() || !applyPhone.trim()) {
      setApplyStatus('error');
      return;
    }
    // Basic phone validation: 7-15 digits
    const phoneDigits = applyPhone.replace(/\D/g, '');
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      setApplyStatus('error');
      return;
    }
    // Resume is optional, but if provided must be PDF
    if (applyResumeFile && applyResumeFile.type !== 'application/pdf') {
      setApplyStatus('error');
      return;
    }
    setApplySubmitting(true);
    setApplyStatus('idle');
    try {
      const form = new FormData();
      form.append('jobId', String(applyJobId));
      form.append('name', applyName);
      form.append('email', applyEmail);
      form.append('phone', applyPhone);
      form.append('coverLetter', applyCoverLetter);
      if (applyResumeFile) {
        form.append('resume', applyResumeFile);
      }
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8080';
      const res = await fetch(`${API_BASE_URL}/api/applications`, { method: 'POST', body: form });
      if (!res.ok) throw new Error('Failed');
      setApplyStatus('success');
      setApplyName('');
      setApplyEmail('');
      setApplyPhone('');
      setApplyResumeFile(null);
      setApplyCoverLetter('');
      setApplyOpen(false);
    } catch {
      setApplyStatus('error');
    } finally {
      setApplySubmitting(false);
    }
  };

  const renderCareers = () => (
    <div className="min-h-screen bg-white">
      {/* Hero with background image */}
      <section className="relative min-h-[70vh] pl-60 pt-40 pb-20 px-6 overflow-hidden flex items-end mb-16 md:mb-0 mt-16 md:mt-16">
        <div className="absolute inset-0 z-0">
          {/* Progressive image with fallbacks */}
          <img
            src={heroSrc}
            alt="Team work at Ramanuj"
            className={`w-full h-full object-cover ${heroLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
            loading="eager"
            onLoad={() => setHeroLoaded(true)}
            onError={() => {
              setHeroLoaded(false);
              setHeroSrc((prev) => prev === '/team-work.jpg' ? '/photos/team-work.jpg' : '/e98c975ef14d95ee449fda24d8dd3a7a.jpg');
            }}
          />
          {/* Loading/Fallback gradient */}
          {!heroLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-500" />
          )}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="max-w-7xl text-left text-white relative z-10">
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <RollingWordAnimation 
              words={[
                { text: "Build", style: { color: "#4f46e5" } },
                
                { text: "With", style: { color: "#4f46e5" } },
                // "Pioneers"
                
              ]}
              delay={0.3}
              wordDelay={0.7}
              charSpeed={0.1}
            />
          </h1>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
            <RollingWordAnimation 
              words={[
                
                "Pioneers"
                
              ]}
              delay={1.8}
              wordDelay={1}
              charSpeed={0.1}
            />
          </h1>
          <p className="text-lg lg:text-xl text-slate-100/90 max-w-3xl mb-6">
            Join a high-performing culture that prizes ownership, ingenuity, and relentless focus on customer outcomes.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setCurrentPage('contact')}
              className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-slate-50 transition-all border-2 border-white/60">
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      {/* Qualities cards with advanced animation transitions */}
      <section className="py-20 px-0 md:px-6 bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900 text-center mb-10">Qualities of a Pioneer</h2>
        </div>
        {/* Splide carousel for qualities */}
        <div className="careers-splide splide">
          <div className="splide__track">
            <ul className="splide__list">
              {[
              {
                title: "Centering on Customer’s Need",
                text: "A deep, personal responsibility for the client's success must be maintained. This quality requires actions that actively protect and enhance the company's brand value, ensuring that all interactions reflect unwavering reliability and integrity, which ultimately builds external trust.",
                icon: <Users className="w-7 h-7" />,
              },
              {
                title: "Frugal Ingenuity",
                text: "A deep-seated commitment to maximizing output with minimal resources must be evident in every decision. Treat constraint as a catalyst for creative problem‑solving and technical innovation.",
                icon: <Lightbulb className="w-7 h-7" />,
              },
              {
                title: "Drive for Self-Directed Ownership",
                text: "Operate with the freedom and responsibility of a founder—take complete ownership, make autonomous decisions, and take calculated, informed risks to achieve breakthroughs.",
                icon: <Award className="w-7 h-7" />,
              },
              {
                title: "Focusing on Direction and Purpose",
                text: "Maintain a bird’s eye view to align daily execution with the company’s long‑term vision. Translate ambitious goals into clear, actionable steps for today.",
                icon: <Target className="w-7 h-7" />,
              },
              {
                title: "Emphasizing on Data as the Prerequisite",
                text: "Decisions are grounded in verifiable, objective data—not intuition. This Ground Truth mandate ensures the highest standard of quality and precision across deliverables.",
                icon: <Database className="w-7 h-7" />,
              },
              {
                title: "Attention to Continuous Learning and Sharing",
                text: "Keep pace with rapidly evolving technology and actively share knowledge through mentorship and upskilling to multiply team intelligence.",
                icon: <TrendingUp className="w-7 h-7" />,
              },
              {
                title: "High Velocity of Adaptation to Change",
                text: "Exhibit agility and calm under uncertainty. Treat unexpected changes as catalysts for innovation and pivot quickly based on new learnings.",
                icon: <Zap className="w-7 h-7" />,
              },
              {
                title: "Collaborative Leadership for Shared Success",
                text: "Seek and provide help proactively. Form ad‑hoc groups to remove constraints and put the success of the collective idea above individual recognition.",
                icon: <Users className="w-7 h-7" />,
              },
              {
                title: "Discipline of Simplicity",
                text: "Break down complex, ambiguous problems into clear, manageable execution steps to achieve elegant design and efficient delivery.",
                icon: <CheckCircle className="w-7 h-7" />,
              },
              ].map((q, i) => (
                <li key={i} className="splide__slide">
                  <div className="h-full px-2">
                    <div
                      className="relative bg-white rounded-2xl p-6 md:p-8 shadow-lg transition-all animate-card-glow h-full"
                      style={{ animationDelay: `${(i % 9) * 80}ms`, animationFillMode: 'both' }}
                    >
                      {/* Hover border effect removed */}
                      <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white mb-4 service-icon">
                          {q.icon}
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 animate-text-shimmer">{q.title}</h3>
                        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                          {q.text}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Open roles (existing list) */}
      <section ref={openRolesRef} className="py-16 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-12 transition-all duration-700 ${openRolesInView ? 'animate-auto-show opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}> 
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Open Roles</h3>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">If you resonate with these qualities, explore our current openings.</p>
          </div>
          <div className="space-y-8">
            {jobListings.map((job, idx) => (
              <div
                key={idx}
                className={`bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all overflow-hidden ${openRolesInView ? 'animate-auto-show opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ animationDelay: `${idx * 120}ms`, animationFillMode: 'both' }}
              >
                <div className="p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                      <h4 className="text-2xl font-bold text-slate-900 mb-3">{job.title}</h4>
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
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all flex items-center gap-2" onClick={() => openApply((job as any).id ?? (idx + 1))}>
                      Apply Now <ChevronRight size={18 as number} />
                    </button>
                  </div>
                  <p className="text-slate-700 mb-4">{job.description}</p>
                  <div>
                    <h5 className="font-semibold text-slate-900 mb-2">Requirements</h5>
                    <ul className="space-y-2">
                      {job.requirements.map((req, ridx) => (
                        <li key={ridx} className="flex items-start gap-3 text-slate-600">
                          <CheckCircle size={18} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {applyOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Apply for this role</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Full Name</label>
                <input type="text" value={applyName} onChange={(e) => setApplyName(e.target.value)} className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Email</label>
                <input type="email" value={applyEmail} onChange={(e) => setApplyEmail(e.target.value)} className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Phone Number</label>
                <input type="tel" value={applyPhone} onChange={(e) => setApplyPhone(e.target.value)} placeholder="e.g. +1 555 123 4567" className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none" />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Resume (PDF only)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setApplyResumeFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                  className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none"
                />
                <p className="text-xs text-slate-500 mt-1">Attach your resume as a PDF file.</p>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Cover Letter</label>
                <textarea rows={4} value={applyCoverLetter} onChange={(e) => setApplyCoverLetter(e.target.value)} className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none" />
              </div>
              {applyStatus === 'error' && (
                <div className="text-red-600 text-sm">Please fill required fields or try again.</div>
              )}
              <div className="flex gap-3 justify-end pt-2">
                <button onClick={() => setApplyOpen(false)} className="px-5 py-3 rounded-lg border-2 border-slate-200 text-slate-700 hover:bg-slate-50">Cancel</button>
                <button onClick={submitApplication} disabled={applySubmitting} className={`px-5 py-3 rounded-lg ${applySubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>{applySubmitting ? 'Submitting...' : 'Submit Application'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5" />
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4">Don't see the right role?</h3>
              <p className="text-lg opacity-90 mb-6">We’re always looking for exceptional talent. Share your profile and we’ll reach out.</p>
              <button 
                onClick={() => setCurrentPage('contact')}
                className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-slate-100 transition-all transform hover:scale-105">
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  const renderContact = () => (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-auto-show">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">Let's Build Together</h2>
          <p className="text-xl text-slate-600">
            Ready to power your AI systems with zero-error data? Let's start the conversation.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-10 animate-auto-show" style={{animationDelay: '150ms', animationFillMode: 'both'}}>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-700 font-semibold mb-2">First Name</label>
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => handleFormChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-all transform focus:scale-[1.01]" 
                />
                {formErrors.firstName && (
                  <div className="text-red-600 text-sm mt-1">{formErrors.firstName}</div>
                )}
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Last Name</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => handleFormChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-all transform focus:scale-[1.01]" 
                />
                {formErrors.lastName && (
                  <div className="text-red-600 text-sm mt-1">{formErrors.lastName}</div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-slate-700 font-semibold mb-2">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-all transform focus:scale-[1.01]" 
              />
              {formErrors.email && (
                <div className="text-red-600 text-sm mt-1">{formErrors.email}</div>
              )}
            </div>
            
            <div>
              <label className="block text-slate-700 font-semibold mb-2">Company</label>
              <input 
                type="text" 
                value={formData.company}
                onChange={(e) => handleFormChange('company', e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-all transform focus:scale-[1.01]" 
              />
            </div>
            
            <div>
              <label className="block text-slate-700 font-semibold mb-2">Message</label>
              <textarea 
                rows={5} 
                value={formData.message}
                onChange={(e) => handleFormChange('message', e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-none transition-all transform focus:scale-[1.01]"
              ></textarea>
              {formErrors.message && (
                <div className="text-red-600 text-sm mt-1">{formErrors.message}</div>
              )}
            </div>
            
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full px-8 py-4 rounded-lg font-semibold transition-all transform flex items-center justify-center gap-2 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 animate-button-pulse'}`}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {submitStatus === 'success' && (
              <div className="mt-2 text-green-700 text-sm">Thanks! Your message has been submitted.</div>
            )}
            {submitStatus === 'error' && (
              <div className="mt-2 text-red-700 text-sm">Something went wrong. Please try again.</div>
            )}
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
                {(['Services', 'Careers'] as const).map((item) => (
                  <button key={item} onClick={() => setCurrentPage(item.toLowerCase() as PageId)} className="block text-slate-400 hover:text-white transition-all">
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

