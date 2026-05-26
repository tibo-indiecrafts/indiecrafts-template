import { defineModule } from "../objects/define-module";

/**
 * Renders the active post's header (title, author, date, cover) + body
 * (`blockContent`). Place inside `blog.postModules` once — the renderer
 * pulls the current post from route context.
 */
export default defineModule({
  name: "module.blog-post-content",
  title: "Blog post content",
  fields: [],
  preview: { prepare: () => ({ title: "Blog post content (active post)" }) },
});
