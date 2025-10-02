import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { HelpPage } from '@/pages/Help';

type PageState = 'home' | 'help';

const AIMotLanding = () => {
  const [currentPage, setCurrentPage] = useState<PageState>('home');
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    date: '',
    location: '',
    guests: ''
  });

  const steps = ['Details', 'Date and location', 'Guests'];

  // Update URL when page changes
  useEffect(() => {
    const path = currentPage === 'help' ? '/help' : '/';
    window.history.pushState(null, '', path);
  }, [currentPage]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(window.location.pathname === '/help' ? 'help' : 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log('Form submitted:', formData);
      alert('Thank you! Your booking request has been received. We will contact you shortly.');
      setFormData({
        title: '',
        category: '',
        description: '',
        date: '',
        location: '',
        guests: ''
      });
      setCurrentStep(0);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      date: '',
      location: '',
      guests: ''
    });
    setCurrentStep(0);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter event title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Initial Consultation</SelectItem>
                  <SelectItem value="audit">Business Audit</SelectItem>
                  <SelectItem value="implementation">AI Implementation</SelectItem>
                  <SelectItem value="training">Team Training</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Tell us about your needs"
                className="mt-1 min-h-[120px]"
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Preferred Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="City or Remote"
                className="mt-1"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="guests">Number of Participants</Label>
              <Input
                id="guests"
                type="number"
                value={formData.guests}
                onChange={(e) => handleInputChange('guests', e.target.value)}
                placeholder="How many people will attend?"
                className="mt-1"
                min="1"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Show Help page if on help route
  if (currentPage === 'help') {
    return <HelpPage onNavigateHome={() => setCurrentPage('home')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      {/* Header */}
      <header className="bg-transparent border-b border-blue-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">AI MOT</h1>
          <nav className="flex gap-6">
            <a href="/about" className="text-slate-700 hover:text-blue-600 transition">about</a>
            <a href="/contact" className="text-slate-700 hover:text-blue-600 transition">contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          {/* Text Content - Left Side */}
          <div className="w-full md:flex-1 md:min-w-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-slate-900">
              DIAGNOSE POTENTIAL AND DRIVE EFFICIENCY
            </h2>
            <p className="text-slate-700 leading-relaxed text-base md:text-lg">
              we deliver a tactical blueprint for maximizing your profitability.
              our a.i. mot service provides a deep-dive audit of your entire
              business operation, pinpointing the exact processes, systems
              and costs where automation and intelligence will yield the
              greatest returns. you'll receive a one hour 1-1 video call with a
              prioritized, step-by-step roadmap that cuts through the noise
              and shows you which specific a.i. tools to implement, where to
              deploy them, and a clear timeline for immediate results.
            </p>
          </div>

          {/* Gear Image - Right Side */}
          <div className="flex-shrink-0 w-full sm:w-auto flex justify-center">
            <div className="relative bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden w-3/4 max-w-xs sm:w-80 sm:h-80 aspect-square flex items-center justify-center">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-pink-300 rounded-full blur-2xl opacity-60"></div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-300 rounded-full blur-2xl opacity-60"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full blur-3xl opacity-20"></div>
              <svg viewBox="0 0 400 400" className="w-full h-full relative z-10">
                {/* Decorative motion lines */}
                <g opacity="0.4">
                  <line x1="30" y1="80" x2="50" y2="70" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="35" y1="90" x2="55" y2="85" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="360" y1="100" x2="380" y2="95" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="365" y1="110" x2="385" y2="108" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="50" y1="340" x2="70" y2="350" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="340" y1="320" x2="360" y2="330" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </g>

                {/* Large center gear */}
                <g transform="translate(200, 220)">
                  <circle cx="0" cy="0" r="75" fill="rgba(255,255,255,0.15)" stroke="#fff" strokeWidth="3"/>
                  <circle cx="0" cy="0" r="62" fill="none" stroke="#fff" strokeWidth="3"/>
                  <circle cx="0" cy="0" r="25" fill="rgba(255,255,255,0.2)" stroke="#fff" strokeWidth="3"/>
                  <circle cx="0" cy="0" r="12" fill="rgba(255,255,255,0.3)" stroke="#fff" strokeWidth="2.5"/>
                  {[...Array(16)].map((_, i) => {
                    const angle = (i * 22.5 * Math.PI) / 180;
                    const x1 = Math.cos(angle) * 55;
                    const y1 = Math.sin(angle) * 55;
                    const x2 = Math.cos(angle) * 80;
                    const y2 = Math.sin(angle) * 80;
                    return (
                      <g key={i}>
                        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="3"/>
                        <rect
                          x={x2 - 6}
                          y={y2 - 8}
                          width="12"
                          height="16"
                          fill="rgba(255,255,255,0.2)"
                          stroke="#fff"
                          strokeWidth="2.5"
                          rx="2"
                          transform={`rotate(${i * 22.5}, ${x2}, ${y2})`}
                        />
                      </g>
                    );
                  })}
                  {/* Inner spokes */}
                  {[...Array(6)].map((_, i) => {
                    const angle = (i * 60 * Math.PI) / 180;
                    const x = Math.cos(angle) * 20;
                    const y = Math.sin(angle) * 20;
                    return <line key={i} x1="0" y1="0" x2={x} y2={y} stroke="#fff" strokeWidth="2.5"/>;
                  })}
                </g>

                {/* Top left small gear */}
                <g transform="translate(100, 100)">
                  <circle cx="0" cy="0" r="35" fill="rgba(255,255,255,0.15)" stroke="#fff" strokeWidth="2.5"/>
                  <circle cx="0" cy="0" r="28" fill="none" stroke="#fff" strokeWidth="2.5"/>
                  <circle cx="0" cy="0" r="12" fill="rgba(255,255,255,0.25)" stroke="#fff" strokeWidth="2"/>
                  {[...Array(12)].map((_, i) => {
                    const angle = (i * 30 * Math.PI) / 180;
                    const x1 = Math.cos(angle) * 25;
                    const y1 = Math.sin(angle) * 25;
                    const x2 = Math.cos(angle) * 38;
                    const y2 = Math.sin(angle) * 38;
                    return (
                      <g key={i}>
                        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="2.5"/>
                        <rect
                          x={x2 - 4}
                          y={y2 - 5}
                          width="8"
                          height="10"
                          fill="rgba(255,255,255,0.2)"
                          stroke="#fff"
                          strokeWidth="2"
                          rx="1"
                          transform={`rotate(${i * 30}, ${x2}, ${y2})`}
                        />
                      </g>
                    );
                  })}
                </g>

                {/* Top right medium gear */}
                <g transform="translate(310, 120)">
                  <circle cx="0" cy="0" r="45" fill="rgba(255,255,255,0.15)" stroke="#fff" strokeWidth="2.5"/>
                  <circle cx="0" cy="0" r="35" fill="none" stroke="#fff" strokeWidth="2.5"/>
                  <circle cx="0" cy="0" r="15" fill="rgba(255,255,255,0.25)" stroke="#fff" strokeWidth="2.5"/>
                  <circle cx="0" cy="0" r="8" fill="rgba(255,255,255,0.3)" stroke="#fff" strokeWidth="2"/>
                  {[...Array(14)].map((_, i) => {
                    const angle = (i * 25.7 * Math.PI) / 180;
                    const x1 = Math.cos(angle) * 32;
                    const y1 = Math.sin(angle) * 32;
                    const x2 = Math.cos(angle) * 48;
                    const y2 = Math.sin(angle) * 48;
                    return (
                      <g key={i}>
                        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="2.5"/>
                        <rect
                          x={x2 - 5}
                          y={y2 - 6}
                          width="10"
                          height="12"
                          fill="rgba(255,255,255,0.2)"
                          stroke="#fff"
                          strokeWidth="2"
                          rx="1.5"
                          transform={`rotate(${i * 25.7}, ${x2}, ${y2})`}
                        />
                      </g>
                    );
                  })}
                  {/* Cross hatch detail */}
                  {[...Array(4)].map((_, i) => {
                    const angle = (i * 90 * Math.PI) / 180;
                    const x = Math.cos(angle) * 12;
                    const y = Math.sin(angle) * 12;
                    return <line key={i} x1="0" y1="0" x2={x} y2={y} stroke="#fff" strokeWidth="2"/>;
                  })}
                </g>

                {/* Bottom left gear */}
                <g transform="translate(90, 280)">
                  <circle cx="0" cy="0" r="40" fill="rgba(255,255,255,0.15)" stroke="#fff" strokeWidth="2.5"/>
                  <circle cx="0" cy="0" r="32" fill="none" stroke="#fff" strokeWidth="2.5"/>
                  <circle cx="0" cy="0" r="14" fill="rgba(255,255,255,0.25)" stroke="#fff" strokeWidth="2.5"/>
                  {[...Array(13)].map((_, i) => {
                    const angle = (i * 27.7 * Math.PI) / 180;
                    const x1 = Math.cos(angle) * 29;
                    const y1 = Math.sin(angle) * 29;
                    const x2 = Math.cos(angle) * 43;
                    const y2 = Math.sin(angle) * 43;
                    return (
                      <g key={i}>
                        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="2.5"/>
                        <rect
                          x={x2 - 4.5}
                          y={y2 - 6}
                          width="9"
                          height="12"
                          fill="rgba(255,255,255,0.2)"
                          stroke="#fff"
                          strokeWidth="2"
                          rx="1.5"
                          transform={`rotate(${i * 27.7}, ${x2}, ${y2})`}
                        />
                      </g>
                    );
                  })}
                </g>

                {/* Bottom right small gear */}
                <g transform="translate(330, 300)">
                  <circle cx="0" cy="0" r="32" fill="rgba(255,255,255,0.15)" stroke="#fff" strokeWidth="2.5"/>
                  <circle cx="0" cy="0" r="25" fill="none" stroke="#fff" strokeWidth="2.5"/>
                  <circle cx="0" cy="0" r="10" fill="rgba(255,255,255,0.3)" stroke="#fff" strokeWidth="2"/>
                  {[...Array(10)].map((_, i) => {
                    const angle = (i * 36 * Math.PI) / 180;
                    const x1 = Math.cos(angle) * 22;
                    const y1 = Math.sin(angle) * 22;
                    const x2 = Math.cos(angle) * 35;
                    const y2 = Math.sin(angle) * 35;
                    return (
                      <g key={i}>
                        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="2.5"/>
                        <rect
                          x={x2 - 4}
                          y={y2 - 5}
                          width="8"
                          height="10"
                          fill="rgba(255,255,255,0.2)"
                          stroke="#fff"
                          strokeWidth="2"
                          rx="1"
                          transform={`rotate(${i * 36}, ${x2}, ${y2})`}
                        />
                      </g>
                    );
                  })}
                </g>

                {/* Tiny top gear */}
                <g transform="translate(240, 80)">
                  <circle cx="0" cy="0" r="22" fill="rgba(255,255,255,0.15)" stroke="#fff" strokeWidth="2"/>
                  <circle cx="0" cy="0" r="17" fill="none" stroke="#fff" strokeWidth="2"/>
                  <circle cx="0" cy="0" r="8" fill="rgba(255,255,255,0.3)" stroke="#fff" strokeWidth="2"/>
                  {[...Array(8)].map((_, i) => {
                    const angle = (i * 45 * Math.PI) / 180;
                    const x1 = Math.cos(angle) * 15;
                    const y1 = Math.sin(angle) * 15;
                    const x2 = Math.cos(angle) * 24;
                    const y2 = Math.sin(angle) * 24;
                    return (
                      <g key={i}>
                        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="2"/>
                        <rect
                          x={x2 - 3}
                          y={y2 - 4}
                          width="6"
                          height="8"
                          fill="rgba(255,255,255,0.2)"
                          stroke="#fff"
                          strokeWidth="1.5"
                          rx="1"
                          transform={`rotate(${i * 45}, ${x2}, ${y2})`}
                        />
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-pink-300 rounded-full blur-3xl opacity-30"></div>

        <div className="text-center mb-8 relative z-10">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">
            Get the tactical blueprint for your business without the guesswork - fill out the form below to book your call
          </h3>
        </div>

        <div className="max-w-2xl mx-auto relative z-10">
          <Card className="border-2 border-blue-300 shadow-2xl bg-white/80 backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-gradient-to-br from-blue-400 to-purple-400 p-1.5 rounded">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/>
                  </svg>
                </div>
                <span className="font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">InsideBox</span>
              </div>
              <CardTitle className="text-2xl text-slate-900">What's your event about?</CardTitle>
              <CardDescription className="text-slate-600">Please enter your details</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step indicator */}
              <div className="flex gap-2 mb-6 border-b">
                {steps.map((step, index) => (
                  <button
                    key={step}
                    onClick={() => setCurrentStep(index)}
                    className={`pb-2 px-4 transition-all ${
                      index === currentStep
                        ? 'border-b-2 border-blue-500 text-blue-500 font-medium'
                        : 'text-slate-500 hover:text-slate-700 hover:border-b-2 hover:border-slate-300'
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>

              {/* Form content */}
              {renderStepContent()}

              {/* Action buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={handleCancel} className="hover:bg-slate-50">
                  Cancel
                </Button>
                <Button onClick={handleNext} className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all">
                  {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t-2 border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-600 text-sm">
              © 2025 AI MOT. All rights reserved.
            </div>
            <nav className="flex gap-6">
              <a href="/about" className="text-slate-600 hover:text-blue-600 transition text-sm">
                About
              </a>
              <a href="/contact" className="text-slate-600 hover:text-blue-600 transition text-sm">
                Contact
              </a>
              <button
                onClick={() => setCurrentPage('help')}
                className="text-slate-600 hover:text-blue-600 transition text-sm font-medium"
              >
                Help
              </button>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AIMotLanding;
