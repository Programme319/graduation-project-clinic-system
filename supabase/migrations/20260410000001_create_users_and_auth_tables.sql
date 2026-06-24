-- Laravel users, password reset, and sessions tables

create table if not exists public.users (
    id bigserial primary key,
    name varchar(255) not null,
    email varchar(255) not null unique,
    email_verified_at timestamp null,
    password varchar(255) not null,
    remember_token varchar(100) null,
    created_at timestamp null,
    updated_at timestamp null
);

create table if not exists public.password_reset_tokens (
    email varchar(255) primary key,
    token varchar(255) not null,
    created_at timestamp null
);

create table if not exists public.sessions (
    id varchar(255) primary key,
    user_id bigint null references public.users (id) on delete set null,
    ip_address varchar(45) null,
    user_agent text null,
    payload text not null,
    last_activity integer not null
);

create index if not exists sessions_user_id_index on public.sessions (user_id);
create index if not exists sessions_last_activity_index on public.sessions (last_activity);
