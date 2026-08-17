export { sendEmail } from "./resend";
export type { SendEmailInput } from "./resend";

export { renderEmailLayout, escapeHtml } from "./layout";
export type { EmailLayoutInput } from "./layout";

export { renderCommentNotificationEmail } from "./templates/comment-notification";
export type { CommentNotificationInput, RenderedEmail } from "./templates/comment-notification";

export { renderNewsletterConfirmEmail } from "./templates/newsletter-confirm";
export type { NewsletterConfirmInput } from "./templates/newsletter-confirm";

export { renderNewsletterNotificationEmail } from "./templates/newsletter-notification";
export type { NewsletterNotificationInput } from "./templates/newsletter-notification";

export { renderWaitlistConfirmEmail } from "./templates/waitlist-confirm";
export type { WaitlistConfirmInput } from "./templates/waitlist-confirm";

export { renderWaitlistNotificationEmail } from "./templates/waitlist-notification";
export type { WaitlistNotificationInput } from "./templates/waitlist-notification";

export { renderLeadMagnetEmail } from "./templates/lead-magnet";
export type { LeadMagnetInput } from "./templates/lead-magnet";
