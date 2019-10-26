
-- Drop table

-- DROP TABLE public.templates;

CREATE TABLE public.templates (
	id serial NOT NULL,
	"name" varchar(50) NOT NULL,
	CONSTRAINT templates_name_key UNIQUE (name),
	CONSTRAINT templates_pkey PRIMARY KEY (id)
);

-- Drop table

-- DROP TABLE public.transaction_types;

CREATE TABLE public.transaction_types (
	id int2 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	"name" varchar(20) NOT NULL,
	CONSTRAINT transactiontypes_pk PRIMARY KEY (id),
	CONSTRAINT transactiontypes_un UNIQUE (name)
);

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	first_name varchar(20) NOT NULL,
	last_name varchar(30) NOT NULL,
	email varchar(50) NULL,
	id int2 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	is_guest bool NOT NULL DEFAULT false,
	in_activity_date Date NULL DEFAULT,
	CONSTRAINT users_first_name_last_name_key UNIQUE (first_name, last_name),
	CONSTRAINT users_un UNIQUE (id)
);

-- Drop table

-- DROP TABLE public.templates_settings;

CREATE TABLE public.templates_settings (
	template_id int4 NOT NULL,
	transaction_type_id int4 NOT NULL,
	CONSTRAINT templates_settings_pkey PRIMARY KEY (template_id, transaction_type_id),
	CONSTRAINT templates_settings_template_id_fkey FOREIGN KEY (template_id) REFERENCES templates(id),
	CONSTRAINT templates_settings_transaction_type_id_fkey FOREIGN KEY (transaction_type_id) REFERENCES transaction_types(id)
);

-- Drop table

-- DROP TABLE public.transactions;

CREATE TABLE public.transactions (
	id int4 NOT NULL GENERATED ALWAYS AS IDENTITY,
	user_id int2 NOT NULL,
	type_id int2 NOT NULL,
	exec_date date NOT NULL,
	comment varchar(50) NULL,
	amount numeric(10,2) NOT NULL,
	CONSTRAINT transactions_pkey PRIMARY KEY (id),
	CONSTRAINT transactions_type_id_fkey FOREIGN KEY (type_id) REFERENCES transaction_types(id),
	CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE INDEX transactions_exec_date_idx ON public.transactions USING btree (exec_date);


--reports function
CREATE OR REPLACE FUNCTION public.get_transactions_reports(fromdate date, todate date)
 RETURNS TABLE(user_id smallint, type_name character varying, exec_date date, amount numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
DROP TABLE IF EXISTS user_balances;
CREATE TEMP TABLE user_balances AS
select 
	t.user_id,
	'העברת יתרה'::varchar(20) as type_name,
	fromDate as exec_date,
	sum(t.amount) as amount
from transactions t join users u on u.Id=t.user_id
where t.exec_date < fromDate and (u.in_activity_date is null or u.in_activity_date > fromDate)
group by t.user_id;

DROP TABLE IF EXISTS user_transactions;
CREATE TEMP TABLE user_transactions AS
select 
t.user_id,
tt."name" as type_name,
t.exec_date,
t.amount
from transactions t 
join transaction_types tt 
on tt.id=t.type_id 
where t.exec_date>=fromDate and t.exec_date < toDate;

RETURN QUERY SELECT b.user_id,b.type_name,b.exec_date,b.amount
from user_balances b 
union 
select t.user_id,t.type_name,t.exec_date,t.amount from user_transactions t
union 
(select totals.user_id,
	'closingBalance'::varchar(20) as type_name,
	toDate as exec_date,
	sum(totals.amount) as amount from (select ub.user_id,ub.amount from user_balances ub union SELECT uti.user_id,uti.amount from user_transactions uti) as totals
	group by totals.user_id)
order by user_id,exec_date asc;

END
$function$
;
