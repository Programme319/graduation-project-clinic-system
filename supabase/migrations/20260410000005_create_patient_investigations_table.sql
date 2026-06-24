-- Patient medical investigations

create table if not exists public.patient_investigations (
    id bigserial primary key,
    patient_id bigint not null references public.patients (id) on delete cascade,
    test_code varchar(255) not null,
    test_name varchar(255) not null,
    test_result varchar(255) null,
    created_at timestamp null,
    updated_at timestamp null
);

create index if not exists patient_investigations_patient_id_index
    on public.patient_investigations (patient_id);
