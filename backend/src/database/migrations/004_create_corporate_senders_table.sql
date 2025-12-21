-- Kurumsal gönderici detayları
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
