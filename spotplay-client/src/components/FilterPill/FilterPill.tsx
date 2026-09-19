interface FilterPillProps {
  text: string;
  active?: boolean;
}

export default function FilterPill({ text, active = false }: FilterPillProps) {
  return (
    <button
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        active
          ? "bg-black text-white"
          : "bg-gray-100 text-black hover:bg-gray-200"
      }`}
    >
      {text}
    </button>
  );
}
