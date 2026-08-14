// Vite `?raw` imports — colocated `.md` docs surfaced as story descriptions.
declare module "*.md?raw" {
  const content: string;
  export default content;
}
