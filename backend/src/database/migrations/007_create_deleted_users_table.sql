-- =============================================
-- DELETED USERS TABLOSU
-- =============================================
-- Silinen kullanıcıların email ve telefonlarını blacklist için saklıyoruz
-- Böylece aynı email/telefon ile tekrar kayıt olunamaz

CREATE TABLE IF NOT EXISTS deleted_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    original_email VARCHAR(255) NOT NULL,
    original_phone VARCHAR(20) NOT NULL,
    deletion_reason TEXT,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_by INT NULL COMMENT 'Admin user id',
    
    INDEX idx_email (original_email),
    INDEX idx_phone (original_phone),
    INDEX idx_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
