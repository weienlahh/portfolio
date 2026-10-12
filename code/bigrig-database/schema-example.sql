--*****PLEASE ENTER YOUR DETAILS BELOW*****
--T1-brm-schema.sql

--Student ID: 36376086
--Student Name: Ng Wei En

/*
    -- Submission Declaration - must not be removed - removal will result in no marks being awarded --
    In submitting this SQL script, I confirm that this is my own work without coding assistance from Generative AI
*/


/* drop table statements - do not remove*/

drop table employee cascade constraints purge;

drop table job cascade constraints purge;

drop table quote cascade constraints purge;

-- Task 1 Add Create table statements for the Missing TABLES below
-- Ensure all column comments, and constraints (other than FK's)
-- are included. FK constraints are to be added at the end of this script

-- EMPLOYEE
create table employee (
    emp_no         number(3) not null,
    emp_gname      varchar2(30),
    emp_fname      varchar2(30),
    emp_contact_no char(10) not null,
    emp_licenceno  varchar2(11),
    emp_role       char(1) not null,
    emp_no_manager number(3)
);

comment on column employee.emp_no is
    'Employee number';

comment on column employee.emp_gname is
    'Employee given name';

comment on column employee.emp_fname is
    'Employee family name';

comment on column employee.emp_contact_no is
    'Employee contact number';

comment on column employee.emp_licenceno is
    'Employee licence number (only for drivers)';

comment on column employee.emp_role is
    'Employee role - Manager (B), Truck Dispatcher (T),
Mechanic (M), or Driver (D)';

comment on column employee.emp_no_manager is
    'Employee manager number';

alter table employee add constraint employee_pk primary key ( emp_no );

alter table employee add constraint employee_contact_no_uq unique ( emp_contact_no );

alter table employee add constraint employee_licenceno_uq unique ( emp_licenceno );

alter table employee
    add constraint employee_role_ck
        check ( emp_role in ( 'B',
                              'T',
                              'M',
                              'D' ) );

alter table employee
    add constraint employee_driver_lic_chk
        check ( ( emp_role = 'D'
           and emp_licenceno is not null )
            or ( emp_role != 'D'
           and emp_licenceno is null ) );


-- JOB
create table job (
    job_no                  number(5) not null,
    job_pickup_dt           date not null,
    job_intended_dropoff_dt date not null,
    job_cost                number(6,2),
    job_payment_made        char(1) not null,
    quote_no                number(5) not null,
    sched_emp_no            number(3) not null,
    driver_emp_no           number(3) not null,
    trailer_code            char(5) not null,
    truck_vin               char(17) not null
);

comment on column job.job_no is
    'Job number';

comment on column job.job_pickup_dt is
    'Job scheduled pickup date and time';

comment on column job.job_intended_dropoff_dt is
    'Job intended drop-off date and time';

comment on column job.job_cost is
    'Actual job cost (if different from the quote cost)';

comment on column job.job_payment_made is
    'Flag to note whether the job has been paid (Y or N)';

comment on column job.quote_no is
    'Quote number';

comment on column job.sched_emp_no is
    'Employee number of truck dispatcher who scheduled the job';

comment on column job.driver_emp_no is
    'Employee number of driver assigned to the job';

comment on column job.trailer_code is
    'Identifier for trailer';

comment on column job.truck_vin is
    'Vehicle Indentification Number (VIN) of truck';

alter table job add constraint job_pk primary key ( job_no );

alter table job
    add constraint job_payment_made_chk check ( job_payment_made in ( 'Y',
                                                                      'N' ) );

alter table job
    add constraint job_cost_ck check ( job_cost is null
        or job_cost > 0 );

alter table job add constraint job_dropoff_dt_ck check ( job_intended_dropoff_dt > job_pickup_dt
);


-- QUOTE
create table quote (
    quote_no              number(5) not null,
    quote_prepared_date   date not null,
    quote_pref_start_date date not null,
    quote_start_location  varchar2(50) not null,
    quote_end_location    varchar2(60) not null,
    quote_cost            number(6,2) not null,
    cust_no               number(4) not null,
    emp_no                number(3) not null
);

comment on column quote.quote_no is
    'Quote number';

comment on column quote.quote_prepared_date is
    'Date the quote was prepared';

comment on column quote.quote_pref_start_date is
    'Preferred start date for the quote';

comment on column quote.quote_start_location is
    'Start location for the quote';

comment on column quote.quote_end_location is
    'End location (destination) for the quote';

comment on column quote.quote_cost is
    'Quoted cost';

comment on column quote.cust_no is
    'Identifier for customer';

comment on column quote.emp_no is
    'Employee number of truck dispatcher who prepared the quote';

alter table quote add constraint quote_pk primary key ( quote_no );

alter table quote add constraint quote_cost_ck check ( quote_cost > 0 );

alter table quote add constraint quote_date_ck check ( quote_pref_start_date >= quote_prepared_date
);


-- Add all missing FK Constraints below here
alter table employee
    add constraint employee_manager_fk foreign key ( emp_no_manager )
        references employee ( emp_no );

alter table job
    add constraint quote_job_fk foreign key ( quote_no )
        references quote ( quote_no );

alter table job
    add constraint employee_sched_job_fk foreign key ( sched_emp_no )
        references employee ( emp_no );

alter table job
    add constraint employee_driver_job_fk foreign key ( driver_emp_no )
        references employee ( emp_no );

alter table job
    add constraint trailer_job_fk foreign key ( trailer_code )
        references trailer ( trailer_code );

alter table job
    add constraint truck_job_fk foreign key ( truck_vin )
        references truck ( truck_vin );

alter table quote
    add constraint customer_quote_fk foreign key ( cust_no )
        references customer ( cust_no );

alter table quote
    add constraint employee_quote_fk foreign key ( emp_no )
        references employee ( emp_no );