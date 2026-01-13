"use client";

import {
  Box,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import CharacterCount from "@tiptap/extension-character-count";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { FontSize } from "@/utils/fontSize";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import ImageIcon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import PaletteIcon from "@mui/icons-material/Palette";
import RedoIcon from "@mui/icons-material/Redo";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import TableChartIcon from "@mui/icons-material/TableChart";
import UndoIcon from "@mui/icons-material/Undo";
import { Table } from "@tiptap/extension-table";
import React from "react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  maxChars?: number;
}

export default function RichTextField({
  label,
  value,
  onChange,
  maxChars = 256,
}: Props) {
  const editor = useEditor({
    content: value,
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      FontSize,
      Color,
      Highlight,
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write here..." }),
      CharacterCount,
    ],
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  const [fontSize, setFontSize] = React.useState("");
  const [customFontSize, setCustomFontSize] = React.useState("");
  const [selectedColor, setSelectedColor] = React.useState("#000000");

  const setLink = () => {
    if (!editor) return;

    const url = prompt("Enter URL");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    if (!editor) return;

    const url = prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  React.useEffect(() => {
    if (!editor) return;

    const updateFontSize = () => {
      const size = editor.getAttributes("textStyle")?.fontSize || "";
      setFontSize(size);
    };

    editor.on("selectionUpdate", updateFontSize);
    editor.on("transaction", updateFontSize);

    return () => {
      editor.off("selectionUpdate", updateFontSize);
      editor.off("transaction", updateFontSize);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <Box>
      {label && <Typography mb={0.5}>{label}</Typography>}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0.5,
          border: "1px solid #ccc",
          borderBottom: "none",
          borderRadius: "1px 1px 0 0",
          p: 0.5,
          bgcolor: "#f5f6fa",
        }}
      >
        <Tooltip title="Undo">
          <IconButton onClick={() => editor.chain().focus().undo().run()}>
            <UndoIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Redo">
          <IconButton onClick={() => editor.chain().focus().redo().run()}>
            <RedoIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Bold">
          <IconButton onClick={() => editor.chain().focus().toggleBold().run()}>
            <FormatBoldIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Italic">
          <IconButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FormatItalicIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Underline">
          <IconButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <FormatUnderlinedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Strikethrough">
          <IconButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <StrikethroughSIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Clear Formatting">
          <IconButton
            onClick={() =>
              editor.chain().focus().clearNodes().unsetAllMarks().run()
            }
          >
            <FormatClearIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Bullet List">
          <IconButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <FormatListBulletedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Numbered List">
          <IconButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <FormatListNumberedIcon />
          </IconButton>
        </Tooltip>

        <Select
          size="small"
          value={fontSize}
          displayEmpty
          renderValue={(value) => value || "Font"}
          onChange={(e) => {
            const value = e.target.value;
            setFontSize(value);
            editor.chain().focus().setFontSize(value).run();
          }}
          MenuProps={{
            disableAutoFocusItem: true,
          }}
          sx={{ width: 90 }}
        >
          <MenuItem value="">
            <em>Font</em>
          </MenuItem>

          {[12, 14, 16, 18, 24, 32].map((s) => (
            <MenuItem key={s} value={`${s}px`}>
              {s}px
            </MenuItem>
          ))}

          <MenuItem disableRipple onMouseDown={(e) => e.stopPropagation()}>
            <input
              type="number"
              placeholder="Custom"
              value={customFontSize}
              onChange={(e) => setCustomFontSize(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                e.stopPropagation();

                if (e.key === "Enter" && customFontSize) {
                  const value = `${customFontSize}px`;

                  setFontSize(value);
                  editor.chain().focus().setFontSize(value).run();

                  setCustomFontSize("");
                }
              }}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: 14,
              }}
            />
          </MenuItem>
        </Select>

        <Tooltip title="Text Color">
          <IconButton
            sx={{
              position: "relative",
              width: 36,
              height: 36,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                width: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: selectedColor,
                border: "1px solid #ccc",
              }}
            />

            <PaletteIcon sx={{ fontSize: 18, color: "#555" }} />

            <input
              type="color"
              onChange={(e) => {
                const color = e.target.value;

                setSelectedColor(color);

                editor.chain().focus().setColor(color).run();
              }}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                cursor: "pointer",
              }}
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="Insert Link">
          <IconButton onClick={setLink}>
            <LinkIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Insert Image">
          <IconButton onClick={addImage}>
            <ImageIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Insert Table">
          <IconButton
            onClick={() => {
              if (!editor) return;

              const rows = Number(prompt("Enter number of rows", "3"));
              const cols = Number(prompt("Enter number of columns", "3"));

              if (
                Number.isInteger(rows) &&
                Number.isInteger(cols) &&
                rows > 0 &&
                cols > 0
              ) {
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows, cols, withHeaderRow: true })
                  .run();
              }
            }}
          >
            <TableChartIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: "0 0 1px 1px",
          p: 1,
          minHeight: 160,
          "& .ProseMirror": {
            outline: "none",
            minHeight: 140,
          },
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      <Typography variant="caption" color="text.secondary" mt={0.5}>
        {editor.storage.characterCount.characters()} / {maxChars} characters
      </Typography>
    </Box>
  );
}
