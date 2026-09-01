CREATE TABLE `glossary_terms` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`slug` varchar(160) NOT NULL,
	`term` varchar(140) NOT NULL,
	`definition` varchar(500) NOT NULL,
	`body` text,
	`faq` json,
	`related_terms` varchar(400),
	`related_service` varchar(140),
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `glossary_terms_id` PRIMARY KEY(`id`),
	CONSTRAINT `glossary_slug_key` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `insights` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`slug` varchar(160) NOT NULL,
	`title` varchar(200) NOT NULL,
	`excerpt` varchar(400),
	`direct_answer` text,
	`body` text,
	`faq` json,
	`tags` varchar(240),
	`cover_url` varchar(400),
	`author_name` varchar(120),
	`published_at` timestamp,
	`sort_order` int NOT NULL DEFAULT 0,
	`published` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `insights_id` PRIMARY KEY(`id`),
	CONSTRAINT `insights_slug_key` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE INDEX `glossary_pub_idx` ON `glossary_terms` (`published`,`term`);--> statement-breakpoint
CREATE INDEX `insights_pub_idx` ON `insights` (`published`,`published_at`);