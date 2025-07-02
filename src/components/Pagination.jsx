export default function Pagination({currentPage,itemsPerPage,totalPages,totalResults,onPageChange}) {
    const maxPagesToShow = 5;

  // Display range: Showing X to Y of Z
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(startItem + itemsPerPage - 1, totalResults);

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const middleStart = Math.max(2, currentPage - 1);
      const middleEnd = Math.min(totalPages - 1, currentPage + 1);

      pages.push(1); // First page

      if (middleStart > 2) {
        pages.push("...");
      }

      for (let i = middleStart; i <= middleEnd; i++) {
        pages.push(i);
      }

      if (middleEnd < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages); // Last page
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-6 text-center flex flex-col items-center gap-3">
      {/* Showing X to Y of Z */}
      <div className="text-white text-md">
        Showing <span className="font-medium">{startItem}</span> to{" "}
        <span className="font-medium">{endItem}</span> of{" "}
        <span className="font-medium">{totalResults.toLocaleString()}</span> results
      </div>

      {/* Page Numbers */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
        >
          Prev
        </button>

        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span key={'dot-'+ index} className="px-3 py-1 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-blue-500 text-white cursor-pointer"
                  : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}