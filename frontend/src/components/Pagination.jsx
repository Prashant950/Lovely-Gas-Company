import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / pageSize)

  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  // Generate page numbers with smart sliding window
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      let start = Math.max(1, currentPage - 2)
      let end = Math.min(totalPages, currentPage + 2)

      if (currentPage <= 3) {
        start = 1
        end = 5
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 4
        end = totalPages
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
    }
    return pages
  }

  const pages = getPageNumbers()

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-navy-100 bg-white">
      {/* Items count summary */}
      <p className="text-xs text-navy-500 font-medium">
        Showing <span className="font-bold text-navy-900">{startItem}</span> to{' '}
        <span className="font-bold text-navy-900">{endItem}</span> of{' '}
        <span className="font-bold text-navy-900">{totalItems}</span> results
      </p>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Prev */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="grid h-8 w-8 place-items-center rounded-xl border border-navy-200 text-xs font-semibold text-navy-700 transition hover:bg-navy-50 disabled:opacity-35 disabled:pointer-events-none"
          aria-label="Previous Page"
        >
          <FaChevronLeft />
        </button>

        {/* Page numbers */}
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`grid h-8 min-w-[32px] px-2 place-items-center rounded-xl text-xs font-bold transition ${
              p === currentPage
                ? 'bg-navy-900 text-gold-400 shadow-sm'
                : 'border border-navy-200 text-navy-700 hover:bg-navy-50'
            }`}
          >
            {p}
          </button>
        ))}

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="grid h-8 w-8 place-items-center rounded-xl border border-navy-200 text-xs font-semibold text-navy-700 transition hover:bg-navy-50 disabled:opacity-35 disabled:pointer-events-none"
          aria-label="Next Page"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  )
}
