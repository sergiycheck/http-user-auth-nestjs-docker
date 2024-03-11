CREATE TABLE IF NOT EXISTS "auth_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"hashed_access_token" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text,
	"hashedPassword" text,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auth_info" ADD CONSTRAINT "auth_info_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
