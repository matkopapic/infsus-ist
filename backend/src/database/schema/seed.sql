ROLLBACK;
BEGIN;

INSERT INTO APP_USER (name, date_of_birth, email, created_at) VALUES
('Admin User', '1985-01-01', 'admin@gym.com', NOW()),
('John Trainer', '1990-05-10', 'john.trainer@gym.com', NOW()),
('Sarah Trainer', '1992-08-20', 'sarah.trainer@gym.com', NOW()),
('Mike Member', '2000-03-15', 'mike@gym.com', NOW()),
('Anna Member', '1998-07-22', 'anna@gym.com', NOW()),
('Tom Member', '1995-11-30', 'tom@gym.com', NOW()),
('Lisa Member', '2001-02-18', 'lisa@gym.com', NOW());

INSERT INTO ADMINISTRATOR (admin_id)
SELECT user_id FROM APP_USER WHERE email = 'admin@gym.com';

INSERT INTO TRAINER (trainer_id)
SELECT user_id FROM APP_USER
WHERE email IN ('john.trainer@gym.com', 'sarah.trainer@gym.com');

INSERT INTO GYM_MEMBER (member_id, join_date)
SELECT user_id, '2024-01-01' FROM APP_USER WHERE email = 'mike@gym.com';

INSERT INTO GYM_MEMBER (member_id, join_date)
SELECT user_id, '2024-02-01' FROM APP_USER WHERE email = 'anna@gym.com';

INSERT INTO GYM_MEMBER (member_id, join_date)
SELECT user_id, '2024-03-01' FROM APP_USER WHERE email = 'tom@gym.com';

INSERT INTO GYM_MEMBER (member_id, join_date)
SELECT user_id, '2024-04-01' FROM APP_USER WHERE email = 'lisa@gym.com';

INSERT INTO MEMBERSHIP (name, duration_in_days, price) VALUES
('Standard 1 month', 30, 30.0),
('Standard 1 year', 365, 270.0);

INSERT INTO PAYMENT (created_at, status, amount, user_id)
SELECT NOW(), 'paid', m.price, u.user_id
FROM MEMBERSHIP m, APP_USER u
WHERE m.name = 'Standard 1 month' AND u.email = 'mike@gym.com';

INSERT INTO PAYMENT (created_at, status, amount, user_id)
SELECT NOW(), 'paid', m.price, u.user_id
FROM MEMBERSHIP m, APP_USER u
WHERE m.name = 'Standard 1 year' AND u.email = 'anna@gym.com';

INSERT INTO MEMBER_MEMBERSHIP (membership_id, member_id, status, start_date, end_date, payment_id)
SELECT m.membership_id, u.user_id, 1, DATE '2024-01-01', DATE '2024-02-01', p.payment_id
FROM MEMBERSHIP m, APP_USER u, PAYMENT p
WHERE m.name = 'Standard 1 month' AND u.email = 'mike@gym.com' AND p.user_id = u.user_id;

INSERT INTO MEMBER_MEMBERSHIP (membership_id, member_id, status, start_date, end_date, payment_id)
SELECT m.membership_id, u.user_id, 1, CURRENT_DATE - 15, CURRENT_DATE + 350, p.payment_id
FROM MEMBERSHIP m, APP_USER u, PAYMENT p
WHERE m.name = 'Standard 1 year' AND u.email = 'anna@gym.com' AND p.user_id = u.user_id;

INSERT INTO EQUIPMENT (name, manufacturer, hardware_id) VALUES
('Treadmill', 'Technogym', '5001'),
('Treadmill', 'Technogym', '5002'),
('Treadmill', 'Technogym', '5003'),
('Treadmill', 'Technogym', '5004'),
('Rowing machine', 'Virtuagym', '5103'),
('Bench Press', 'Life Fitness', '2000');

INSERT INTO TRAINING (capacity, name, training_time, duration_in_minutes, trainer_id)
SELECT 
    6,
    'Group cardio workout',
    date_trunc('day', NOW()) + INTERVAL '1 day' + INTERVAL '15 hours',
    60,
    user_id
FROM APP_USER
WHERE email = 'john.trainer@gym.com';

INSERT INTO TRAINING (capacity, name, training_time, duration_in_minutes, trainer_id)
SELECT 
    10,
    'Group intensity training',
    date_trunc('day', NOW()) + INTERVAL '1 day' + INTERVAL '18 hours',
    90,
    user_id
FROM APP_USER
WHERE email = 'sarah.trainer@gym.com';

INSERT INTO TRAINING_EQUIPMENT (training_id, equipment_id)
SELECT t.training_id, e.equipment_id
FROM TRAINING t, EQUIPMENT e
WHERE e.name = 'Treadmill'
LIMIT 2;

INSERT INTO TRAINING_EQUIPMENT (training_id, equipment_id)
SELECT t.training_id, e.equipment_id
FROM TRAINING t, EQUIPMENT e
WHERE e.name = 'Bench Press' AND t.capacity > 8
LIMIT 1;

INSERT INTO RESERVATION (training_id, member_id)
SELECT t.training_id, u.user_id
FROM TRAINING t, APP_USER u
WHERE u.email = 'mike@gym.com'
LIMIT 1;

INSERT INTO RESERVATION (training_id, member_id)
SELECT t.training_id, u.user_id
FROM TRAINING t, APP_USER u
WHERE u.email = 'anna@gym.com'
LIMIT 1;

INSERT INTO ATTENDANCE (member_id, entry_time, exit_time)
SELECT user_id, NOW() - INTERVAL '2 hours', NOW()
FROM APP_USER WHERE email = 'mike@gym.com';

INSERT INTO ATTENDANCE (member_id, entry_time, exit_time)
SELECT user_id, NOW() - INTERVAL '1 hour', NOW()
FROM APP_USER WHERE email = 'anna@gym.com';

INSERT INTO PERK (name) VALUES
('Free Drinks'),
('Sauna Access');

INSERT INTO MEMBERSHIP_PERKS (perk_id, membership_id)
SELECT p.perk_id, m.membership_id
FROM PERK p, MEMBERSHIP m
WHERE p.name = 'Free Drinks' AND m.name = 'Standard 1 month';

INSERT INTO MEMBERSHIP_PERKS (perk_id, membership_id)
SELECT p.perk_id, m.membership_id
FROM PERK p, MEMBERSHIP m
WHERE p.name = 'Free Drinks' AND m.name = 'Standard 1 year';

INSERT INTO REPORT (report_time, report_file, admin_id)
SELECT NOW(), 'monthly_report.pdf', user_id
FROM APP_USER WHERE email = 'admin@gym.com';

INSERT INTO SERVICE (service_date, description, equipment_id)
SELECT '2025-01-01', 'Routine maintenance', equipment_id
FROM EQUIPMENT WHERE name = 'Treadmill';

COMMIT;
