import React, { useState, useEffect } from "react";
import { getCollections } from "@/services/collectionService";
import { useItem } from "@/hooks/useItem";
import MediaCard from "./MediaCard";
import ItemDetailModal from "./ItemDetailModal";
import { ChevronLeft, Folder, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const CollectionSection = ({ onItemUpdate, onItemDelete }) => {
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { fetchItems } = useItem();

  useEffect(() => {
    const loadCollections = async () => {
      try {
        const data = await getCollections();
        setCollections(data);
      } catch (error) {
        console.error("Failed to load collections:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCollections();
  }, []);

  useEffect(() => {
    if (selectedCollection) {
      const loadCollectionItems = async () => {
        setItemsLoading(true);
        try {
          const result = await fetchItems(1, 100, selectedCollection._id);
          if (result.success) {
            setItems(result.items);
          }
        } catch (error) {
          console.error("Failed to load collection items:", error);
        } finally {
          setItemsLoading(false);
        }
      };
      loadCollectionItems();
    } else {
      setItems([]);
    }
  }, [selectedCollection]);

  // Sync selectedItem if items update
  useEffect(() => {
    if (selectedItem) {
      const updatedItem = items.find((i) => i._id === selectedItem._id);
      if (updatedItem && updatedItem !== selectedItem) {
        setSelectedItem(updatedItem);
      }
    }
  }, [items, selectedItem]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading collections...</p>
      </div>
    );
  }

  if (!selectedCollection) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Collections</h1>
        </div>

        {collections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl border-muted/20">
            <Folder className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-xl font-semibold mb-2">No collections yet</h3>
            <p className="text-muted-foreground max-w-xs">
              Organize your ideas by creating your first collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collections.map((collection) => (
              <div
                key={collection._id}
                onClick={() => setSelectedCollection(collection)}
                className="group cursor-pointer p-6 rounded-3xl border-2 border-muted/10 bg-card hover:bg-accent/50 hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-xl"
              >
                <div className="flex flex-col gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Folder className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold truncate">{collection.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click to view items
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-fit -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => setSelectedCollection(null)}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Collections
        </Button>
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-2xl bg-primary/10 text-primary">
              <Folder className="h-7 w-7" />
            </span>
            {selectedCollection.name}
          </h1>
          <Separator orientation="vertical" className="h-8" />
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      {itemsLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground animate-pulse">Loading items...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl border-muted/20">
          <h3 className="text-xl font-semibold mb-2">This collection is empty</h3>
          <p className="text-muted-foreground max-w-xs">
            Add items to this collection from your timeline.
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              onClick={() => setSelectedItem(item)}
              className="cursor-pointer break-inside-avoid mb-6"
            >
              <MediaCard
                item={item}
                onItemUpdate={onItemUpdate}
                className={selectedItem?._id === item._id && "ring-2 ring-primary/40 shadow-2xl"}
              />
            </div>
          ))}
        </div>
      )}

      <ItemDetailModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onUpdate={onItemUpdate}
        onDelete={(deletedId) => {
          setSelectedItem(null);
          onItemDelete?.(deletedId);
          setItems(prev => prev.filter(i => i._id !== deletedId));
        }}
      />
    </div>
  );
};

export default CollectionSection;
