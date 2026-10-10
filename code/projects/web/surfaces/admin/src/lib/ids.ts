/**
 * The id and address patterns the admin validates before it calls Clerk or the api.
 *
 * @see docs/reference/projects/web/admin/src/lib/ids.md
 */

/** A Clerk user id — bounded, so a forged value can't be huge. The api checks its own strict
 *  form as well; this is the admin's first gate. */
export const USER_ID = /^user_[A-Za-z0-9]{1,40}$/;

/** An email address the api accepts: no URL-path characters (it goes into Resend's path). */
export const EMAIL = /^[^@\s/?#%\\]+@[^@\s/?#%\\]+\.[^@\s/?#%\\]+$/;
