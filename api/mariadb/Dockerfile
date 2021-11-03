FROM mariadb:10.5.3

EXPOSE 3306
#Libera conexao remota
RUN  sed -i 's/#bind-address/bind-address/g' /etc/mysql/my.cnf

#CMD ["mariadb","create user 'teste'@'%' GRANT ALL PRIVILEGES ON *.* TO 'teste'@'%' IDENTIFIED BY 'uwiser#2021' WITH GRANT OPTION"]
#CMD ["mariadb","create user 'teste'@'%' IDENTIFIED BY 'uwiser#2021' ; GRANT ALL PRIVILEGES ON *.* TO 'teste'@'%'"]
