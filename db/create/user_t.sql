CREATE PROCEDURE generate_user_tt()
BEGIN
    DECLARE n int DEFAULT 450;
    DECLARE id int DEFAULT 10001;
    WHILE n>0 DO
        INSERT INTO `user_t`(`usr`,`pwd`) value(id,'123456');
        set n:=n-1;
        set id:=id+1;
    END WHILE;
END;

CALL generate_user_tt();