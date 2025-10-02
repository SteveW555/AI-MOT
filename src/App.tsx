import { useState } from 'react';

interface FormData {
    techSavviness: string;
    usesAI: string;
    aiSoftware: string;
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
        aiSoftware: '',
        challenge: '',
        contactMethod: '',
        name: '',
        email: '',
        phoneNumber: ''
    });

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        console.log('Form submitted:', formData);
        alert('Thank you! Your response has been received. We will contact you shortly.');
        setFormData({
            techSavviness: '',
            usesAI: '',
            aiSoftware: '',
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
            aiSoftware: '',
            challenge: '',
            contactMethod: '',
            name: '',
            email: '',
            phoneNumber: ''
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            {/* Header */}
            <header className="bg-transparent border-b border-blue-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-slate-900 drop-shadow-sm">AI MOT</h1>
                    <nav className="flex gap-6">
                        <a href="/about" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition drop-shadow-sm">ABOUT</a>
                        <a href="/contact" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition drop-shadow-sm">CONTACT</a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-12 md:pt-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight text-black/80 drop-shadow-md mb-0 text-balance">
                        <span className="font-bold block">BOOK YOUR AI MOT TODAY</span> <span className="text-2xl md:text-3xl lg:text-4xl font-normal block mt-2">Secure a one-on-one diagnostic with our AI engineer and receive the exact blueprint needed to build your custom automation system.</span>
                    </h2>
                </div>
            </section>

            {/* Video Placeholder Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-gradient-to-r from-[rgb(179,223,255)] via-[rgb(221,208,255)] to-[rgb(253,230,244)] rounded-lg p-[4px] shadow-xl">
                        <div className="aspect-video bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-lg flex items-center justify-center">
                            <p className="text-slate-400 text-lg">Video Placeholder</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 md:pb-16 relative">
                <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300 rounded-full blur-3xl opacity-30"></div>
                <div className="absolute bottom-20 right-10 w-64 h-64 bg-pink-300 rounded-full blur-3xl opacity-30"></div>
            </section>
        </div>
    );
}

export default AIMotLanding;