<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Supabase Project
    |--------------------------------------------------------------------------
    |
    | Used for Supabase REST API, Storage, Realtime, etc.
    | Find these in: Supabase Dashboard → Project Settings → API
    |
    */

    'url' => env('SUPABASE_URL'),

    'anon_key' => env('SUPABASE_ANON_KEY'),

    'service_role_key' => env('SUPABASE_SERVICE_ROLE_KEY'),

];
