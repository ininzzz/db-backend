CREATE PROCEDURE generate_user_s()
BEGIN
    DECLARE n int DEFAULT 450;
    DECLARE id int DEFAULT 19120001;
    WHILE n>0 DO
        INSERT INTO `user_s`(`usr`,`pwd`) value(id,'123456');
        set n:=n-1;
        set id:=id+1;
    END WHILE;
END;

CALL generate_user_s();

CREATE PROCEDURE generate_selection_tttt()
BEGIN
    DECLARE n int DEFAULT 100000;
    DECLARE id int DEFAULT 19120000;
    DECLARE id2 int DEFAULT 10000;

    WHILE n >0 DO
        INSERT INTO selection_test (student_id, teacher_id, status)
        VALUES (
            id+round(rand()*99999+1),
            id2+round(rand()*99999+1),
            round(rand()*3)
        );        
        SET n:=n-1;
    END WHILE;
END;

CALL generate_selection_tttt();