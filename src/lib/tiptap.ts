"use client";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Document from "@tiptap/extension-document";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { generateHTML as generateHTMLFromTiptap } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { createLowlight } from "lowlight";
import html from "highlight.js/lib/languages/xml";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";

const lowlight = createLowlight();

lowlight.register("html", html);
lowlight.register("js", js);
lowlight.register("ts", ts);

export const generateHTML = (content: string) => {
  const html = generateHTMLFromTiptap(JSON.parse(content), [
    Document,
    StarterKit.configure({
      orderedList: {
        HTMLAttributes: {
          class: "list-decimal pl-4",
        },
      },
      bulletList: {
        HTMLAttributes: {
          class: "list-disc pl-4",
        },
      },
    }),
    CodeBlockLowlight.configure({
      lowlight,
    }),
    TextStyle,
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    Color,
    Link,
  ]);

  // console.log(html);
  return html;
};
