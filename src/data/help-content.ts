import type { HelpContent } from '@/types/help'

export const helpContent: HelpContent = {
  sections: [
    {
      id: 'service-explanation',
      title: 'What is AI MOT?',
      content: `
        <div class="space-y-4">
          <p>AI MOT delivers a tactical blueprint for maximizing your profitability and operational efficiency through artificial intelligence.</p>

          <h3 class="text-lg font-semibold mt-4">Our Services</h3>
          <p>We provide comprehensive AI consulting services tailored to your business needs:</p>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li><strong>Initial Consultation:</strong> 30-minute discovery session to understand your AI readiness and opportunities</li>
            <li><strong>Business Audit:</strong> In-depth analysis of your processes, identifying automation and optimization opportunities</li>
            <li><strong>AI Implementation:</strong> End-to-end AI solution development and deployment</li>
            <li><strong>Team Training:</strong> Hands-on workshops to upskill your team on AI tools and best practices</li>
          </ul>

          <h3 class="text-lg font-semibold mt-4">Pricing</h3>
          <p>Our pricing is transparent and value-based. Initial consultations are free, with subsequent services quoted based on scope and complexity.</p>

          <h3 class="text-lg font-semibold mt-4">Our Process</h3>
          <ol class="list-decimal list-inside space-y-2 ml-4">
            <li>Book a consultation through our simple online form</li>
            <li>Receive confirmation via email with meeting details</li>
            <li>Attend your session and discuss your AI strategy</li>
            <li>Get a customized roadmap for AI adoption</li>
          </ol>
        </div>
      `,
      order: 0,
      type: 'service',
    },
    {
      id: 'booking-instructions',
      title: 'How to Book a Consultation',
      content: `
        <div class="space-y-4">
          <p>Booking a consultation is simple and takes less than 2 minutes. Follow these steps:</p>

          <h3 class="text-lg font-semibold mt-4">Step 1: Consultation Details</h3>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li><strong>Title:</strong> Give your consultation a descriptive name (e.g., "AI Strategy for Marketing Team")</li>
            <li><strong>Category:</strong> Select the service type that best matches your needs:
              <ul class="list-circle list-inside ml-6 mt-2 space-y-1">
                <li><strong>Initial Consultation:</strong> First-time exploration of AI opportunities</li>
                <li><strong>Business Audit:</strong> Comprehensive process analysis and AI readiness assessment</li>
                <li><strong>AI Implementation:</strong> Technical planning for specific AI solutions</li>
                <li><strong>Team Training:</strong> Workshops and upskilling sessions</li>
                <li><strong>Other:</strong> Custom requests or multi-faceted projects</li>
              </ul>
            </li>
            <li><strong>Description:</strong> Provide details about your business, current challenges, and what you hope to achieve. The more context, the better we can prepare.</li>
          </ul>

          <h3 class="text-lg font-semibold mt-4">Step 2: Scheduling</h3>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li><strong>Date:</strong> Select your preferred date using the calendar picker</li>
            <li><strong>Location:</strong> Specify if you prefer virtual (Zoom/Teams) or in-person meeting. For in-person, include your city/office location.</li>
          </ul>

          <h3 class="text-lg font-semibold mt-4">Step 3: Participants (Optional)</h3>
          <ul class="list-disc list-inside space-y-2 ml-4">
            <li><strong>Number of Participants:</strong> Indicate how many people will attend from your organization</li>
            <li>This helps us prepare appropriate materials and allocate sufficient time</li>
          </ul>

          <p class="mt-4">After submitting, you'll receive a confirmation email with meeting details within 24 hours.</p>
        </div>
      `,
      order: 1,
      type: 'booking',
    },
    {
      id: 'faq-section',
      title: 'Frequently Asked Questions',
      content: '<p>Find answers to common questions below. Use the search bar to quickly locate specific topics.</p>',
      order: 2,
      type: 'faq',
    },
  ],
  faqs: [
    {
      id: 'what-is-initial-consultation',
      question: 'What happens during an Initial Consultation?',
      answer: 'During the Initial Consultation, we discuss your business goals, current challenges, and explore how AI can drive value. This 30-minute session is free and helps us understand your needs before proposing specific solutions.',
      order: 0,
      keywords: ['consultation', 'first', 'meeting', 'introduction', 'free'],
    },
    {
      id: 'how-long-implementation',
      question: 'How long does AI implementation take?',
      answer: 'Implementation timelines vary based on complexity. Simple automations may take 2-4 weeks, while enterprise-scale AI systems can require 3-6 months. We provide detailed timelines during the Business Audit phase.',
      order: 1,
      keywords: ['timeline', 'duration', 'implementation', 'how long'],
    },
    {
      id: 'do-i-need-technical-team',
      question: 'Do I need a technical team to work with AI MOT?',
      answer: 'No technical expertise is required. We work with businesses at all technical maturity levels. Our Team Training service can upskill your existing staff, or we can manage the technical implementation entirely.',
      order: 2,
      keywords: ['technical', 'team', 'skills', 'training', 'expertise'],
    },
    {
      id: 'what-industries-serve',
      question: 'What industries does AI MOT serve?',
      answer: 'We work across diverse industries including retail, healthcare, finance, manufacturing, and professional services. Our AI solutions are customized to your industry-specific challenges and regulatory requirements.',
      order: 3,
      keywords: ['industries', 'sectors', 'verticals', 'specialization'],
    },
    {
      id: 'pricing-structure',
      question: 'How does pricing work?',
      answer: 'Pricing is project-based and depends on scope, complexity, and deliverables. Initial consultations are free. After the Business Audit, we provide a detailed quote with transparent pricing and milestone-based payments.',
      order: 4,
      keywords: ['pricing', 'cost', 'payment', 'budget', 'quote'],
    },
    {
      id: 'cancel-reschedule',
      question: 'Can I cancel or reschedule my consultation?',
      answer: 'Yes, you can cancel or reschedule up to 24 hours before your scheduled time. Contact us via the email confirmation you received, and we\'ll accommodate your preferred time.',
      order: 5,
      keywords: ['cancel', 'reschedule', 'change', 'appointment'],
    },
    {
      id: 'data-security',
      question: 'How do you handle data security and privacy?',
      answer: 'We follow industry-standard security practices including encryption, secure data handling, and GDPR compliance. All client data is confidential and protected under NDA agreements. We can work within your existing security frameworks.',
      order: 6,
      keywords: ['security', 'privacy', 'data', 'confidential', 'GDPR'],
    },
  ],
  lastUpdated: '2025-10-02T00:00:00Z',
  version: '1.0.0',
}
