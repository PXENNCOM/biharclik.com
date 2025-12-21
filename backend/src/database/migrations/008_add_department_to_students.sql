-- =============================================
-- STUDENTS TABLOSUNA BÖLÜM KOLONU EKLE
-- =============================================

ALTER TABLE students 
ADD COLUMN department VARCHAR(255) NULL COMMENT 'Öğrencinin bölümü' AFTER university;

-- Mevcut kayıtlar için varsayılan değer
UPDATE students SET department = 'Belirtilmemiş' WHERE department IS NULL;

-- Artık zorunlu yap
ALTER TABLE students 
MODIFY COLUMN department VARCHAR(255) NOT NULL;
