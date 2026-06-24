-- Laravel queue / job tables

create table if not exists public.jobs (
    id bigserial primary key,
    queue varchar(255) not null,
    payload text not null,
    attempts smallint not null,
    reserved_at integer null,
    available_at integer not null,
    created_at integer not null
);

create index if not exists jobs_queue_index on public.jobs (queue);

create table if not exists public.job_batches (
    id varchar(255) primary key,
    name varchar(255) not null,
    total_jobs integer not null,
    pending_jobs integer not null,
    failed_jobs integer not null,
    failed_job_ids text not null,
    options text null,
    cancelled_at integer null,
    created_at integer not null,
    finished_at integer null
);

create table if not exists public.failed_jobs (
    id bigserial primary key,
    uuid varchar(255) not null unique,
    connection text not null,
    queue text not null,
    payload text not null,
    exception text not null,
    failed_at timestamp not null default current_timestamp
);
