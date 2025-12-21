-- =============================================
-- DELIVERIES TABLOSU - Teslimat İşleri
-- =============================================

CREATE TABLE IF NOT EXISTS deliveries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(20) UNIQUE NOT NULL,
    
    -- Gönderici bilgileri
    sender_user_id INT NOT NULL,
    
    -- Alış adresi (nereden alınacak)
    pickup_address TEXT NOT NULL,
    pickup_district VARCHAR(50) NOT NULL,
    pickup_contact_name VARCHAR(100) NOT NULL,
    pickup_contact_phone VARCHAR(20) NOT NULL,
    pickup_notes TEXT,
    
    -- Teslimat adresi (nereye götürülecek)
    delivery_address TEXT NOT NULL,
    delivery_district VARCHAR(50) NOT NULL,
    delivery_contact_name VARCHAR(100) NOT NULL,
    delivery_contact_phone VARCHAR(20) NOT NULL,
    delivery_notes TEXT,
    
    -- Paket bilgileri
    package_description TEXT NOT NULL,
    package_size ENUM('small', 'medium', 'large') NOT NULL COMMENT 'Küçük/Orta/Büyük - Sırt çantasına sığmalı',
    
    -- Harçlık (Gönderici belirler: 30-200 TL arası)
    payment_amount DECIMAL(10,2) NOT NULL,
    
    -- Öğrenci kurye (iş kabul edilince doldurulur)
    student_user_id INT NULL,
    accepted_at TIMESTAMP NULL,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    cancelled_at TIMESTAMP NULL,
    cancellation_reason TEXT NULL,
    
    -- Durum takibi
    status ENUM('pending', 'accepted', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    
    -- Manuel ödeme yönetimi (Admin için)
    payment_status ENUM('waiting', 'sender_paid', 'student_paid', 'completed') DEFAULT 'waiting',
    sender_payment_proof_url VARCHAR(500) NULL COMMENT 'Gönderici ödeme dekontu',
    sender_paid_at TIMESTAMP NULL,
    student_payment_proof_url VARCHAR(500) NULL COMMENT 'Öğrenciye ödeme dekontu',
    student_paid_at TIMESTAMP NULL,
    admin_notes TEXT NULL COMMENT 'Admin notları (WhatsApp geçmişi vs)',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (sender_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (student_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    
    INDEX idx_status (status),
    INDEX idx_payment_status (payment_status),
    INDEX idx_sender (sender_user_id),
    INDEX idx_student (student_user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_pickup_district (pickup_district),
    INDEX idx_delivery_district (delivery_district),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Sipariş numarası için otomatik artış
-- =============================================
-- Format: YYK-XXXXX (Yaya Kurye - 5 haneli numara)
-- Örnek: YYK-00001, YYK-00002, vb.
