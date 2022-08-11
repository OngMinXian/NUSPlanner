import React from 'react'

const Pagination = ({ postsPerPage, totalPosts, paginate, pageNumber }) => {
  let pageNumbers = []

  for (
    let i = Math.max(1, pageNumber - 3);
    i <= Math.min(Math.ceil(totalPosts / postsPerPage), pageNumber + 3);
    i++
  ) {
    pageNumbers.push(i)
  }
  if (
    pageNumbers[0] === 1 &&
    pageNumbers.length < 7 &&
    Math.ceil(totalPosts / postsPerPage) > 7
  ) {
    pageNumbers = [1, 2, 3, 4, 5, 6, 7]
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <a onClick={() => paginate(number)} className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Pagination
