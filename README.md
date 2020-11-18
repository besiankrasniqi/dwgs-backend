
# DWGS

**DWGS** is a project that enables the creation of drawings using HTML5 Canvas.

Drawings are created in HTML5 Canvas and they are saved as base64 encoded strings on the MySQL database. The reasoning behind saving the drawings as base64 encoded strings instead of bitmap files (.jpg, .png etc) is that they preserve their quality and they are responsive to different screens and devices



## Instructions

### Step 1

#### Go to the .env file at the root and change the MySQL database credentials
```
DATABASE = drawings
DATABASE_HOST = <DB HOST>
DATABASE_USER = <DB USER>
DATABASE_PASSWORD = <DB PASSWORD>
JWT_SECRET = mysupersecretpassword
JWT_EXPIRES_IN = 90d
JWT_COOKIE_EXPIRES = 90
```

### Step 2

#### Run the following MySQL statements

```
CREATE DATABASE drawings
```

```
CREATE TABLE `drawings` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `drawing_name` varchar(255) NOT NULL,
  `user_id` int unsigned NOT NULL,
  `drawing_base64_data` longtext,
  `creation_time_length_seconds` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `drawing_name` (`drawing_name`),
  KEY `user_id` (`user_id`)
)
```

```
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `name` (`name`)
) 
```

### Step 3

Go to the root folder and run: `npm i`

### Step 4

Go to the root folder and run: `node app.js`

***Note:** The server is going to start and listen on port: **5001**

