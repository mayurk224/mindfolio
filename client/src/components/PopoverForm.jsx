import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import FileUploadBox from "./FileUploadBox";
import { useState } from "react";
import { useItem } from "@/hooks/useItem";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function PopoverForm() {
  const { saveItem, isLoading } = useItem();
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    type: "",
    textContent: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const handleSubmit = async () => {
    if (!formData.url && !formData.textContent) {
      toast.error("Please enter a URL or text content.");
      return;
    }

    const result = await saveItem(formData);
    if (result.success) {
      toast.success("Item saved successfully!");
      setFormData({
        url: "",
        title: "",
        type: "",
        textContent: "",
      });
    } else {
      toast.error(result.error || "Failed to save item.");
    }
  };

  return (
    <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto no-scrollbar">
      {/* File Upload (smaller) */}
      <FileUploadBox />

      {/* URL */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="url" className="text-xs">
          URL
        </Label>
        <Input
          id="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://..."
          className="h-8"
        />
      </div>

      {/* Title */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="title" className="text-xs">
          Title
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter title"
          className="h-8"
        />
      </div>

      {/* Type */}
      <div className="flex flex-col gap-1">
        <Label className="text-xs">Type</Label>
        <Select value={formData.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full h-8">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="web">Web</SelectItem>
            <SelectItem value="images">Images</SelectItem>
            <SelectItem value="videos">Videos</SelectItem>
            <SelectItem value="documents">Documents</SelectItem>
            <SelectItem value="articles">Articles</SelectItem>
            <SelectItem value="notes">Notes</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="quotes">Quotes</SelectItem>
            <SelectItem value="posts">Posts</SelectItem>
            <SelectItem value="snippets">Snippets</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Text Content */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="textContent" className="text-xs">
          Text
        </Label>
        <Textarea
          id="textContent"
          value={formData.textContent}
          onChange={handleChange}
          placeholder="Write..."
          className="min-h-[80px]"
        />
      </div>

      {/* Submit */}
      <Button
        className="w-full h-8 text-sm"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Saving..." : "Add Item"}
      </Button>
    </div>
  );
}
