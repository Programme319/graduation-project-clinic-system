-- Laravel cache tables

create table if not exists public.cache (
    key varchar(255) primary key,
    value text not null,
    expiration integer not null
);

create index if not exists cache_expiration_index on public.cache (expiration);

create table if not exists public.cache_locks (
    key varchar(255) primary key,
    owner varchar(255) not null,
    expiration integer not null
);

create index if not exists cache_locks_expiration_index on public.cache_locks (expiration);
