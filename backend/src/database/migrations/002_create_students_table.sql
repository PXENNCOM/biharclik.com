-- Öğrenci kurye detayları
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
