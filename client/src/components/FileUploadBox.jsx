import { useRef, useState } from "react";
import { Upload, AlertCircle } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/webm",
  "application/pdf",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

export default function FileUploadBox({ onFileSelect, disabled = false }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleFile = (file) => {
    setError("");
    if (!file) {
      setFileName("");
      onFileSelect?.(null);
      return;
    }

    // 1. Check File Type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(
        "Invalid file type. Please upload images, videos, or documents.",
      );
      setFileName("");
      onFileSelect?.(null);
      return;
    }

    // 2. Check File Size
    if (file.size > MAX_FILE_SIZE) {
      setError("File is too large. Maximum size is 5MB.");
      setFileName("");
      onFileSelect?.(null);
      return;
    }

    setFileName(file.name);
    onFileSelect?.(file);
  };

  const handleChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
        accept="image/*,video/*,.pdf,.txt,.docx,.xlsx,.pptx"
      />

      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 transition ${
          disabled
            ? "cursor-not-allowed opacity-70"
            : "cursor-pointer hover:bg-muted/50"
        } ${error ? "border-destructive/50 bg-destructive/5" : ""}`}
      >
        <Upload
          className={`w-6 h-6 ${
            error ? "text-destructive" : "text-muted-foreground"
          }`}
        />

        <p className="text-sm text-muted-foreground">
          Drag & Drop or{" "}
          <span className="text-primary font-medium">Choose file</span> to
          upload
        </p>

        <p className="text-xs text-muted-foreground">
          Image, Video or Document (Max 5MB)
        </p>

        {fileName && !error && (
          <p className="text-xs text-foreground mt-2 font-medium">
            Selected: {fileName}
          </p>
        )}

        {error && (
          <div className="flex items-center gap-1.5 mt-2 text-destructive">
            <AlertCircle className="w-3.5 h-3.5" />
            <p className="text-xs font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
