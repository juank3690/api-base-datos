create table users (
    id_user serial primary key,
    name_user varchar(50) not null,
    user_password varchar(255) not null,
    user_email varchar(50) not null unique
);

CREATE TABLE sections(
    id_section serial primary key,
    title_section varchar(50) not null,
    id_user integer not null,
    foreign key (id_user) references users(id_user) on delete cascade on update cascade
);


CREATE TABLE tasks(
    id_task serial primary key,
    title_task varchar(50) not null,
    description_task TEXT not null,
    id_section integer not null,
    foreign key (id_section) references sections(id_section) on delete cascade on update cascade
);


--Insertando datos de prueba+

insert into users (name_user, user_password, user_email) values ('Pablo', '123456', 'pablo@gmail.com');
insert into users (name_user, user_password, user_email) values ('Juan', '123456', 'juan@gmail.com');



--consulta para obtener las tareas de un usuario por id_user

select * from tasks where id_section in (select id_section from sections where id_user = 1);