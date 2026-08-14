import type { SchemaTypeDefinition } from "sanity";
import newsletterSettings from "./newsletter-settings";
import subscriber from "./subscriber";

export const schemaTypes: SchemaTypeDefinition[] = [newsletterSettings, subscriber];
