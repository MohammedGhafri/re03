drop table if exists book;
create table book(
    id serial primary key,
title VARCHAR(255),
image VARCHAR(255),
des text,
catagory VARCHAR(255)
);
insert into book (title,image,des,catagory) values ('trail1','no image','For trail','Its my');