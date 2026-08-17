import type { SchemaTypeDefinition } from "sanity";
import newsletterSettings from "./newsletter-settings";
import subscriber from "./subscriber";
import leadMagnet from "./lead-magnet";

export const schemaTypes: SchemaTypeDefinition[] = [newsletterSettings, subscriber, leadMagnet];
