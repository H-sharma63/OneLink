"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiTrash2, FiMoreVertical, FiEye } from "react-icons/fi";

type Link = {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  order: number;
  clicks: number;
  thumbnail?: string | null;
  icon?: string | null;
};

type Props = {
  link: Link;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
};

export function SortableLinkItem({ link, onDelete, onToggle }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : "auto",
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center justify-between p-6 border border-transparent hover:border-white/5 hover:bg-white/[0.02] rounded-3xl transition-all duration-300 ${
        !link.isActive ? "opacity-40 grayscale" : ""
      }`}
    >
      <div className="flex items-center gap-6 flex-1 min-w-0">
        <div
          {...attributes}
          {...listeners}
          className="text-white/10 cursor-grab active:cursor-grabbing hover:text-white/40 transition-colors"
        >
          <FiMoreVertical size={20} />
        </div>
        
        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 flex-shrink-0 overflow-hidden flex items-center justify-center">
          {(link.thumbnail || link.icon) ? (
            <img src={link.thumbnail || link.icon || ""} className="w-full h-full object-cover" />
          ) : (
            <FiEye size={16} className="text-white/5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-bold text-white/90 tracking-tight mb-1 truncate">
            {link.title}
          </h3>
          <div className="flex items-center gap-6">
            <p className="text-[12px] text-white/20 font-mono truncate max-w-[200px]">
              {link.url}
            </p>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/5">
              <FiEye size={10} className="text-white/20" />
              <span className="text-[10px] font-bold text-white/40">{link.clicks || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button
          onClick={() => onToggle(link.id)}
          className={`w-11 h-6 rounded-full relative transition-all duration-300 ${
            link.isActive ? "bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]" : "bg-white/5"
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 ${
              link.isActive ? "left-6" : "left-1"
            }`}
          />
        </button>
        
        <button
          onClick={() => onDelete(link.id)}
          className="p-2 text-white/5 group-hover:text-red-500/50 hover:!text-red-500 transition-all opacity-0 group-hover:opacity-100"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
}
