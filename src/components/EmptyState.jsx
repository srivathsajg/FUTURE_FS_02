export default function EmptyState({ title = 'Nothing here', subtitle = 'Try adjusting your filters' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
      <div className="mb-2 text-sm font-medium">{title}</div>
      <div className="text-xs">{subtitle}</div>
    </div>
  )
}

