'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'vi' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Brand & Navigation
    'brand.platform': 'NỀN TẢNG',
    'nav.home': 'Trang chủ',
    'nav.solutions': 'Giải pháp',
    'nav.demo': 'Demo Trực tiếp',
    'nav.technology': 'Công nghệ',
    'nav.contact': 'Liên hệ',
    'nav.explore_demo': 'Trải nghiệm',
    'nav.status_engine': 'ENGINE v2.4',
    'nav.latency': 'ĐỘ TRỄ',

    // Footer
    'footer.description': 'Nền tảng nhận diện thông minh và tự động hóa kiểm soát ra vào dành cho doanh nghiệp, đảm bảo dữ liệu minh bạch và xác thực thị giác tức thì.',
    'footer.solutions': 'Giải pháp',
    'footer.technology': 'Công nghệ',
    'footer.platform': 'Nền tảng',
    'footer.sol_visitor': 'Quản lý Khách ra vào',
    'footer.sol_access': 'Kiểm soát Ra vào Tòa nhà',
    'footer.sol_student': 'Điểm danh Học sinh - Sinh viên',
    'footer.sol_workforce': 'Chấm công Nhân sự Doanh nghiệp',
    'footer.sol_restricted': 'Khu vực Hạn chế & Trọng yếu',
    'footer.sol_event': 'Check-in Sự kiện & Hội nghị',
    'footer.tech_engine': 'Bộ xử lý Nhận diện',
    'footer.tech_vector': 'Vector Đặc trưng 512 Chiều',
    'footer.tech_privacy': 'Bảo mật Dữ liệu Riêng tư',
    'footer.tech_api': 'Giao thức Kết nối API',
    'footer.plat_demo': 'Phòng Trải nghiệm Demo Trực tiếp',
    'footer.plat_contact': 'Liên hệ Đội ngũ Tư vấn',
    'footer.plat_overview': 'Tổng quan Hệ sinh thái',
    'footer.copyright': 'Bản quyền thuộc về Hệ sinh thái VISITRA.',
    'footer.terms': 'ĐIỀU KHOẢN VẬN HÀNH',
    'footer.privacy': 'CHÍNH SÁCH BẢO MẬT',
    'footer.standards': 'TIÊU CHUẨN AN TOÀN',

    // Demo Page Header & Tabs
    'demo.badge': 'Phiên bản Thử nghiệm Trực tiếp',
    'demo.title': 'BỘ XỬ LÝ NHẬN DIỆN THỊ GIÁC VISITRA',
    'demo.admin_desc': 'Chế độ Quản trị viên: Toàn quyền thêm, chỉnh sửa, xóa hồ sơ nhân sự/khách, quản trị vector nhận diện và theo dõi nhật ký hoạt động.',
    'demo.guest_desc': 'Chế độ Trải nghiệm: Bạn có thể bật camera để nhận diện trực tiếp. Để quản lý hồ sơ, vui lòng đăng nhập quyền Quản trị viên.',
    'demo.admin_mode': 'QUẢN TRỊ VIÊN',
    'demo.guest_mode': 'KHÁCH TRẢI NGHIỆM',
    'demo.admin_login': 'Đăng nhập Quản trị',
    'demo.admin_logout': 'Đăng xuất',
    'demo.admin_auth': 'Đã xác thực Quản trị',
    'demo.tab_scan': 'Quét nhận diện (Trực tiếp)',
    'demo.tab_enroll': 'Đăng ký Hồ sơ Mới',
    'demo.tab_profiles': 'Danh sách Hồ sơ',
    'demo.tab_history': 'Nhật ký Hoạt động',
    'demo.enrolled_count': 'hồ sơ',
    'demo.history_count': 'sự kiện',

    // Scan Tab
    'scan.camera_title': 'Camera Nhận diện Trực tiếp',
    'scan.camera_desc': 'Hệ thống tự động phát hiện khuôn mặt và đối chiếu dữ liệu mỗi giây',
    'scan.start_cam': 'Bật Camera Nhận diện',
    'scan.stop_cam': 'Tắt Camera',
    'scan.auto_scanning': 'Đang tự động quét...',
    'scan.ready': 'Sẵn sàng nhận diện',
    'scan.camera_off': 'Camera hiện đang tắt',
    'scan.camera_off_desc': 'Bấm "Bật Camera Nhận diện" phía trên để hệ thống bắt đầu quét và hiển thị khung nhận dạng trực tiếp.',
    'scan.hud_status': 'Trạng thái Nhận diện',
    'scan.matched': 'ĐÃ XÁC THỰC HỒ SƠ',
    'scan.unregistered': 'CHƯA CÓ HỒ SƠ LƯU TRỮ',
    'scan.waiting': 'Đang tìm kiếm khuôn mặt...',
    'scan.person_id': 'Mã định danh',
    'scan.full_name': 'Họ và tên',
    'scan.department': 'Phòng ban / Đơn vị',
    'scan.clearance': 'Cấp quyền ra vào',
    'scan.email': 'Email liên hệ',
    'scan.similarity': 'Độ khớp nhận diện',
    'scan.confidence': 'Độ tin cậy',
    'scan.unreg_hint': 'Khuôn mặt này chưa có hồ sơ trong hệ thống. Vui lòng liên hệ quản trị viên để đăng ký.',

    // Department options
    'dept.security': 'Đơn vị Bảo vệ',
    'dept.executive': 'Ban Giám đốc / Lãnh đạo',
    'dept.research': 'Khối Nghiên cứu & Phát triển',
    'dept.operations': 'Khối Vận hành & Hậu cần',
    'dept.visitor': 'Khách hàng / Đối tác Tham quan',

    // Clearance options
    'clearance.level1': 'Cấp 1 - Khách tham quan Tiêu chuẩn',
    'clearance.level2': 'Cấp 2 - Nhân viên Toàn quyền Văn phòng',
    'clearance.level3': 'Cấp 3 - Khu vực Nghiên cứu & Dự án',
    'clearance.level4': 'Cấp 4 - Khu vực Trọng yếu & Ban Quản trị',

    // Enroll Tab
    'enroll.title': 'Đăng ký Hồ sơ Mới',
    'enroll.desc': 'Tải ảnh khuôn mặt để hệ thống trích xuất vector đặc trưng 512 chiều',
    'enroll.full_name': 'Họ và Tên *',
    'enroll.person_id': 'Mã Định danh / Person ID *',
    'enroll.department': 'Phòng ban / Đơn vị',
    'enroll.clearance': 'Cấp độ Cấp phép Ra vào',
    'enroll.email': 'Email (Không bắt buộc)',
    'enroll.photos': 'Ảnh khuôn mặt * (1 - 4 ảnh)',
    'enroll.photos_hint': 'Nhấp để chọn ảnh chân dung (khuyên dùng ảnh góc thẳng, rõ mặt)',
    'enroll.btn_create': 'Tạo & Lưu Hồ sơ Danh tính',
    'enroll.btn_creating': 'Đang trích xuất & lưu hồ sơ...',
    'enroll.success': 'Đăng ký hồ sơ danh tính thành công!',

    // Profile Registry
    'profiles.title': 'Quản lý Hồ sơ Danh tính',
    'profiles.desc': 'Danh sách toàn bộ nhân viên và khách đã đăng ký trong cơ sở dữ liệu',
    'profiles.search_placeholder': 'Tìm kiếm theo tên, mã ID hoặc phòng ban...',
    'profiles.empty': 'Chưa có hồ sơ nào được đăng ký trong hệ thống.',
    'profiles.edit_tooltip': 'Chỉnh sửa hồ sơ',
    'profiles.delete_tooltip': 'Xóa hồ sơ (kèm ảnh và vector)',
    'profiles.delete_confirm': 'Bạn có chắc chắn muốn xóa hồ sơ này? Toàn bộ ảnh lưu trữ và dữ liệu vector sẽ được xóa sạch khỏi cơ sở dữ liệu.',
    'profiles.edit_title': 'Chỉnh sửa Hồ sơ Danh tính',
    'profiles.save': 'Lưu thay đổi',
    'profiles.saving': 'Đang lưu...',
    'profiles.cancel': 'Hủy',

    // History Tab
    'history.title': 'Nhật ký Sự kiện Nhận diện',
    'history.desc': 'Lịch sử các lần quét nhận diện và sự kiện ra vào trong phiên hoạt động',
    'history.clear': 'Xóa Nhật ký',
    'history.empty': 'Chưa ghi nhận sự kiện nhận diện nào.',

    // Admin Modal
    'admin.modal_title': 'Xác thực Quản trị viên',
    'admin.modal_desc': 'Quyền quản trị hệ thống Visitra',
    'admin.password_label': 'Mật khẩu Quản trị viên',
    'admin.password_placeholder': 'Nhập mật khẩu quản trị viên',
    'admin.confirm': 'Xác nhận',
    'admin.cancel': 'Hủy',
    'admin.req_title': 'Yêu cầu Quyền Quản trị viên',
    'admin.req_desc': 'Chỉ người quản trị mới được phép tạo, chỉnh sửa hoặc xóa hồ sơ người dùng trong hệ thống.',
    'admin.req_btn': 'Đăng nhập Quản trị',
  },
  en: {
    // Brand & Navigation
    'brand.platform': 'PLATFORM',
    'nav.home': 'Home',
    'nav.solutions': 'Solutions',
    'nav.demo': 'Live Demo',
    'nav.technology': 'Technology',
    'nav.contact': 'Contact',
    'nav.explore_demo': 'Explore Demo',
    'nav.status_engine': 'ENGINE v2.4 ONLINE',
    'nav.latency': 'SYS LATENCY',

    // Footer
    'footer.description': 'Intelligent recognition and spatial automation engineered for physical access, sovereign telemetry, and zero-latency spatial identity verification.',
    'footer.solutions': 'Solutions',
    'footer.technology': 'Technology',
    'footer.platform': 'Platform',
    'footer.sol_visitor': 'Smart Visitor Management',
    'footer.sol_access': 'Smart Building Access',
    'footer.sol_student': 'Student Attendance',
    'footer.sol_workforce': 'Workforce Attendance',
    'footer.sol_restricted': 'Secure Restricted Area',
    'footer.sol_event': 'Smart Event Check-in',
    'footer.tech_engine': 'Recognition Engine',
    'footer.tech_vector': '512-D Spatial Vectors',
    'footer.tech_privacy': 'Privacy Architecture',
    'footer.tech_api': 'FastAPI Schema Contract',
    'footer.plat_demo': 'Live Demo Laboratory',
    'footer.plat_contact': 'Contact Solution Team',
    'footer.plat_overview': 'Ecosystem Overview',
    'footer.copyright': 'VISITRA Ecosystem. All rights reserved.',
    'footer.terms': 'TERMS OF TELEMETRY',
    'footer.privacy': 'PRIVACY SPECIFICATION',
    'footer.standards': 'OSDP COMPLIANCE',

    // Demo Page Header & Tabs
    'demo.badge': 'MVP Demo Kit v2.4 LIVE',
    'demo.title': 'VISITRA RECOGNITION ENGINE',
    'demo.admin_desc': 'Administrator Mode: Full authority to create, update, delete identity profiles, manage vector embeddings, and monitor telemetry.',
    'demo.guest_desc': 'Guest Mode: You can activate camera to test face recognition. To manage profiles, please login with Administrator credentials.',
    'demo.admin_mode': 'ADMIN MODE',
    'demo.guest_mode': 'GUEST MODE (SCAN ONLY)',
    'demo.admin_login': 'Admin Login',
    'demo.admin_logout': 'Logout',
    'demo.admin_auth': 'Admin Authenticated',
    'demo.tab_scan': 'Scan (Guest & Admin)',
    'demo.tab_enroll': 'Enroll Identity',
    'demo.tab_profiles': 'Profile Registry',
    'demo.tab_history': 'History',
    'demo.enrolled_count': 'profiles',
    'demo.history_count': 'events',

    // Scan Tab
    'scan.camera_title': 'Live Recognition Camera',
    'scan.camera_desc': 'Automatic face detection and database matching every second',
    'scan.start_cam': 'Start Camera',
    'scan.stop_cam': 'Stop Camera',
    'scan.auto_scanning': 'Auto-scanning...',
    'scan.ready': 'Ready to recognize',
    'scan.camera_off': 'Camera is currently stopped',
    'scan.camera_off_desc': 'Click "Start Camera" above to begin scanning and display the recognition HUD overlay.',
    'scan.hud_status': 'Recognition Status',
    'scan.matched': 'VERIFIED PROFILE',
    'scan.unregistered': 'UNREGISTERED PROFILE',
    'scan.waiting': 'Searching for face...',
    'scan.person_id': 'Person ID',
    'scan.full_name': 'Full Name',
    'scan.department': 'Department',
    'scan.clearance': 'Clearance Level',
    'scan.email': 'Email',
    'scan.similarity': 'Match Similarity',
    'scan.confidence': 'Confidence',
    'scan.unreg_hint': 'This face is not registered in the database. Please contact an administrator to enroll.',

    // Department options
    'dept.security': 'Security Unit',
    'dept.executive': 'Executive Board',
    'dept.research': 'Research & Development',
    'dept.operations': 'Operations & Logistics',
    'dept.visitor': 'Guest / Visiting Partner',

    // Clearance options
    'clearance.level1': 'Level 1 - Standard Visitor',
    'clearance.level2': 'Level 2 - General Office Access',
    'clearance.level3': 'Level 3 - Restricted Lab Access',
    'clearance.level4': 'Level 4 - Executive Core Access',

    // Enroll Tab
    'enroll.title': 'Register New Identity',
    'enroll.desc': 'Upload photos to extract 512-D facial embedding vectors',
    'enroll.full_name': 'Full Name *',
    'enroll.person_id': 'Person ID *',
    'enroll.department': 'Department',
    'enroll.clearance': 'Clearance Level',
    'enroll.email': 'Email (Optional)',
    'enroll.photos': 'Face Photos * (1-4 images)',
    'enroll.photos_hint': 'Click to select face photos (front-facing recommended)',
    'enroll.btn_create': 'Create Identity Profile',
    'enroll.btn_creating': 'Extracting vectors & saving...',
    'enroll.success': 'Identity profile enrolled successfully!',

    // Profile Registry
    'profiles.title': 'Profile Registry',
    'profiles.desc': 'Directory of enrolled personnel and guests stored in database',
    'profiles.search_placeholder': 'Search by name, ID or department...',
    'profiles.empty': 'No profiles registered in the system yet.',
    'profiles.edit_tooltip': 'Edit profile',
    'profiles.delete_tooltip': 'Delete profile (with photos & vectors)',
    'profiles.delete_confirm': 'Are you sure you want to delete this profile? All stored photos and vector embeddings will be completely purged.',
    'profiles.edit_title': 'Edit Identity Profile',
    'profiles.save': 'Save Changes',
    'profiles.saving': 'Saving...',
    'profiles.cancel': 'Cancel',

    // History Tab
    'history.title': 'Recognition Event Log',
    'history.desc': 'All recognition events and access telemetry recorded in this session',
    'history.clear': 'Clear Log',
    'history.empty': 'No recognition events recorded yet.',

    // Admin Modal
    'admin.modal_title': 'Administrator Authentication',
    'admin.modal_desc': 'Visitra System Admin Access',
    'admin.password_label': 'Admin Key / Password',
    'admin.password_placeholder': 'Enter administrator password',
    'admin.confirm': 'Confirm',
    'admin.cancel': 'Cancel',
    'admin.req_title': 'Administrator Privilege Required',
    'admin.req_desc': 'Only administrators are authorized to create, update, or remove profiles in the system.',
    'admin.req_btn': 'Admin Login',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  lang: 'vi',
  setLang: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('vi');

  useEffect(() => {
    const saved = localStorage.getItem('visitra_lang') as Language;
    if (saved === 'vi' || saved === 'en') {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('visitra_lang', newLang);
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
