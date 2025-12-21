-- =============================================
-- YAYA KURYE PLATFORMU - DATABASE MIGRATIONS
-- =============================================
-- Database: yaya_kurye
-- Tüm tabloları oluşturmak için bu dosyayı phpMyAdmin'de çalıştırın
-- =============================================

-- 1. USERS TABLOSU (Tüm kullanıcılar için base tablo)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'sender', 'admin') NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. STUDENTS TABLOSU (Öğrenci kurye detayları)
CREATE TABLE IF NOT EXISTS students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    tc_no VARCHAR(11) UNIQUE NOT NULL,
    birth_date DATE NOT NULL,
    iban VARCHAR(26) NOT NULL,
    address TEXT NOT NULL,
    university VARCHAR(255) NOT NULL,
    student_document_url VARCHAR(500),
    admin_approved BOOLEAN DEFAULT FALSE,
    kvkk_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    terms_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_tc_no (tc_no),
    INDEX idx_admin_approved (admin_approved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. INDIVIDUAL_SENDERS TABLOSU (Bireysel gönderici detayları)
CREATE TABLE IF NOT EXISTS individual_senders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    tc_no VARCHAR(11) UNIQUE NOT NULL,
    billing_address TEXT NOT NULL,
    kvkk_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    terms_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_tc_no (tc_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. CORPORATE_SENDERS TABLOSU (Kurumsal gönderici detayları)
CREATE TABLE IF NOT EXISTS corporate_senders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    tax_office VARCHAR(255) NOT NULL,
    tax_number VARCHAR(20) UNIQUE NOT NULL,
    billing_address TEXT NOT NULL,
    kvkk_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    terms_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_tax_number (tax_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. REFRESH_TOKENS TABLOSU (Refresh token'ları saklamak için)
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token (token),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- KURULUM TAMAMLANDI!
-- =============================================
-- Tablolar başarıyla oluşturuldu.
-- Şimdi backend'i başlatabilirsiniz: npm run dev
-- =============================================
