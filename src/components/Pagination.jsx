export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, index) => index + 1);

  return (
    <nav className="pagination" aria-label="Product pagination">
      <button type="button" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        ← Previous
      </button>
      {pages.map((pageNumber) => (
        <button
          className={page === pageNumber ? 'active' : ''}
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
      <button type="button" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        Next →
      </button>
    </nav>
  );
}
