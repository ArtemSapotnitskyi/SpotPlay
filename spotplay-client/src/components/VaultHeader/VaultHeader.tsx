interface VaultHeaderProps {
  onAddNew: () => void;
}

export default function VaultHeader({ onAddNew }: VaultHeaderProps) {
  return (
    <header className="mb-8 flex justify-between items-end border-b border-neutral-200 pb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-black">
          My Vault
        </h1>
        <p className="text-neutral-500 text-sm mt-1">
          Your personal collection of albums, folders, and tracks
        </p>
      </div>
      <button
        onClick={onAddNew}
        className="bg-white border border-neutral-200 text-neutral-900 px-5 py-2 rounded-full text-sm font-medium hover:border-[#1ab854] hover:text-[#1ab854] transition-colors flex items-center gap-2"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add New
      </button>
    </header>
  );
}
