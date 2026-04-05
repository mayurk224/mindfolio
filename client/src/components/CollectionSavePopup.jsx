import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { 
  getCollections, 
  createCollection, 
  toggleCollectionItem 
} from "@/services/collectionService";
import { toast } from "sonner";

export default function CollectionSavePopup({ item, onClose }) {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getCollections();
        setCollections(data);
      } catch (error) {
        toast.error("Failed to load collections");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCollections();
  }, []);

  const toggleCollection = async (collectionId) => {
    try {
      await toggleCollectionItem(collectionId, item._id);
      // Local update for UI snappiness
      setCollections(prev => prev.map(c => {
        if (c._id === collectionId) {
          // Note: In a real app, the item's 'collections' array would be checked.
          // For now, we'll toggle a local 'checked' state or refetch.
          return { ...c, isChecked: !c.isChecked };
        }
        return c;
      }));
    } catch (error) {
      toast.error("Failed to update collection");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    
    setIsSubmitting(true);
    try {
      const newColl = await createCollection(newCollectionName.trim(), item._id);
      setCollections(prev => [...prev, { ...newColl, isChecked: true }]);
      setNewCollectionName("");
      setIsCreating(false);
      toast.success(`Created "${newColl.name}"`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to check if item is in collection
  const isItemInCollection = (collectionId) => {
    return item?.collections?.includes(collectionId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="z-50 w-[280px] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">Save to...</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full hover:bg-muted"
          onClick={onClose}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* List Area */}
      <div className="max-h-48 overflow-y-auto py-1 scrollbar-hide">
        {isLoading ? (
          <div className="flex flex-col gap-2 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        ) : collections.length === 0 ? (
          <div className="px-4 py-6 text-center text-xs text-muted-foreground">
            No collections yet.
          </div>
        ) : (
          collections.map((collection) => {
            const isChecked = collection.isChecked ?? isItemInCollection(collection._id);
            return (
              <button
                key={collection._id}
                onClick={() => toggleCollection(collection._id)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/50"
              >
                <div
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border border-primary transition-colors",
                    isChecked ? "bg-primary text-primary-foreground" : "bg-transparent"
                  )}
                >
                  {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                </div>
                <span className="truncate text-sm font-medium">{collection.name}</span>
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-2">
        <AnimatePresence mode="wait">
          {!isCreating ? (
            <motion.button
              key="add-button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreating(true)}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
              <span>Create new collection</span>
            </motion.button>
          ) : (
            <motion.form
              key="create-form"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              onSubmit={handleCreate}
              className="space-y-2 p-1"
            >
              <Input
                autoFocus
                placeholder="Enter collection name..."
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="h-8 border-input bg-background px-3 text-sm focus-visible:ring-1 focus-visible:ring-ring"
              />
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!newCollectionName.trim() || isSubmitting}
                  size="sm"
                  className="h-7 px-3 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
