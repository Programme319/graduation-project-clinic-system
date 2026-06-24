-- Clinic patients table

create table if not exists public.patients (
    id bigserial primary key,
    full_name varchar(255) not null,
    national_id varchar(14) not null unique,
    age integer not null,
    clinic_code varchar(255) null,
    complaint text null,
    diagnosis_text text null,
    doctor_name varchar(255) null,
    pharmacist_name varchar(255) null,
    created_at timestamp null,
    updated_at timestamp null
);
