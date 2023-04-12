CREATE TABLE IF NOT EXISTS pacientes(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,rh TEXT,age INTEGER,gender TEXT,situation TEXT,lastscore INTEGER);
INSERT or IGNORE INTO pacientes VALUES (1,'Arthur Coelho','000000001',20,'M','normal',1);
INSERT or IGNORE INTO pacientes VALUES (2,'Lucas Coelho','000000005',22,'M','grave',4);
 
CREATE TABLE IF NOT EXISTS mews(id INTEGER PRIMARY KEY AUTOINCREMENT,fc INTEGER,pas INTEGER,fr INTEGER,tc REAL,sncs TEXT,score INTEGER,horario TEXT,paciente INTEGER);
INSERT or IGNORE INTO mews VALUES (1,90,112,11,35.7,'Alerta',1,'01/09/2021 às 20:46',1);
INSERT or IGNORE INTO mews VALUES (2,101,120,15,35.5,'Alerta',4,'01/09/2021 às 21:46',2);
