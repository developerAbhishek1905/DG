import TableSkeleton from "../../../components/ui/TableSkeleton";

export default function UserTableSkeleton() {
  return (
    <TableSkeleton
      headings={["User", "Phone", "Role", "Status", "Password", "Actions"]}
    />
  );
}
