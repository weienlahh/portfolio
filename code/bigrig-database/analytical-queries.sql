--*****PLEASE ENTER YOUR DETAILS BELOW*****
--T5-brm-select.sql

--Student ID: 36376086
--Student Name: Ng Wei En

/*
    -- Submission Declaration - must not be removed - removal will result in no marks being awarded --
    In submitting this SQL script, I confirm that this is my own work without coding assistance from Generative AI
*/

/* (a) */
-- PLEASE PLACE REQUIRED SQL SELECT STATEMENT FOR THIS PART HERE
-- ENSURE that your query is formatted and has a semicolon
-- (;) at the end of this answer
-- Display customers who requested more than one quote and whose average quote cost
-- is greater than the overall average quote cost.

select c.cust_no as "Customer No",
       case
           when c.cust_bname is not null then
               c.cust_bname
           else
               c.cust_gname
               || ' '
               || c.cust_fname
       end as "Customer Name",
       count(q.quote_no) as "Total Quotes",
       to_char(
           avg(q.quote_cost),
           '$9999.99'
       ) as "Average Quote Cost"
  from customer c
  join quote q
on c.cust_no = q.cust_no
 group by c.cust_no,
          c.cust_bname,
          c.cust_gname,
          c.cust_fname
having count(q.quote_no) > 1
   and avg(q.quote_cost) > (
    select avg(quote_cost)
      from quote
)
 order by avg(q.quote_cost) desc,
          c.cust_no;


/* (b) */
-- PLEASE PLACE REQUIRED SQL SELECT STATEMENT FOR THIS PART HERE
-- ENSURE that your query is formatted and has a semicolon
-- (;) at the end of this answer
select e.emp_no as "Employee No",
       e.emp_gname
       || ' '
       || e.emp_fname as "Employee Name",
       case e.emp_role
           when 'B' then
               'Manager'
           when 'T' then
               'Truck Dispatcher'
           when 'M' then
               'Mechanic'
           when 'D' then
               'Driver'
       end as "Employee Role",
       case
           when m.emp_no is null then
               'No Manager'
           else
               m.emp_gname
               || ' '
               || m.emp_fname
       end as "Manager Name",
       case
           when e.emp_role = 'T' then
               to_char(count(j.job_no))
       end as "Jobs Scheduled"
  from employee e
  left join employee m
on e.emp_no_manager = m.emp_no
  left join job j
on e.emp_no = j.sched_emp_no
 group by e.emp_no,
          e.emp_gname,
          e.emp_fname,
          e.emp_role,
          m.emp_no,
          m.emp_gname,
          m.emp_fname
 order by e.emp_no;


/* (c) */
-- PLEASE PLACE REQUIRED SQL SELECT STATEMENT FOR THIS PART HERE
-- ENSURE that your query is formatted and has a semicolon
-- (;) at the end of this answer
-- Display every truck/trailer combination, usage count, total quoted cost,
-- and usage classification.

select c.truck_vin as truck_vin,
       trk.truck_rego as truck_rego,
       c.trailer_code as trailer_code,
       lpad(
           to_char(
               t.trailer_purchase_cost,
               'FM$999G999G990D00'
           ),
           21
       ) as trailer_purchase_cost,
       count(j.job_no) as num_jobs,
       case
           when count(j.job_no) = 0 then
               lpad(
                   'No jobs',
                   17
               )
           else
               lpad(
                   to_char(
                       sum(q.quote_cost),
                       'FM$999G999G990D00'
                   ),
                   17
               )
       end as total_quoted_cost,
       case
           when count(j.job_no) = 0 then
               'Never Used'
           when count(j.job_no) > (
               select avg(count(*))
                 from job
                group by truck_vin,
                         trailer_code
           )                   then
               'High Use'
           else
               'Standard Use'
       end as "USAGE"
  from combination c
  join truck trk
on c.truck_vin = trk.truck_vin
  join trailer t
on c.trailer_code = t.trailer_code
  left join job j
on c.truck_vin = j.truck_vin
   and c.trailer_code = j.trailer_code
  left join quote q
on j.quote_no = q.quote_no
 group by c.truck_vin,
          trk.truck_rego,
          c.trailer_code,
          t.trailer_purchase_cost
 order by count(j.job_no) desc,
          c.truck_vin,
          c.trailer_code;