create table `college`(
    -- 院系号，名字
    `id` int primary key auto_increment,
    `name` varchar(20) not null
);

create table `major`(
    -- 专业号，名字，所属院系号
    `id` int primary key auto_increment,
    `name` varchar(20) not null,
    `college_id` int not null references `college`(`id`)
);

create table `student`(
    -- 学号，姓名，性别，出生年月，院系号，专业号，手机号，邮箱，地址
    `id` int primary key auto_increment,
    `name` varchar(10) not null,
    `gender` varchar(10) not null,
    `birth` date not null,
    `college_id` int not null references `college`(`id`),
    `major_id` int not null references `major`(`id`),
    `telephone` varchar(20),
    `email` varchar(20),
    `website` varchar(255),
    `info` varchar(255)
);

create table `teacher`(
    -- 工号，姓名，职称，院系号，手机号，邮箱，地址
    `id` int primary key auto_increment,
    `gender` varchar(10) not null,
    `name` varchar(20) not null,
    `title` varchar(20) not null,
    `college_id` int not null references `college`(`id`),
    `telephone` varchar(20),
    `email` varchar(20),
    `website` varchar(255),
    `field` varchar(255)
);

create table `selection`(
    -- 选择id，学号，教师号
    `student_id` int not null references `student`(`id`),
    `teacher_id` int not null references `teacher`(`tid`),
    -- 0: 申请中 1: 已接受 2: 已拒绝
    `status` int not null,
    primary key(`student_id`,`teacher_id`)
);

create table `user_s`(
    -- 学号，密码
    `usr` int references `student`(`id`),
    `pwd` varchar(20) not null
);

create table `user_t`(
    -- 工号，密码
    `usr` int references `teacher`(`id`),
    `pwd` varchar(20) not null
);