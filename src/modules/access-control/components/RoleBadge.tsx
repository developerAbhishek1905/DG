interface Props {
  name: string;
  system?: boolean;
}

export default function RoleBadge({
  name,
  system = false,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex rounded-full border border-purple-200 bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700">
        {name}
      </span>

      {system && (
        <span className="text-[10px] font-medium uppercase text-gray-400">
          System
        </span>
      )}
    </div>
  );
}