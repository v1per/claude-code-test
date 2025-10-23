ALTER TABLE "notes" ADD COLUMN "color" text DEFAULT '#fef08a' NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "position_x" integer DEFAULT 100 NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ADD COLUMN "position_y" integer DEFAULT 100 NOT NULL;