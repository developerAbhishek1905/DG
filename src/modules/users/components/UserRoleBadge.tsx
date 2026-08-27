interface Props {
  roleName: string;
}

export default function UserRoleBadge({
  roleName,
}: Props) {
  return (
    <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
      {roleName}
    </span>
  );
}