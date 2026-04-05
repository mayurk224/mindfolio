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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUploadBox from "./FileUploadBox";
import { useState } from "react";
import { useItem } from "@/hooks/useItem";
import { toast } from "sonner";
import { Loader2, Link, FileText, FileUp } from "lucide-react";

export default function PopoverForm({ onSuccess }) {
  const { saveItem, uploadItem, isLoading } = useItem();
  const [activeTab, setActiveTab] = useState("link");
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    type: "",
    textContent: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUploadKey, setFileUploadKey] = useState(0);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, type: value }));
  };

  const resetForm = () => {
    setFormData({
      url: "",
      title: "",
      type: "",
      textContent: "",
    });
    setSelectedFile(null);
    setFileUploadKey((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    // Basic validation based on tab
    if (activeTab === "link" && !formData.url.trim()) {
      toast.error("Please enter a URL.");
      return;
    }
    if (activeTab === "note" && (!formData.title.trim() || !formData.textContent.trim())) {
      toast.error("Please enter both a title and content for the note.");
      return;
    }
    if (activeTab === "file" && !selectedFile) {
      toast.error("Please select a file to upload.");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      type: activeTab === "note" ? "notes" : formData.type.trim(),
      textContent: formData.textContent.trim(),
    };

    if (activeTab === "link") {
      payload.url = formData.url.trim();
    }

    const result = (activeTab === "file" && selectedFile)
      ? await uploadItem(selectedFile, {
          title: payload.title,
          type: payload.type,
          textContent: payload.textContent,
        })
      : await saveItem(payload);

    if (result.success) {
      toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} saved successfully!`);
      if (onSuccess && result.item) {
        onSuccess(result.item);
      }
      resetForm();
    } else {
      toast.error(result.error || "Failed to save item.");
    }
  };

  return (
    <div className="flex flex-col gap-4 max-h-[85vh] overflow-y-auto no-scrollbar">
      <Tabs defaultValue="link" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="link" className="flex items-center gap-2">
            <Link className="w-3.5 h-3.5" />
            <span>Link</span>
          </TabsTrigger>
          <TabsTrigger value="note" className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Note</span>
          </TabsTrigger>
          <TabsTrigger value="file" className="flex items-center gap-2">
            <FileUp className="w-3.5 h-3.5" />
            <span>File</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="link" className="flex flex-col gap-4 mt-0">
          <div className="flex flex-col gap-1">
            <Label htmlFor="url" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              URL
            </Label>
            <Input
              id="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.com"
              className="h-9"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="title" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Title (Optional)
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Give it a name"
              className="h-9"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type (Optional)</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web">Web</SelectItem>
                <SelectItem value="articles">Articles</SelectItem>
                <SelectItem value="videos">Videos</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="posts">Posts</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="note" className="flex flex-col gap-4 mt-0">
          <div className="flex flex-col gap-1">
            <Label htmlFor="title" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Note Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title of your note"
              className="h-9"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="textContent" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Content
            </Label>
            <Textarea
              id="textContent"
              value={formData.textContent}
              onChange={handleChange}
              placeholder="Write your thoughts here..."
              className="min-h-[150px] resize-none"
            />
          </div>
        </TabsContent>

        <TabsContent value="file" className="flex flex-col gap-4 mt-0">
          <FileUploadBox
            key={fileUploadKey}
            onFileSelect={setSelectedFile}
            disabled={isLoading}
          />
          <div className="flex flex-col gap-1">
            <Label htmlFor="title" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Title (Optional)
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
              className="h-9"
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Type (Optional)</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full h-9">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="images">Image</SelectItem>
                <SelectItem value="videos">Video</SelectItem>
                <SelectItem value="documents">Document</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>

      <div className="pt-2">
        <Button
          className="w-full h-10 text-sm font-semibold shadow-sm transition-all active:scale-[0.98]"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary-foreground/70" />}
          {isLoading ? "Saving..." : `Add ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
        </Button>
      </div>
    </div>
  );
}
