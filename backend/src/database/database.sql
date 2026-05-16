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
  created_at TIMESTAMP NOT NULL,
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
  duration INTERVAL NOT NULL,
  price FLOAT NOT NULL,
  PRIMARY KEY (membership_id)
);

CREATE TABLE PAYMENT
(
  created_at TIMESTAMP NOT NULL,
  status VARCHAR(255) NOT NULL,
  payment_id UUID DEFAULT gen_random_uuid() NOT NULL,
  user_id UUID NOT NULL,
  amount FLOAT NOT NULL,
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
  capacity INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  training_time TIMESTAMP NOT NULL,
  duration INTERVAL NOT NULL,
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
  training_id UUID NOT NULL,
  member_id UUID NOT NULL,
  PRIMARY KEY (reservation_id),
  FOREIGN KEY (training_id) REFERENCES TRAINING(training_id),
  FOREIGN KEY (member_id) REFERENCES GYM_MEMBER(member_id)
);

CREATE TABLE ADMINISTRATOR
(
  admin_id UUID NOT NULL,
  PRIMARY KEY (admin_id),
  FOREIGN KEY (admin_id) REFERENCES APP_USER(user_id)
);

CREATE TABLE REPORT
(
  report_time TIMESTAMP NOT NULL,
  report_file VARCHAR(255) NOT NULL,
  report_id UUID DEFAULT gen_random_uuid() NOT NULL,
  admin_id UUID NOT NULL,
  PRIMARY KEY (report_id),
  FOREIGN KEY (admin_id) REFERENCES ADMINISTRATOR(admin_id)
);

CREATE TABLE ATTENDANCE
(
  entry_time TIMESTAMP NOT NULL,
  exit_time TIMESTAMP NOT NULL,
  attendance_id UUID DEFAULT gen_random_uuid() NOT NULL,
  member_id UUID NOT NULL,
  PRIMARY KEY (attendance_id),
  FOREIGN KEY (member_id) REFERENCES GYM_MEMBER(member_id)
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
  status INT NOT NULL,
  start_date INT NOT NULL,
  end_date INT NOT NULL,
  ownership_id UUID DEFAULT gen_random_uuid() NOT NULL,
  membership_id UUID NOT NULL,
  member_id UUID NOT NULL,
  payment_id UUID NOT NULL,
  PRIMARY KEY (ownership_id),
  FOREIGN KEY (membership_id) REFERENCES MEMBERSHIP(membership_id),
  FOREIGN KEY (member_id) REFERENCES GYM_MEMBER(member_id),
  FOREIGN KEY (payment_id) REFERENCES PAYMENT(payment_id)
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