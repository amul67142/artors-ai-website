CREATE TABLE `leads` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`name` varchar(120) NOT NULL,
	`company` varchar(160),
	`phone` varchar(40) NOT NULL,
	`email` varchar(160),
	`service` varchar(80),
	`message` text,
	`source_path` varchar(200),
	`ip` varchar(64),
	`user_agent` varchar(256),
	`status` enum('new','contacted','qualified','closed','spam') NOT NULL DEFAULT 'new',
	`emailed_at` timestamp,
	`confirmed_at` timestamp,
	`note` text,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
