/**
 * Two-bubble chat illustration — incoming message ("Hey, I'm having
 * trouble with my account.") with date timestamp, then outgoing
 * primary-tinted reply with "Now" label. Used by `sections-bento/
 * bento-12/`'s "AI-Powered Chat Support" cell. Pure decoration; mock
 * copy stays hardcoded per the illustration rule. Sourced from
 * `@tailark-pro/bento-12` (upstream `ChatIllustration`; renamed to
 * `chat-bubbles-illustration` to differentiate from our existing
 * animated `chat.tsx` (full AI conversation with sources)).
 */
export const ChatBubblesIllustration = () => {
  return (
    <div aria-hidden className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">Sat 22 Feb</span>
        </div>
        <div className="bg-card ring-foreground/5 mt-1.5 w-3/5 rounded-(--radius) rounded-tl p-3 text-xs shadow ring-1">
          Hey, I&apos;m having trouble with my account.
        </div>
      </div>

      <div>
        <div className="bg-primary inset-ring-foreground/25 mb-1 ml-auto w-3/5 rounded-(--radius) rounded-br p-3 text-xs text-white shadow inset-ring-1 shadow-black/15">
          Distinctio provident nobis repudiandae deleniti necessitatibus.
        </div>
        <span className="text-muted-foreground block text-right text-xs">Now</span>
      </div>
    </div>
  );
};
