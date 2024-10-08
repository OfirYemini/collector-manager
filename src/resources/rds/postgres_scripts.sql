
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
	"name" varchar(30) NOT NULL,
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
	in_activity_date Date NULL,
	CONSTRAINT users_first_name_last_name_key UNIQUE (first_name, last_name),
	CONSTRAINT users_un UNIQUE (id)
);

-- Drop table

-- DROP TABLE public.templates_settings;

CREATE TABLE public.templates_settings (
	id int2 NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	template_id int4 NOT NULL,
	transaction_type_id int4 NOT NULL,
	CONSTRAINT templates_settings_id PRIMARY KEY (id),
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
 RETURNS TABLE(id integer, user_id smallint, type_name character varying, exec_date date, comment character varying, amount numeric)
 LANGUAGE plpgsql
AS $function$
BEGIN
DROP TABLE IF EXISTS user_balances;
CREATE TEMP TABLE user_balances AS
select 
	t.user_id,
	'העברת יתרה'::varchar(20) as type_name,
	fromDate as exec_date,
	sum(t.amount) as amount,
	EXISTS (
            SELECT 1 
            FROM transactions t2 
            WHERE t2.user_id = t.user_id 
              AND t2.exec_date >= fromDate 
              AND t2.exec_date < toDate
        ) AS has_active_transactions
from transactions t join users u on u.Id=t.user_id
where t.exec_date < fromDate 
group by t.user_id;

DROP TABLE IF EXISTS user_transactions;
CREATE TEMP TABLE user_transactions AS
select 
t.id,
t.user_id,
tt."name" as type_name,
t.exec_date,
t."comment",
t.amount
from transactions t 
join transaction_types tt 
on tt.id=t.type_id 
where t.exec_date>=fromDate and t.exec_date < toDate;

RETURN QUERY SELECT 1 as id,b.user_id,b.type_name,b.exec_date,b.type_name as comment, b.amount
from user_balances b 
where b.has_active_transactions = true or b.amount < 0
union 
select t.id,t.user_id,t.type_name,t.exec_date,t."comment",t.amount from user_transactions t
order by user_id,exec_date,id asc;

END
$function$
;




--Data--

-- templates
ALTER SEQUENCE templates_id_seq RESTART WITH 1;
insert into templates (name) values 
('שבת'),
('א ראש השנה'),
('ב ראש השנה'),
('יום כיפור'),
('סוכות'),
('חול המועד'),
('ליל קריאה + הושענא רבא'),
('שמחת תורה'),
('פורים'),
('פסח'),
('שביעי של פסח'),
('שבועות'),
('קבלות'),
('מס מתפלל')

-- transaction types
insert into transaction_types (name) values 
('שחרית'),
('מנחה'),
('ערבית'),
('מוסף'),
('פרק'),
('ראשון'),
('שני'),
('שלישי'),
('רביעי'),
('חמישי'),
('שישי'),
('שביעי'),
('מפטיר'),
('תרגום הפטרה'),
('תרגום פרשה'),
('מנחה ראשון'),
('מנחה שני'),
('מנחה שלישי'),
('אזהרות'),
('אצולה'),
('תפסיר'),
('קרא'),
('תיקון הטל'),
('תיקון הגשם'),
('קריאת מגילה ערב'),
('קריאת מגילה בוקר'),
('תיקון פורים'),
('אשר בגלל'),
('שמחו'),
('חדו'),
('הללויה'),
('כי בשמחה'),
('מפי אל'),
('ההרים'),
('מברך רחמנא'),
('חתן בראשית'),
('תרגום בראשית'),
('אנא משה'),
('סימן טוב'),
('הקפה א'),
('הקפה ב'),
('הקפה ג'),
('הקפה ד'),
('הקפה ה'),
('הקפה ו'),
('הקפה ז'),
('עשרת הדברות'),
('וזאת הברכה'),
('יהי רצון'),
('ואני ברוב'),
('סליחה'),
('לך אלי'),
('כתר מלכות'),
('שמע קולי'),
('מרנות'),
('דרכי שבעה'),
('סדר עבודה'),
('עת שערי'),
('המלך '),
('יעלו'),
('בליל זה'),
('שירו לאל'),
('חצי שנה - מנחת ערב שבת'),
('חצי שנה - המהולל ונשמת'),
('חצי שנה - כהנים'),
('חצי שנה - הוצאת ספר תורה'),
('חצי שנה - גלילה'),
('חצי שנה - מנחת שבת'),
('זיכוי'),
('אחר'),
('מס מתפלל')


INSERT INTO public.users (first_name,last_name,email,is_guest,in_activity_date) VALUES 
('אברהם','בדיחי',NULL,false,NULL)
,('בועז','באשה',NULL,false,NULL)
,('חיים','גמליאל',NULL,false,NULL)
,('ירון','גמליאל',NULL,false,NULL)
,('חיים','גרמה',NULL,false,NULL)
,('יוסף','דאר',NULL,false,NULL)
,('יהודה','דאר',NULL,false,NULL)
,('צבי','דאר',NULL,false,NULL)
,('יחיאל','דאר',NULL,false,NULL)
,('אבי','דאר',NULL,false,NULL)
,('יריב','דאר',NULL,false,NULL)
,('דורון','דאר',NULL,false,NULL)
,('עודד','דאר',NULL,false,NULL)
,('נריה','דאר',NULL,false,NULL)
,('אוריאל','זהבי',NULL,false,NULL)
,('עומר','זהבי',NULL,false,NULL)
,('יאיר','זהבי',NULL,false,NULL)
,('שלמה','חבשוש',NULL,false,NULL)
,('יחיאל בן שלמה','חוברה',NULL,false,NULL)
,('עזריאל','חמדי',NULL,false,NULL)
,('אליהו','יונתי',NULL,false,NULL)
,('ישראל','ימיני',NULL,false,NULL)
,('אבנר','ימיני',NULL,false,NULL)
,('איתי','ימיני',NULL,false,NULL)
,('אריאל','ימיני',NULL,false,NULL)
,('שלמה','ימיני',NULL,false,NULL)
,('יחיאל','יצחק',NULL,false,NULL)
,('דוד','ירימי',NULL,false,NULL)
,('משה','ירימי',NULL,false,NULL)
,('שאול','ירימי',NULL,false,NULL)
,('איתי','כהן',NULL,false,NULL)
,('יהונתן','כהן',NULL,false,NULL)
,('פנחס בן שלמה','כהן',NULL,false,NULL)
,('שמואל בן יעקב','כהן',NULL,false,NULL)
,('רצון','כהן',NULL,false,NULL)
,('רפאל','לוי',NULL,false,NULL)
,('ליאור','מועלם',NULL,false,NULL)
,('עזרא','מגורי',NULL,false,NULL)
,('גלעד','סירי',NULL,false,NULL)
,('שלום','סירי',NULL,false,NULL)
,('יחיאל','עוזרי',NULL,false,NULL)
,('בתיה','עוזרי',NULL,false,NULL)
,('זכריה','עוזרי',NULL,false,NULL)
,('אורי','עוזרי',NULL,false,NULL)
,('אלעד','ערוסי',NULL,false,NULL)
,('יאיר','צדוק',NULL,false,NULL)
,('יהודה בן חיים','צדוק',NULL,false,NULL)
,('טוב','צדוק',NULL,false,NULL)
,('יוני','צדוק',NULL,false,NULL)
,('ישעיה','צדוק',NULL,false,NULL)
,('שי','צדוק',NULL,false,NULL)
,('יחיאל בן יהודה','צדוק',NULL,false,NULL)
,('ברכה','צוברי',NULL,false,NULL)
,('מגדיאל','צוברי',NULL,false,NULL)
,('יחיאל','צברי',NULL,false,NULL)
,('נתנאל','צברי',NULL,false,NULL)
,('יהודה בן שוכר','צדוק',NULL,false,NULL)
,('עופר','קאפח',NULL,false,NULL)
,('עמיאל','תעסה',NULL,false,NULL)
;












INSERT INTO public.templates_settings (template_id,transaction_type_id) VALUES 
(1,4)
,(1,5)
,(1,6)
,(1,7)
,(1,8)
,(1,9)
,(1,10)
,(1,11)
,(1,12)
,(1,13)
,(1,14)
,(1,15)
,(2,5)
,(2,6)
,(2,7)
,(2,8)
,(2,9)
,(2,10)
,(2,11)
,(2,12)
,(2,13)
,(2,14)
,(2,15)
,(2,58)
,(2,49)
,(3,5)
,(3,6)
,(3,7)
,(3,8)
,(3,9)
,(3,10)
,(3,11)
,(3,12)
,(3,13)
,(3,14)
,(3,15)
,(3,49)
,(3,59)
,(3,60)
,(3,61)
,(3,62)
,(4,3)
,(4,5)
,(4,6)
,(4,7)
,(4,8)
,(4,9)
,(4,10)
,(4,11)
,(4,12)
,(4,13)
,(4,14)
,(4,15)
,(4,49)
,(4,50)
,(4,51)
,(4,51)
,(4,51)
,(4,51)
,(4,51)
,(4,51)
,(4,51)
,(4,51)
,(4,51)
,(4,51)
,(4,52)
,(4,53)
,(4,54)
,(4,55)
,(4,56)
,(4,57)
,(5,3)
,(5,4)
,(5,5)
,(5,6)
,(5,7)
,(5,8)
,(5,9)
,(5,10)
,(5,11)
,(5,12)
,(5,13)
,(5,14)
,(5,15)
,(6,1)
,(6,4)
,(6,5)
,(6,6)
,(6,7)
,(6,8)
,(6,9)
,(6,13)
,(7,48)
,(7,49)
,(7,15)
,(7,21)
,(7,1)
,(7,41)
,(7,42)
,(7,43)
,(7,44)
,(7,45)
,(7,46)
,(7,47)
,(7,6)
,(7,7)
,(7,8)
,(7,9)
,(7,4)
,(8,3)
,(8,4)
,(8,5)
,(8,6)
,(8,7)
,(8,8)
,(8,9)
,(8,10)
,(8,11)
,(8,12)
,(8,13)
,(8,14)
,(8,15)
,(8,28)
,(8,28)
,(8,29)
,(8,29)
,(8,30)
,(8,30)
,(8,31)
,(8,31)
,(8,32)
,(8,32)
,(8,33)
,(8,33)
,(8,34)
,(8,34)
,(8,35)
,(8,36)
,(8,37)
,(8,38)
,(8,39)
,(8,21)
,(8,63)
,(8,64)
,(8,65)
,(8,66)
,(8,67)
,(8,68)
,(8,28)
,(8,20)
,(9,1)
,(9,3)
,(9,25)
,(9,26)
,(9,27)
,(10,3)
,(10,1)
,(10,4)
,(10,5)
,(10,6)
,(10,7)
,(10,8)
,(10,9)
,(10,10)
,(10,11)
,(10,12)
,(10,13)
,(10,14)
,(10,15)
,(10,23)
,(11,3)
,(11,1)
,(11,4)
,(11,5)
,(11,6)
,(11,7)
,(11,8)
,(11,9)
,(11,10)
,(11,11)
,(11,12)
,(11,13)
,(11,14)
,(11,15)
,(11,21)
,(11,63)
,(11,64)
,(11,65)
,(11,66)
,(11,67)
,(11,68)
,(12,3)
,(12,1)
,(12,4)
,(12,5)
,(12,6)
,(12,7)
,(12,8)
,(12,9)
,(12,10)
,(12,11)
,(12,12)
,(12,13)
,(12,14)
,(12,15)
,(12,19)
,(12,20)
,(12,21)
,(12,22)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(13,69)
,(14, 71)
,(14, 71)
,(14, 71)
,(14, 71)
,(14, 71)
,(14, 71)
,(14, 71)
,(14, 71)
,(14, 71)
,(14, 71)
,(14, 71)
,(14, 71)
,(14, 71)
,(14, 71)
,(14, 71)
,(14, 71)
,(14, 71)
,(14, 71)
,(14, 71)
,(14, 71)
;