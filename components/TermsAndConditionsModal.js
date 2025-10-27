'use client';

import { useState, useEffect } from 'react';

export default function TermsAndConditionsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // Check if user has already accepted terms
    const termsAccepted = localStorage.getItem('terms_accepted');
    if (!termsAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    if (isChecked) {
      localStorage.setItem('terms_accepted', 'true');
      localStorage.setItem('terms_accepted_date', new Date().toISOString());
      setHasAccepted(true);
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm bg-gray-900/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-cyan-600">
          <h2 className="text-2xl font-bold text-white">Terms and Conditions of Use</h2>
          <p className="text-blue-100 text-sm mt-1">Please read carefully before using the platform</p>
        </div>

        {/* Content - Scrollable */}
        <div className="px-6 py-4 overflow-y-auto flex-1 text-sm text-gray-700 space-y-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="font-semibold text-gray-900">
              PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE USING THE CLINIC PORTAL ("PLATFORM") 
              OPERATED BY [YOUR COMPANY NAME] ("COMPANY," "WE," "US," OR "OUR"). BY REGISTERING AND USING 
              THE PLATFORM, YOU ("CLINIC," "LAB," OR "YOU") AGREE TO BE LEGALLY BOUND BY THESE TERMS.
            </p>
          </div>

          {/* Section 1 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">1. ELIGIBILITY AND AUTHORIZATION</h3>
            <p className="mb-2">
              <strong>1.1</strong> You warrant and represent that you are a legally registered healthcare provider, 
              clinic, or diagnostic laboratory authorized under applicable laws and regulations to handle, process, 
              and transmit patient medical information.
            </p>
            <p>
              <strong>1.2</strong> You shall provide true, accurate, current, and complete information during the 
              registration process, including healthcare licenses and any other credentials required by law.
            </p>
          </div>

          {/* Section 2 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">2. COMPLIANCE WITH LAWS AND REGULATIONS</h3>
            <p className="mb-2">
              <strong>2.1</strong> You agree to comply with all applicable laws, regulations, codes, and guidelines 
              relating to data protection, healthcare information privacy, and patient consent management, including 
              but not limited to the Information Technology Act, Personal Data Protection Act (DPDP), and relevant 
              healthcare standards.
            </p>
            <p>
              <strong>2.2</strong> You confirm that you have obtained all necessary consents, authorizations, and 
              permissions from patients for the storage, sharing, and processing of their medical records via the Platform.
            </p>
          </div>

          {/* Section 3 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">3. DATA SECURITY AND PRIVACY</h3>
            <p className="mb-2">
              <strong>3.1</strong> All data uploaded and stored within the Platform shall be treated as confidential 
              and secured using recognized industry-standard encryption and security protocols.
            </p>
            <p className="mb-2">
              <strong>3.2</strong> You shall not misuse, distribute, or disclose any data obtained through the Platform 
              beyond the scope of lawful patient care and regulatory compliance.
            </p>
            <p>
              <strong>3.3</strong> The Company shall implement reasonable security measures but shall not be responsible 
              for unauthorized access or data breaches arising from negligence by you or third parties beyond the 
              Company's control.
            </p>
          </div>

          {/* Section 4 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">4. REPORT UPLOADING AND DELIVERY</h3>
            <p className="mb-2">
              <strong>4.1</strong> You shall be solely responsible for the accuracy, integrity, and legality of all 
              medical reports and documents uploaded to the Platform.
            </p>
            <p className="mb-2">
              <strong>4.2</strong> The Platform provides a mechanism for secure, digital transmission of medical reports 
              to patients and authorized recipients. The use of such transmission services does not relieve you of your 
              professional responsibility to communicate medical information accurately and appropriately.
            </p>
            <p>
              <strong>4.3</strong> Any Artificial Intelligence-generated summaries or analyses provided by the Platform 
              are solely for informational purposes and do not constitute medical advice or diagnosis.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">5. AUDIT, VERIFICATION, AND ACCOUNTABILITY</h3>
            <p className="mb-2">
              <strong>5.1</strong> The Company reserves the right to conduct audits, request documentation, and verify 
              licenses, registrations, or clinical credentials at any time to ensure continued eligibility and compliance.
            </p>
            <p>
              <strong>5.2</strong> Any provision of false or misleading information, fraudulent use, or violation of 
              these Terms shall entitle the Company to suspend or terminate your access immediately without prior notice.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">6. INTELLECTUAL PROPERTY RIGHTS</h3>
            <p className="mb-2">
              <strong>6.1</strong> The Company retains all intellectual property rights, title, and interest in the 
              Platform, including all software, technology, and content.
            </p>
            <p>
              <strong>6.2</strong> You shall receive a non-exclusive, non-transferable, revocable license solely to 
              use the Platform for legitimate healthcare operations as described herein.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">7. LIMITATION OF LIABILITY</h3>
            <p className="mb-2">
              <strong>7.1</strong> The Platform is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, 
              either express or implied.
            </p>
            <p className="mb-2">
              <strong>7.2</strong> The Company shall not be liable for any direct, indirect, incidental, consequential, 
              or special damages arising from the use or inability to use the Platform, including reliance on 
              AI-generated outputs.
            </p>
            <p>
              <strong>7.3</strong> Your sole remedy for any dissatisfaction or issues shall be limited to cessation of 
              use or correction of defects as reasonably practicable.
            </p>
          </div>

          {/* Section 8 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">8. TERMINATION</h3>
            <p className="mb-2">
              <strong>8.1</strong> Either party may terminate access to the Platform by providing thirty (30) days 
              written notice or immediately upon breach of these Terms.
            </p>
            <p className="mb-2">
              <strong>8.2</strong> Upon termination, you shall cease all use and destroy any confidential or proprietary 
              information and access credentials.
            </p>
            <p>
              <strong>8.3</strong> Retention and deletion of your data shall be governed by the Company's Privacy Policy.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">9. GOVERNING LAW AND DISPUTE RESOLUTION</h3>
            <p className="mb-2">
              <strong>9.1</strong> These Terms shall be governed by and construed in accordance with the laws of India.
            </p>
            <p>
              <strong>9.2</strong> Any disputes arising out of or relating to these Terms or your use of the Platform 
              shall be subject to the exclusive jurisdiction of courts located within [Your Jurisdiction].
            </p>
          </div>

          {/* Section 10 */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">10. ACCEPTANCE</h3>
            <p>
              By clicking the "I Agree" checkbox, you confirm that you have read, understood, and agree to abide by 
              these Terms and Conditions in full. You acknowledge that failure to comply may result in suspension or 
              termination of your Platform access.
            </p>
          </div>
        </div>

        {/* Footer with Checkbox and Button */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-start mb-4">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="terms-checkbox" className="ml-3 text-sm text-gray-700 cursor-pointer">
              <span className="font-semibold">I agree</span> to the Terms and Conditions stated above. 
              I confirm that I have read, understood, and accept all the terms, and I acknowledge that 
              my use of the platform is subject to these terms.
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={handleAccept}
              disabled={!isChecked}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                isChecked
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Accept and Continue
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            You must accept the terms and conditions to use this platform
          </p>
        </div>
      </div>
    </div>
  );
}
