
Using MySQL 5.7 


### Fix the issue if you are using MySQL 8.0
```Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL clien```

Run the following in mysql:
```ALTER USER 'drawings'@'localhost' IDENTIFIED WITH mysql_native_password;```