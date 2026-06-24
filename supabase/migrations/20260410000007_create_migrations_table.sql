-- Laravel migration tracking table (used when running php artisan migrate against Supabase)

create table if not exists public.migrations (
    id serial primary key,
    migration varchar(255) not null,
    batch integer not null
);
