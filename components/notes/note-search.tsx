'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Filter,
  Calendar,
  SortAsc,
  SortDesc,
  Clock,
  Tag,
  FolderOpen,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';

interface SearchFilters {
  query: string;
  folders: string[];
  tags: string[];
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  sortBy: 'date' | 'title' | 'relevance';
  sortOrder: 'asc' | 'desc';
}

interface NoteSearchProps {
  onSearch: (filters: SearchFilters) => void;
  folders: { id: string; name: string }[];
  tags: { id: string; name: string }[];
}

export function NoteSearch({ onSearch, folders, tags }: NoteSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    folders: [],
    tags: [],
    dateRange: {
      from: undefined,
      to: undefined
    },
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      onSearch(filters);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [filters, onSearch]);

  const clearFilters = () => {
    setFilters({
      query: '',
      folders: [],
      tags: [],
      dateRange: {
        from: undefined,
        to: undefined
      },
      sortBy: 'date',
      sortOrder: 'desc',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search notes..."
            className="pl-10"
            value={filters.query}
            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          />
        </div>
        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={isFiltersOpen ? 'bg-secondary' : ''}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                >
                  Clear all
                </Button>
              </div>

              {/* Folders */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Folders</label>
                <div className="space-y-1">
                  {folders.map((folder) => (
                    <div key={folder.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`folder-${folder.id}`}
                        checked={filters.folders.includes(folder.id)}
                        onCheckedChange={(checked: boolean) => {
                          setFilters({
                            ...filters,
                            folders: checked
                              ? [...filters.folders, folder.id]
                              : filters.folders.filter(id => id !== folder.id)
                          });
                        }}
                      />
                      <label
                        htmlFor={`folder-${folder.id}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {folder.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <div className="space-y-1">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag.id}`}
                        checked={filters.tags.includes(tag.id)}
                        onCheckedChange={(checked: boolean) => {
                          setFilters({
                            ...filters,
                            tags: checked
                              ? [...filters.tags, tag.id]
                              : filters.tags.filter(id => id !== tag.id)
                          });
                        }}
                      />
                      <label
                        htmlFor={`tag-${tag.id}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {tag.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !filters.dateRange.from && "text-muted-foreground"
                        }`}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {filters.dateRange.from ? (
                          filters.dateRange.from.toLocaleDateString()
                        ) : (
                          <span>From date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={filters.dateRange.from}
                        onSelect={(date: Date | undefined) =>
                          setFilters({
                            ...filters,
                            dateRange: { ...filters.dateRange, from: date }
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal ${
                          !filters.dateRange.to && "text-muted-foreground"
                        }`}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {filters.dateRange.to ? (
                          filters.dateRange.to.toLocaleDateString()
                        ) : (
                          <span>To date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={filters.dateRange.to}
                        onSelect={(date: Date | undefined) =>
                          setFilters({
                            ...filters,
                            dateRange: { ...filters.dateRange, to: date }
                          })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Sort Options */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <div className="flex gap-2">
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value: 'date' | 'title' | 'relevance') =>
                      setFilters({ ...filters, sortBy: value })
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date Modified</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="relevance">Relevance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setFilters({
                        ...filters,
                        sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc'
                      })
                    }
                  >
                    {filters.sortOrder === 'asc' ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters */}
      <AnimatePresence>
        {(filters.folders.length > 0 ||
          filters.tags.length > 0 ||
          filters.dateRange.from ||
          filters.dateRange.to) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2"
          >
            {filters.folders.map((folderId) => (
              <div
                key={folderId}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/30"
              >
                <FolderOpen className="h-3 w-3" />
                <span className="text-sm">
                  {folders.find((f) => f.id === folderId)?.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      folders: filters.folders.filter((id) => id !== folderId)
                    })
                  }
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {filters.tags.map((tagId) => (
              <div
                key={tagId}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/30"
              >
                <Tag className="h-3 w-3" />
                <span className="text-sm">
                  {tags.find((t) => t.id === tagId)?.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      tags: filters.tags.filter((id) => id !== tagId)
                    })
                  }
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {(filters.dateRange.from || filters.dateRange.to) && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/30">
                <Clock className="h-3 w-3" />
                <span className="text-sm">
                  {filters.dateRange.from?.toLocaleDateString()} -{' '}
                  {filters.dateRange.to?.toLocaleDateString()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() =>
                    setFilters({
                      ...filters,
                      dateRange: { from: undefined, to: undefined }
                    })
                  }
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
