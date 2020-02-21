CREATE TABLE companies (
    handle text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    num_employees integer,
    description text,
    logo_url text 
);

CREATE TABLE jobs (
   id SERIAL PRIMARY KEY,
   title text NOT NULL,
   salary REAL NOT NULL,
   equity REAL NOT NULL,
   constraint equity_range_check
        check(equity >= 0 and equity <= 1),
   company_handle text REFERENCES companies ON DELETE CASCADE,
   date_posted timestamp with time zone 
);

CREATE TABLE users (
    username text PRIMARY KEY,
    password text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE,
    photo_url text,
    is_admin boolean NOT NULL DEFAULT 'false'
)