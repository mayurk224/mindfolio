import { useRef, useState } from "react";
import { Upload } from "lucide-react";

export default function FileUploadBox({ onFileSelect, disabled = false }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleFile = (file) => {
    setFileName(file ? file.name : "");
    onFileSelect?.(file || null);
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
      />

      <div
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 transition ${
          disabled
            ? "cursor-not-allowed opacity-70"
            : "cursor-pointer hover:bg-muted/50"
        }`}
      >
        <Upload className="w-6 h-6 text-muted-foreground" />

        <p className="text-sm text-muted-foreground">
          Drag & Drop or{" "}
          <span className="text-primary font-medium">Choose file</span> to
          upload
        </p>

        <p className="text-xs text-muted-foreground">
          Image, Video or Document
        </p>

        {fileName && (
          <p className="text-xs text-foreground mt-2">Selected: {fileName}</p>
        )}
      </div>
    </div>
  );
}
