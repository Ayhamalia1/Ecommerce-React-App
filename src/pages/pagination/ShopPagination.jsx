import React from 'react'
import ReactPaginate from "react-paginate";
import './Pagination.css'


function ShopPagination({handlePageClick ,PageCount}) {
  return (
<>
  <ReactPaginate
    previousLabel="السابق"
    nextLabel="التالي"
    breakLabel="..."
    pageCount={PageCount}
    marginPagesDisplayed={1}
    pageRangeDisplayed={3}
    onPageChange={handlePageClick}
    containerClassName="pagination"
    pageClassName="page-item"
    pageLinkClassName="page-link"
    previousClassName="page-item"
    previousLinkClassName="page-link"
    nextClassName="page-item"
    nextLinkClassName="page-link"
    breakClassName="page-item"
    breakLinkClassName="page-link"
    activeClassName="active"
  />
</>  )
}

export default ShopPagination