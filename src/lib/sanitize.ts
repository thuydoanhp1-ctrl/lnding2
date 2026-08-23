import { defaultSchema } from "rehype-sanitize";

/**
 * Custom Rehype-sanitize schema allowing safe HTML tags, code blocks, tables, and YouTube embed iframes
 */
export const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    "iframe",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "code",
    "pre",
    "span",
  ],
  attributes: {
    ...defaultSchema.attributes,
    iframe: ["src", "width", "height", "frameBorder", "allow", "allowFullScreen", "title"],
    code: ["className"],
    span: ["className"],
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "width", "height", "loading"],
  },
  protocols: {
    ...defaultSchema.protocols,
    href: ["http", "https", "mailto"],
    src: ["http", "https", "data"],
  },
};
