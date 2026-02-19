DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS attraction;

CREATE TABLE attraction (
    attraction_id int auto_increment,
    primary key(attraction_id),
    nom varchar(255) not null,
    description varchar(255) not null,
    difficulte int,
    visible bool default true
);

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    users_id int auto_increment,
    primary key(users_id),
    name varchar(255) not null,
    password varchar(255) not null
);

CREATE TABLE review (
    review_id int auto_increment,
    primary key(review_id),
    attraction_id int not null,
    nom varchar(255) default 'Anonyme',
    prenom varchar(255) default 'Anonyme',
    note int not null,
    commentaire text not null,
    date_creation DATETIME default CURRENT_TIMESTAMP,
    FOREIGN KEY (attraction_id) REFERENCES attraction(attraction_id) ON DELETE CASCADE
);