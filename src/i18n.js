// i18n.js — Internationalization config
// All translations embedded in JS bundle — no HTTP requests.
// Works on 3G without extra round trips.

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      app_name: 'Patrona',
      tagline: 'Print safely. Leave no trace.',
      role_shop: 'I am a Print Shop',
      role_customer: 'I want to Print',
      start_session: 'Start Session',
      setup_station_title: 'Setup Print Station',
      setup_station_desc: 'Prepare this terminal to receive documents securely.',
      activate_station: 'Activate Station',
      waiting: 'Waiting for customer...',
      received: 'Document received',
      enter_pin: 'Enter PIN to unlock',
      wrong_pin: 'Wrong PIN. Try again.',
      attempts_left: 'Attempts: {{count}} / 3',
      print: 'Print Document',
      complete: 'Session complete. Document removed.',
      session_expired: 'Session expired. Data cleared.',
      session_destroyed: 'Too many wrong attempts. Session destroyed.',
      new_session: 'Start New Session',
      role_shop_title: 'I am a Print Shop',
      role_shop_desc: 'Generate a QR code to receive documents securely from customers.',
      role_customer_title: 'I want to Print',
      role_customer_desc: 'Scan a shop QR code to send your document directly to their printer.',
      language_label: 'Language',
      change_lang: 'Tamil',
      tell_pin: 'Tell this PIN to the shop owner',
      send_securely: 'Send Securely',
      create_pin: 'Create a 4-digit PIN',
      confirm_pin: 'Confirm PIN',
      pin_mismatch: 'PINs do not match',
      connecting: 'Connecting to print shop...',
      connection_lost: 'Could not connect. Ask shop to start a new session.',
      pdf_fallback_msg: 'PDF loaded — click Print to continue',
      job_label: 'Tab',
      transparency_note: 'Your file never touches our server.',
      transparency_full: 'Your document never touches our server. Transfer is direct, device to device. Session data is deleted within 60 seconds.',
      view_source: 'View our open source code',
      how_it_works: 'How it Works',
      step1_title: 'Shop creates a session',
      step1_desc: 'The shop opens Patrona and creates a new session. A QR code appears on screen.',
      step2_title: 'You scan and send',
      step2_desc: 'Scan the QR code with your phone. Select your document and create a PIN. Your file is sent directly to the shop — no server involved.',
      step3_title: 'Shop prints and deletes',
      step3_desc: 'The shop enters your PIN, prints the document, and everything is automatically deleted. Nothing remains.',
      select_expiry: 'Session duration',
      duration_note: 'Documents are automatically wiped after this time.',
      recommended: 'Recommended',
      minutes: 'minutes',
      select_file: 'Select your document',
      file_too_large: 'File must be under 10MB',
      file_invalid_type: 'Only PDF, JPG, and PNG files are allowed',
      sending: 'Sending...',
      receiving: 'Receiving document...',
      back: 'Back',
      ask_pin: 'Ask the customer for their PIN.',
      scan_qr: 'Scan with phone camera',
      sent_success: 'Document sent successfully!',
      privacy_policy_box_text: 'Patrona uses WebRTC for direct device-to-device transfer. Your document is temporarily stored in the browser memory of the shop device and is automatically destroyed after printing or 10 minutes.',
      transaction_id: 'Transaction ID',
    }
  },
  ta: {
    translation: {
      app_name: 'பேட்ரோனா (Patrona)',
      tagline: 'பாதுகாப்பாக அச்சிடுங்கள்.',
      start_session: 'அமர்வை தொடங்கு',
      setup_station_title: 'அச்சு நிலையத்தை தயார் செய்',
      setup_station_desc: 'ஆவணங்களைப் பாதுகாப்பாகப் பெற முனையத்தைத் தயார் செய்யவும்.',
      activate_station: 'நிலையத்தை இயக்கு',
      waiting: 'வாடிக்கையாளருக்காக காத்திருக்கிறோம்...',
      received: 'ஆவணம் பெறப்பட்டது',
      enter_pin: 'திறக்க PIN உள்ளிடவும்',
      wrong_pin: 'தவறான PIN. மீண்டும் முயற்சிக்கவும்.',
      attempts_left: 'முயற்சிகள்: {{count}} / 3',
      print: 'அச்சிடுக',
      complete: 'அமர்வு முடிந்தது. ஆவணம் நீக்கப்பட்டது.',
      session_expired: 'அமர்வு காலாவதியானது. தரவு அழிக்கப்பட்டது.',
      session_destroyed: 'அதிக தவறான முயற்சிகள். அமர்வு அழிக்கப்பட்டது.',
      new_session: 'புதிய அமர்வைத் தொடங்கவும்',
      role_shop_title: 'நான் ஒரு அச்சு நிலையம்',
      role_shop_desc: 'வாடிக்கையாளர்களிடமிருந்து ஆவணங்களைப் பாதுகாப்பாகப் பெற QR குறியீட்டை உருவாக்கவும்.',
      role_customer_title: 'நான் அச்சிட விரும்புகிறேன்',
      role_customer_desc: 'உங்கள் ஆவணத்தை நேரடியாக அவர்களின் அச்சுப்பொறிக்கு அனுப்ப கடையின் QR குறியீட்டை ஸ்கேன் செய்யவும்.',
      language_label: 'மொழி',
      change_lang: 'English',
      tell_pin: 'இந்த PIN-ஐ கடை உரிமையாளரிடம் சொல்லுங்கள்',
      send_securely: 'பாதுகாப்பாக அனுப்பு',
      create_pin: '4-இலக்க PIN உருவாக்கவும்',
      confirm_pin: 'PIN உறுதிப்படுத்தவும்',
      pin_mismatch: 'PIN பொருந்தவில்லை',
      connecting: 'அச்சகத்துடன் இணைக்கிறது...',
      connection_lost: 'இணைக்க முடியவில்லை. புதிய அமர்வு கேளுங்கள்.',
      new_session: 'புதிய அமர்வை தொடங்கு',
      pdf_fallback_msg: 'PDF தயார் — அச்சிட கிளிக் செய்யவும்',
      job_label: 'தாவல்',
      transparency_note: 'உங்கள் கோப்பு சேவையகத்தை தொடவில்லை.',
      transparency_full: 'உங்கள் ஆவணம் எந்த சேவையகத்திலும் சேமிக்கப்படுவதில்லை. கோப்பு நேரடியாக சாதனத்திலிருந்து சாதனத்திற்கு அனுப்பப்படுகிறது. 60 வினாடிகளில் அமர்வு தரவு நீக்கப்படும்.',
      view_source: 'எங்கள் திறந்த மூல குறியீட்டைப் பார்க்கவும்',
      how_it_works: 'இது எப்படி வேலை செய்கிறது',
      step1_title: 'கடை ஒரு அமர்வை உருவாக்குகிறது',
      step1_desc: 'கடை Patrona-ஐ திறந்து புதிய அமர்வை உருவாக்குகிறது. QR குறியீடு திரையில் தோன்றும்.',
      step2_title: 'நீங்கள் ஸ்கேன் செய்து அனுப்புங்கள்',
      step2_desc: 'உங்கள் தொலைபேசியில் QR குறியீட்டை ஸ்கேன் செய்யுங்கள். உங்கள் ஆவணத்தை தேர்ந்தெடுத்து PIN உருவாக்கவும். உங்கள் கோப்பு நேரடியாக கடைக்கு அனுப்பப்படுகிறது.',
      step3_title: 'கடை அச்சிடுகிறது மற்றும் நீக்குகிறது',
      step3_desc: 'கடை உங்கள் PIN-ஐ உள்ளிட்டு, ஆவணத்தை அச்சிடுகிறது, மற்றும் எல்லாம் தானாக நீக்கப்படுகிறது.',
      select_expiry: 'அமர்வு காலம்',
      duration_note: 'இந்த நேரத்திற்குப் பிறகு ஆவணங்கள் தானாகவே அழிக்கப்படும்.',
      recommended: 'பரிந்துரைக்கப்படுகிறது',
      minutes: 'நிமிடங்கள்',
      select_file: 'உங்கள் ஆவணத்தை தேர்ந்தெடுக்கவும்',
      file_too_large: 'கோப்பு 10MB-க்கு கீழ் இருக்க வேண்டும்',
      file_invalid_type: 'PDF, JPG, மற்றும் PNG கோப்புகள் மட்டுமே அனுமதிக்கப்படுகின்றன',
      sending: 'அனுப்புகிறது...',
      receiving: 'ஆவணத்தைப் பெறுகிறது...',
      back: 'பின் செல்',
      ask_pin: 'வாடிக்கையாளரிடம் PIN கேளுங்கள்.',
      scan_qr: 'தொலைபேசி கேமராவால் ஸ்கேன் செய்யவும்',
      doc_sent: 'ஆவணம் வெற்றிகரமாக அனுப்பப்பட்டது',
      privacy_policy_box_text: 'பேட்ரோனா (Patrona) நேரடி சாதனத்திலிருந்து சாதனத்திற்கு பரிமாற்றத்திற்காக WebRTC-ஐப் பயன்படுத்துகிறது. உங்கள் ஆவணம் கடையின் சாதனத்தின் உலாவி நினைவகத்தில் தற்காலிகமாக சேமிக்கப்பட்டு, அச்சிடப்பட்ட பிறகு அல்லது 10 நிமிடங்களுக்குப் பிறகு தானாகவே அழிக்கப்படும்.',
      transaction_id: 'பரிவர்த்தனை ஐடி',
    }
  }
};

// Get saved language preference or default to English
const savedLang = typeof window !== 'undefined'
  ? localStorage.getItem('sp_lang') || 'en'
  : 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;
