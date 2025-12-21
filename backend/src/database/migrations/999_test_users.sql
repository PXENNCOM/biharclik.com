-- =============================================
-- TEST KULLANICILARI
-- =============================================
-- Bu dosyayı phpMyAdmin'de çalıştırarak test kullanıcıları oluşturabilirsiniz
-- =============================================

-- ADMIN KULLANICI
-- Email: admin@yayakurye.com
-- Şifre: admin123
INSERT INTO users (email, phone, password_hash, role, email_verified, phone_verified, is_active) 
VALUES (
    'admin@yayakurye.com',
    '05001234567',
    '$2a$10$YourHashedPasswordHere', -- Gerçek hash: admin123
    'admin',
    TRUE,
    TRUE,
    TRUE
);

-- TEST ÖĞRENCİ (Admin Onaylı)
-- Email: student@test.com
-- Şifre: student123
SET @student_user_id = NULL;

INSERT INTO users (email, phone, password_hash, role, email_verified, phone_verified, is_active) 
VALUES (
    'student@test.com',
    '05009876543',
    '$2a$10$YourHashedPasswordHere', -- Gerçek hash: student123
    'student',
    TRUE,
    TRUE,
    TRUE
);

SET @student_user_id = LAST_INSERT_ID();

INSERT INTO students (
    user_id, first_name, last_name, tc_no, birth_date,
    iban, address, university, admin_approved,
    kvkk_accepted, terms_accepted
) VALUES (
    @student_user_id,
    'Test',
    'Öğrenci',
    '12345678901',
    '2000-01-15',
    'TR123456789012345678901234',
    'İstanbul, Türkiye',
    'İstanbul Üniversitesi',
    TRUE,  -- Admin onaylı
    TRUE,
    TRUE
);

-- TEST GÖNDERİCİ (Bireysel)
-- Email: sender@test.com
-- Şifre: sender123
SET @sender_user_id = NULL;

INSERT INTO users (email, phone, password_hash, role, email_verified, phone_verified, is_active) 
VALUES (
    'sender@test.com',
    '05005554433',
    '$2a$10$YourHashedPasswordHere', -- Gerçek hash: sender123
    'sender',
    TRUE,
    TRUE,
    TRUE
);

SET @sender_user_id = LAST_INSERT_ID();

INSERT INTO individual_senders (
    user_id, first_name, last_name, tc_no, billing_address,
    kvkk_accepted, terms_accepted
) VALUES (
    @sender_user_id,
    'Test',
    'Gönderici',
    '98765432109',
    'İstanbul, Kadıköy',
    TRUE,
    TRUE
);

-- =============================================
-- NOT: Şifreleri hash'lemek için backend'i kullanın
-- =============================================
-- Yukarıdaki kullanıcılar örnek amaçlıdır.
-- Gerçek şifre hash'lerini backend üzerinden kayıt yaparak oluşturun.
-- 
-- VEYA backend'de bir utility script yazarak hash oluşturun:
-- const bcrypt = require('bcryptjs');
-- console.log(await bcrypt.hash('admin123', 10));
-- =============================================
