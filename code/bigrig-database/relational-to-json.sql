/*****PLEASE ENTER YOUR DETAILS BELOW*****/
--T6-brm-json.sql

--Student ID:36376086
--Student Name: Ng Wei En

/*
    -- Submission Declaration - must not be removed - removal will result in no marks being awarded --
    In submitting this SQL script, I confirm that this is my own work without coding assistance from Generative AI
*/

-- PLEASE PLACE REQUIRED SQL SELECT STATEMENT FOR THIS PART HERE
-- ENSURE that your query is formatted and has a semicolon
-- (;) at the end of this answer
   SET PAGESIZE 100
SET WRAP OFF
SET HEADING OFF

-- Generate one JSON document per customer, including customer statistics
-- and all quotes made by that customer.

select
    json_object(
        '_id' value c.cust_no,
                'customer_name' value
            case
                when c.cust_gname is not null
                   and c.cust_fname is not null then
                    c.cust_gname
                    || ' '
                    || c.cust_fname
                when c.cust_gname is not null then
                    c.cust_gname
                else
                    c.cust_fname
            end,
                'customer_business' value nvl(
            c.cust_bname,
            '-'
        ),
                'customer_address' value c.cust_street
                                         || ', '
                                         || c.cust_town
                                         || ', '
                                         || c.cust_pcode,
                'customer_phone' value c.cust_contact_no,
                'customer_stats' value
            json_object(
                'number_of_quotes' value count(q.quote_no),
                        'number_of_jobs' value count(j.job_no),
                        'total_paid_jobcost' value nvl(
                    to_char(
                        sum(
                            case
                                when j.job_payment_made = 'Y' then
                                    nvl(
                                        j.job_cost,
                                        q.quote_cost
                                    )
                            end
                        ),
                        'FM$999G999G990D00'
                    ),
                    '-'
                ),
                        'total_unpaid_jobcost' value nvl(
                    to_char(
                        sum(
                            case
                                when j.job_payment_made = 'N' then
                                    nvl(
                                        j.job_cost,
                                        q.quote_cost
                                    )
                            end
                        ),
                        'FM$999G999G990D00'
                    ),
                    '-'
                )
            ),
                'quotes' value json_arrayagg(
            json_object(
                'quote_no' value q.quote_no,
                        'quote_prepared_on' value to_char(
                    q.quote_prepared_date,
                    'dd-Mon-yyyy'
                ),
                        'preferred_start_date' value to_char(
                    q.quote_pref_start_date,
                    'dd-Mon-yyyy'
                ),
                        'start_location' value q.quote_start_location,
                        'end_location' value q.quote_end_location,
                        'quote_cost' value to_char(
                    q.quote_cost,
                    'FM$999G999G990D00'
                ),
                        'assigned_to_job' value q.quote_assigned_job,
                        'job_cost' value
                    case
                        when j.job_no is null then
                            '-'
                        else
                            to_char(
                                nvl(
                                    j.job_cost,
                                    q.quote_cost
                                ),
                                'FM$999G999G990D00'
                            )
                    end
            )
         order by q.quote_no)
    )
  from customer c
  join quote q
on c.cust_no = q.cust_no
  left join job j
on q.quote_no = j.quote_no
 group by c.cust_no,
          c.cust_gname,
          c.cust_fname,
          c.cust_bname,
          c.cust_street,
          c.cust_town,
          c.cust_pcode,
          c.cust_contact_no
 order by c.cust_no;