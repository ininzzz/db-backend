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
