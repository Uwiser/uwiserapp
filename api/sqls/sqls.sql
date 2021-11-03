show databases;

create database uwiser;
use uwiser;

select * from event;
select * from user;
GRANT ALL ON *.* TO 'root'@'%' ;

#grant all privileges on *.* to root@usuario-pc IDENTIFIED by '123' with grant option;  

grant all  on *.* to IDENTIFIED'teste'@'%' IDENTIFIED by 'uwiser#2021' with grant option; 

CREATE USER 'root'@'%' IDENTIFIED BY 'uwiser#2021';

show tables;
use mysql;
select * from user_uwiser;
select * from user_type;
insert into user_type values (1, "COMMOM");
insert into user_type values (2, "TRANSLATOR");
