-- Patient medications

create table if not exists public.patient_medications (
    id bigserial primary key,
    patient_id bigint not null references public.patients (id) on delete cascade,
    med_code varchar(255) not null,
    med_name varchar(255) not null,
    dosage varchar(255) not null,
    created_at timestamp null,
    updated_at timestamp null
);

create index if not exists patient_medications_patient_id_index
    on public.patient_medications (patient_id);
