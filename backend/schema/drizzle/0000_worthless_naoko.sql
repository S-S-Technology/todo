CREATE TABLE `todo` (
	`id` varchar(50) NOT NULL DEFAULT (uuid()),
	`title` text,
	`description` text,
	`status` text,
	CONSTRAINT `todo_id` PRIMARY KEY(`id`)
);
