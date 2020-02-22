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
);

INSERT INTO companies(
    handle,
    name,
    num_employees,
    description,
    logo_url
)
VALUES(
    'handle1',
    'name1',
    10,
    'description1',
    'logo.com1'
);

INSERT INTO companies(
    handle,
    name,
    num_employees,
    description,
    logo_url
)
VALUES(
    'handle2',
    'name2',
    20,
    'description2',
    'logo.com2'
);

INSERT INTO jobs(
    title,
    salary,
    equity,
    company_handle
)
VALUES(
    'title1',
    100,
    0.1,
    'handle1'
);

INSERT INTO jobs(
    title,
    salary,
    equity,
    company_handle
)
VALUES(
    'title2',
    200,
    0.2,
    'handle2'
);

INSERT INTO users (
    username,
    password,
    first_name,
    last_name,
    email
)
VALUES(
    'user1',
    'password1',
    'first1',
    'last1',
    'email1'
);

INSERT INTO users (
    username,
    password,
    first_name,
    last_name,
    email
)
VALUES(
    'user2',
    'password2',
    'first2',
    'last2',
    'email2'
);


