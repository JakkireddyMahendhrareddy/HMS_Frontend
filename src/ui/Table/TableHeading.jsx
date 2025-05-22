const TableHeading = ({ headingList }) => {
  return (
    <thead className="bg-gray-100 top-0">
      <tr>
        {headingList.map((heading) => (
          <th
            key={heading}
            className="px-4 md:px-6 py-3 text-left font-semibold text-gray-700 tracking-wide whitespace-nowrap"
          >
            {heading}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeading;
