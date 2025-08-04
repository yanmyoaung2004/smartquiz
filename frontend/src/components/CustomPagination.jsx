import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

const CustomPagination = ({ pageNumber, totalPages, onPageChange }) => {
  const maxVisiblePages = 5;

  const shouldShowLeftEllipsis = pageNumber > 2;
  const shouldShowRightEllipsis = pageNumber < totalPages - 3;

  const pageRange = () => {
    const range = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        range.push(i);
      }
    } else {
      range.push(0); // Always show the first page

      if (shouldShowLeftEllipsis) {
        range.push("left-ellipsis");
      }

      const start = Math.max(1, pageNumber - 1);
      const end = Math.min(totalPages - 2, pageNumber + 1);

      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      if (shouldShowRightEllipsis) {
        range.push("right-ellipsis");
      }

      range.push(totalPages - 1); // Always show the last page
    }

    return range;
  };

  const renderPage = (i) => {
    if (i === "left-ellipsis" || i === "right-ellipsis") {
      return (
        <PaginationItem key={i}>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    return (
      <PaginationItem key={i}>
        <PaginationLink
          href="#"
          isActive={i === pageNumber}
          onClick={(e) => {
            e.preventDefault();
            onPageChange(i);
          }}
        >
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    );
  };

  const displayedPages = pageRange();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (pageNumber > 0) onPageChange(pageNumber - 1);
            }}
          />
        </PaginationItem>

        {displayedPages.map(renderPage)}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (pageNumber < totalPages - 1) onPageChange(pageNumber + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
