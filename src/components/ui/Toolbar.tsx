"use client";
import React from "react";
import { type Editor } from "@tiptap/react";
import { Toggle } from "~/components/ui/toggle";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  StrikethroughIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

type Props = {
  editor: Editor | null;
};

function ToolBar({ editor }: Props) {
  if (!editor) {
    return null;
  }

  return (
    <div className="my-2 flex gap-3 rounded-lg border border-input p-1">
      {/* Heading Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Toggle size="sm" pressed={editor.isActive("heading")}>
            H
          </Toggle>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-fit">
          <DropdownMenuItem asChild className="w-fit">
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 1 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              <Heading1 className="h-4 w-4" /> Heading 1
            </Toggle>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="w-fit">
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 2 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              <Heading2 className="h-4 w-4" /> Heading 2
            </Toggle>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="w-fit">
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 3 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
            >
              <Heading3 className="h-4 w-4" /> Heading 3
            </Toggle>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Bold, Italic, Strikethrough */}
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <StrikethroughIcon className="h-4 w-4" />
      </Toggle>

      {/* Bullet List and Ordered List */}
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      {/* Text Alignment Options */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Toggle size="sm">Align</Toggle>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-fit">
          <DropdownMenuItem asChild className="w-fit">
            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "left" })}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("left").run()
              }
            >
              <AlignLeft className="h-4 w-4" /> Align Left
            </Toggle>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="w-fit">
            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "center" })}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
            >
              <AlignCenter className="h-4 w-4" /> Align Center
            </Toggle>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="w-fit">
            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "right" })}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("right").run()
              }
            >
              <AlignRight className="h-4 w-4" /> Align Right
            </Toggle>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="w-fit">
            <Toggle
              size="sm"
              pressed={editor.isActive({ textAlign: "justify" })}
              onPressedChange={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
            >
              <AlignJustify className="h-4 w-4" /> Justify
            </Toggle>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ToolBar;
