DROP TABLE IF EXISTS MEMBERSHIP_PERKS CASCADE;
DROP TABLE IF EXISTS TRAINING CASCADE;
DROP TABLE IF EXISTS EQUIPMENT CASCADE;
DROP TABLE IF EXISTS TRAINING_EQUIPMENT CASCADE;
DROP TABLE IF EXISTS MEMBER_MEMBERSHIP CASCADE;
DROP TABLE IF EXISTS SERVICE;
DROP TABLE IF EXISTS ATTENDANCE;
DROP TABLE IF EXISTS REPORT;
DROP TABLE IF EXISTS ADMINISTRATOR;
DROP TABLE IF EXISTS RESERVATION;
DROP TABLE IF EXISTS PERK;
DROP TABLE IF EXISTS PAYMENT;
DROP TABLE IF EXISTS MEMBERSHIP;
DROP TABLE IF EXISTS TRAINER;
DROP TABLE IF EXISTS GYM_MEMBER;
DROP TABLE IF EXISTS APP_USER;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE APP_USER
(
  name VARCHAR(255) NOT NULL,
  date_of_birth DATE NOT NULL,
  user_id UUID DEFAULT gen_random_uuid() NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id),
  UNIQUE (email)
);

CREATE TABLE GYM_MEMBER
(
  join_date DATE NOT NULL,
  member_id UUID NOT NULL,
  PRIMARY KEY (member_id),
  FOREIGN KEY (member_id) REFERENCES APP_USER(user_id)
);

CREATE TABLE TRAINER
(
  trainer_id UUID NOT NULL,
  PRIMARY KEY (trainer_id),
  FOREIGN KEY (trainer_id) REFERENCES APP_USER(user_id)
);

CREATE TABLE MEMBERSHIP
(
  membership_id UUID DEFAULT gen_random_uuid() NOT NULL,
  name VARCHAR(255) NOT NULL,
  duration_in_days INT NOT NULL CHECK (duration_in_days > 0),
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  PRIMARY KEY (membership_id),
  UNIQUE (name)
);

CREATE TABLE PAYMENT
(
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR(32) NOT NULL CHECK (LOWER(status) IN ('pending', 'paid', 'failed', 'cancelled')),
  payment_id UUID DEFAULT gen_random_uuid() NOT NULL,
  user_id UUID NOT NULL,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  PRIMARY KEY (payment_id),
  FOREIGN KEY (user_id) REFERENCES APP_USER(user_id)
);

CREATE TABLE EQUIPMENT
(
  equipment_id UUID DEFAULT gen_random_uuid() NOT NULL,
  hardware_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  manufacturer VARCHAR(255) NOT NULL,
  PRIMARY KEY (equipment_id)
);

CREATE TABLE TRAINING
(
  capacity INT NOT NULL CHECK (capacity >= 1),
  name VARCHAR(255) NOT NULL,
  training_time TIMESTAMPTZ NOT NULL,
  duration_in_minutes INT NOT NULL CHECK (duration_in_minutes > 0),
  training_id UUID DEFAULT gen_random_uuid() NOT NULL,
  trainer_id UUID NOT NULL,
  PRIMARY KEY (training_id),
  FOREIGN KEY (trainer_id) REFERENCES TRAINER(trainer_id)
);

CREATE TABLE PERK
(
  name VARCHAR(255) NOT NULL,
  perk_id UUID DEFAULT gen_random_uuid() NOT NULL,
  PRIMARY KEY (perk_id)
);

CREATE TABLE RESERVATION
(
  reservation_id UUID DEFAULT gen_random_uuid() NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  training_id UUID NOT NULL,
  member_id UUID NOT NULL,
  PRIMARY KEY (reservation_id),
  FOREIGN KEY (training_id) REFERENCES TRAINING(training_id),
  FOREIGN KEY (member_id) REFERENCES GYM_MEMBER(member_id),
  UNIQUE (training_id, member_id)
);

CREATE TABLE ADMINISTRATOR
(
  admin_id UUID NOT NULL,
  PRIMARY KEY (admin_id),
  FOREIGN KEY (admin_id) REFERENCES APP_USER(user_id)
);

CREATE TABLE REPORT
(
  report_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  report_file VARCHAR(255) NOT NULL,
  report_id UUID DEFAULT gen_random_uuid() NOT NULL,
  admin_id UUID NOT NULL,
  PRIMARY KEY (report_id),
  FOREIGN KEY (admin_id) REFERENCES ADMINISTRATOR(admin_id)
);

CREATE TABLE ATTENDANCE
(
  entry_time TIMESTAMPTZ NOT NULL,
  exit_time TIMESTAMPTZ NOT NULL,
  attendance_id UUID DEFAULT gen_random_uuid() NOT NULL,
  member_id UUID NOT NULL,
  PRIMARY KEY (attendance_id),
  FOREIGN KEY (member_id) REFERENCES GYM_MEMBER(member_id),
  CHECK (exit_time >= entry_time)
);

CREATE TABLE SERVICE
(
  service_date DATE NOT NULL,
  service_id UUID DEFAULT gen_random_uuid() NOT NULL,
  description VARCHAR(1023) NOT NULL,
  equipment_id UUID NOT NULL,
  PRIMARY KEY (service_id),
  FOREIGN KEY (equipment_id) REFERENCES EQUIPMENT(equipment_id)
);

CREATE TABLE MEMBER_MEMBERSHIP
(
  status INT NOT NULL CHECK (status IN (0, 1)),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  ownership_id UUID DEFAULT gen_random_uuid() NOT NULL,
  membership_id UUID NOT NULL,
  member_id UUID NOT NULL,
  payment_id UUID NOT NULL,
  PRIMARY KEY (ownership_id),
  FOREIGN KEY (membership_id) REFERENCES MEMBERSHIP(membership_id),
  FOREIGN KEY (member_id) REFERENCES GYM_MEMBER(member_id),
  FOREIGN KEY (payment_id) REFERENCES PAYMENT(payment_id),
  CHECK (end_date >= start_date)
);

CREATE TABLE TRAINING_EQUIPMENT
(
  training_id UUID NOT NULL,
  equipment_id UUID NOT NULL,
  PRIMARY KEY (training_id, equipment_id),
  FOREIGN KEY (training_id) REFERENCES TRAINING(training_id),
  FOREIGN KEY (equipment_id) REFERENCES EQUIPMENT(equipment_id)
);

CREATE TABLE MEMBERSHIP_PERKS
(
  perk_id UUID NOT NULL,
  membership_id UUID NOT NULL,
  PRIMARY KEY (perk_id, membership_id),
  FOREIGN KEY (perk_id) REFERENCES PERK(perk_id),
  FOREIGN KEY (membership_id) REFERENCES MEMBERSHIP(membership_id)
);

CREATE INDEX idx_payment_user_id ON PAYMENT(user_id);
CREATE INDEX idx_training_trainer_id ON TRAINING(trainer_id);
CREATE INDEX idx_reservation_training_id ON RESERVATION(training_id);
CREATE INDEX idx_reservation_member_id ON RESERVATION(member_id);
CREATE INDEX idx_attendance_member_id ON ATTENDANCE(member_id);
CREATE INDEX idx_service_equipment_id ON SERVICE(equipment_id);
CREATE INDEX idx_member_membership_membership_id ON MEMBER_MEMBERSHIP(membership_id);
CREATE INDEX idx_member_membership_member_id ON MEMBER_MEMBERSHIP(member_id);
CREATE INDEX idx_member_membership_payment_id ON MEMBER_MEMBERSHIP(payment_id);
