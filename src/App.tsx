import { useState, useEffect } from 'react';
import PricingModal from './components/PricingModal';
import About from './pages/About';
import Contact from './pages/Contact';

interface FormData {
    techSavviness: string;
    usesAI: string;
    aiSoftware: string[];
    challenge: string;
    contactMethod: string;
    name: string;
    email: string;
    phoneNumber: string;
}

function AIMotLanding() {
    const [formData, setFormData] = useState<FormData>({
        techSavviness: '',
        usesAI: '',
        aiSoftware: [],
        challenge: '',
        contactMethod: '',
        name: '',
        email: '',
        phoneNumber: ''
    });

    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<'home' | 'about' | 'contact'>('home');
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAiSoftwareToggle = (software: string) => {
        setFormData(prev => {
            // If "none" is clicked, clear all selections and set only "none"
            if (software === 'none') {
                return { ...prev, aiSoftware: ['none'] };
            }

            // If any other option is clicked and "none" is currently selected, remove "none"
            let newSoftware = prev.aiSoftware.filter(s => s !== 'none');

            // Toggle the clicked software
            if (newSoftware.includes(software)) {
                newSoftware = newSoftware.filter(s => s !== software);
            } else {
                newSoftware = [...newSoftware, software];
            }

            return { ...prev, aiSoftware: newSoftware };
        });
    };

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        alert('Thank you! Your response has been received. We will contact you shortly.');
        setFormData({
            techSavviness: '',
            usesAI: '',
            aiSoftware: [],
            challenge: '',
            contactMethod: '',
            name: '',
            email: '',
            phoneNumber: ''
        });
    };

    const handleCancel = () => {
        setFormData({
            techSavviness: '',
            usesAI: '',
            aiSoftware: [],
            challenge: '',
            contactMethod: '',
            name: '',
            email: '',
            phoneNumber: ''
        });
    };


    if (currentPage === 'about') {
        return (
            <>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                    <header className="bg-transparent border-b border-blue-200/50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                            <button onClick={() => setCurrentPage('home')} className="text-2xl font-bold text-slate-900 drop-shadow-sm hover:text-blue-600 transition">AI MOT</button>
                            <nav className="flex gap-6 items-center">
                                <button onClick={() => setCurrentPage('about')} className="text-sm font-bold text-blue-600 transition drop-shadow-sm">ABOUT</button>
                                <button onClick={() => setCurrentPage('contact')} className="text-sm font-bold text-slate-700 hover:text-blue-600 transition drop-shadow-sm">CONTACT</button>
                                <button type="button" onClick={() => setIsPricingModalOpen(true)} className="text-sm font-bold text-slate-700 hover:text-blue-600 transition drop-shadow-sm">PRICING</button>
                                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">Under Construction</span>
                            </nav>
                        </div>
                    </header>
                    <About />
                </div>
                <PricingModal
                    open={isPricingModalOpen}
                    onClose={() => setIsPricingModalOpen(false)}
                />
            </>
        );
    }

    if (currentPage === 'contact') {
        return (
            <>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                    <header className="bg-transparent border-b border-blue-200/50">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                            <button onClick={() => setCurrentPage('home')} className="text-2xl font-bold text-slate-900 drop-shadow-sm hover:text-blue-600 transition">AI MOT</button>
                            <nav className="flex gap-6 items-center">
                                <button onClick={() => setCurrentPage('about')} className="text-sm font-bold text-slate-700 hover:text-blue-600 transition drop-shadow-sm">ABOUT</button>
                                <button onClick={() => setCurrentPage('contact')} className="text-sm font-bold text-blue-600 transition drop-shadow-sm">CONTACT</button>
                                <button type="button" onClick={() => setIsPricingModalOpen(true)} className="text-sm font-bold text-slate-700 hover:text-blue-600 transition drop-shadow-sm">PRICING</button>
                                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">Under Construction</span>
                            </nav>
                        </div>
                    </header>
                    <Contact />
                </div>
                <PricingModal
                    open={isPricingModalOpen}
                    onClose={() => setIsPricingModalOpen(false)}
                />
            </>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            {/* Header */}
            <header className="bg-transparent border-b border-blue-200/50 dark:border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <button onClick={() => setCurrentPage('home')} className="text-2xl font-bold text-slate-900 dark:text-slate-100 drop-shadow-sm hover:text-blue-600 dark:hover:text-blue-400 transition">AI MOT</button>
                    <nav className="flex gap-6 items-center">
                        <button onClick={() => setCurrentPage('about')} className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition drop-shadow-sm">ABOUT</button>
                        <button onClick={() => setCurrentPage('contact')} className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition drop-shadow-sm">CONTACT</button>
                        <button type="button" onClick={() => setIsPricingModalOpen(true)} className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition drop-shadow-sm">PRICING</button>
                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">Under Construction</span>

                        {/* Theme Toggle */}
                        <div className="flex gap-2 ml-2 border-l border-slate-300 dark:border-slate-600 pl-4">
                            <button
                                onClick={() => setIsDarkMode(false)}
                                className={`p-2 rounded-lg transition-all ${!isDarkMode ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                aria-label="Light mode"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setIsDarkMode(true)}
                                className={`p-2 rounded-lg transition-all ${isDarkMode ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                aria-label="Dark mode"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Controlling Gaps  pt- applies to all screen sizes, md: screens 768px + , lg: 1024px + */}
            {/* Use 'pt- (all screens) for now */}

            {/* Gap Control: pt-8 controls Header→Hero spacing */}
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight text-black/80 dark:text-white/90 drop-shadow-md mb-4 text-balance">
                        <span className="font-bold block">BOOK YOUR AI MOT TODAY</span> <span className="text-2xl md:text-3xl lg:text-4xl font-normal block mt-2">Secure a one-on-one diagnostic with our AI engineer and receive the exact blueprint needed to build your custom automation system.</span>
                    </h2>
                </div>
            </section>

            {/* Gap Control: pt-8 controls the spacing between the Hero and the Video */}
            {/* Video Placeholder Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-8 pb-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-gradient-to-r from-[rgb(179,223,255)] via-[rgb(221,208,255)] to-[rgb(253,230,244)] dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-lg p-[4px] shadow-xl">
                        <div className="aspect-video bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 rounded-lg flex items-center justify-center">
                            <p className="text-slate-400 dark:text-slate-500 text-lg">Video Placeholder</p>
                        </div>
                    </div>
                </div>
            </section>
            {/* Gap Control: pt-10 controls the spacing between the Video and the Form */}
            {/* Form Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 md:pb-16 relative">
                <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300 dark:bg-blue-900 rounded-full blur-3xl opacity-30 dark:opacity-20"></div>
                <div className="absolute bottom-20 right-10 w-64 h-64 bg-pink-300 dark:bg-pink-900 rounded-full blur-3xl opacity-30 dark:opacity-20"></div>

                <div className="max-w-3xl mx-auto relative z-10">
                    <div className="bg-gradient-to-r from-[rgb(179,223,255)] via-[rgb(221,208,255)] to-[rgb(253,230,244)] dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded-lg p-[4px] shadow-2xl">
                        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 rounded-lg p-8">
                            {/* All questions displayed vertically */}
                            <div className="space-y-8">
                                {/* Question 1 */}
                                <div>
                                    <label className="block text-lg font-medium mb-3 dark:text-slate-200">
                                        Do you currently use A.I?
                                    </label>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('usesAI', 'yes')}
                                            className={`flex-1 px-6 py-3 rounded-md border-2 transition-all text-base ${formData.usesAI === 'yes'
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/50 dark:text-blue-300 font-medium'
                                                : 'border-gray-300 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:text-slate-300'
                                                }`}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('usesAI', 'no')}
                                            className={`flex-1 px-6 py-3 rounded-md border-2 transition-all text-base ${formData.usesAI === 'no'
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/50 dark:text-blue-300 font-medium'
                                                : 'border-gray-300 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:text-slate-300'
                                                }`}
                                        >
                                            No
                                        </button>
                                    </div>
                                </div>

                                {/* Question 2 */}
                                <div>
                                    <label className="block text-lg font-medium mb-3 dark:text-slate-200">
                                        Do you use any of the following AI Services? (Select all that apply)
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleAiSoftwareToggle('gemini')}
                                            className={`px-4 py-3 rounded-md border-2 transition-all text-base dark:text-slate-300 ${formData.aiSoftware.includes('gemini')
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/50 dark:text-blue-300 font-medium'
                                                : 'border-gray-300 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                                                }`}
                                        >
                                            Gemini
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleAiSoftwareToggle('chatgpt')}
                                            className={`px-4 py-3 rounded-md border-2 transition-all text-base dark:text-slate-300 ${formData.aiSoftware.includes('chatgpt')
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/50 dark:text-blue-300 font-medium'
                                                : 'border-gray-300 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                                                }`}
                                        >
                                            ChatGPT
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleAiSoftwareToggle('claude')}
                                            className={`px-4 py-3 rounded-md border-2 transition-all text-base dark:text-slate-300 ${formData.aiSoftware.includes('claude')
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/50 dark:text-blue-300 font-medium'
                                                : 'border-gray-300 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                                                }`}
                                        >
                                            Claude
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleAiSoftwareToggle('n8n')}
                                            className={`px-4 py-3 rounded-md border-2 transition-all text-base dark:text-slate-300 ${formData.aiSoftware.includes('n8n')
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/50 dark:text-blue-300 font-medium'
                                                : 'border-gray-300 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                                                }`}
                                        >
                                            n8n
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleAiSoftwareToggle('other')}
                                            className={`px-4 py-3 rounded-md border-2 transition-all text-base dark:text-slate-300 ${formData.aiSoftware.includes('other')
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/50 dark:text-blue-300 font-medium'
                                                : 'border-gray-300 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                                                }`}
                                        >
                                            Other
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleAiSoftwareToggle('none')}
                                            className={`px-4 py-3 rounded-md border-2 transition-all text-base dark:text-slate-300 ${formData.aiSoftware.includes('none')
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/50 dark:text-blue-300 font-medium'
                                                : 'border-gray-300 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                                                }`}
                                        >
                                            None
                                        </button>
                                    </div>
                                </div>

                                {/* Question 3 */}
                                <div>
                                    <label htmlFor="challenge" className="block text-lg font-medium mb-3 dark:text-slate-200">
                                        What is the primary challenge you are hoping to solve with AI consulting?
                                    </label>
                                    <textarea
                                        id="challenge"
                                        value={formData.challenge}
                                        onChange={(e) => handleInputChange('challenge', e.target.value)}
                                        placeholder="Describe your challenge..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base min-h-[120px]"
                                    />
                                </div>

                                {/* Question 4 */}
                                <div>
                                    <label className="block text-lg font-medium mb-3 dark:text-slate-200">
                                        On a scale of 1 to 10, how tech savvy are you?
                                    </label>
                                    <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => handleInputChange('techSavviness', num.toString())}
                                                className={`px-4 py-3 rounded-md border-2 transition-all text-base ${formData.techSavviness === num.toString()
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/50 dark:text-blue-300 font-medium'
                                                    : 'border-gray-300 dark:border-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                                                    }`}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Question 5 */}
                                <div>
                                    <label className="block text-lg font-medium mb-3 dark:text-slate-200">
                                        What is your preferred method for the one-to-one consultation session?
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('contactMethod', 'video-call')}
                                            className={`px-4 py-3 rounded-md border-2 transition-all text-base ${formData.contactMethod === 'video-call'
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/50 dark:text-blue-300 font-medium'
                                                : 'border-gray-300 dark:border-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                                                }`}
                                        >
                                            Video Call
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('contactMethod', 'phone-call')}
                                            className={`px-4 py-3 rounded-md border-2 transition-all text-base ${formData.contactMethod === 'phone-call'
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/50 dark:text-blue-300 font-medium'
                                                : 'border-gray-300 dark:border-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                                                }`}
                                        >
                                            Phone Call
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('contactMethod', 'email')}
                                            className={`px-4 py-3 rounded-md border-2 transition-all text-base ${formData.contactMethod === 'email'
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/50 dark:text-blue-300 font-medium'
                                                : 'border-gray-300 dark:border-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                                                }`}
                                        >
                                            Email
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleInputChange('contactMethod', 'message')}
                                            className={`px-4 py-3 rounded-md border-2 transition-all text-base ${formData.contactMethod === 'message'
                                                ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/50 dark:text-blue-300 font-medium'
                                                : 'border-gray-300 dark:border-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                                                }`}
                                        >
                                            Message
                                        </button>
                                    </div>
                                </div>

                                {/* Question 6 */}
                                <div>
                                    <label htmlFor="name" className="block text-lg font-medium mb-3 dark:text-slate-200">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="Enter your name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                    />
                                </div>

                                {/* Question 7 */}
                                <div>
                                    <label htmlFor="email" className="block text-lg font-medium mb-3 dark:text-slate-200">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                    />
                                </div>

                                {/* Question 8 */}
                                <div>
                                    <label htmlFor="phoneNumber" className="block text-lg font-medium mb-3 dark:text-slate-200">
                                        Phone Number
                                    </label>
                                    <input
                                        id="phoneNumber"
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                        placeholder="Enter your phone number"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                                    />
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    onClick={handleCancel}
                                    className="px-6 py-3 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition text-base dark:text-slate-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white rounded-md shadow-lg hover:shadow-xl transition-all text-base"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer spacing */}
            <div className="h-12"></div>

            <PricingModal
                open={isPricingModalOpen}
                onClose={() => setIsPricingModalOpen(false)}
            />
        </div>
    );
}

export default AIMotLanding;
