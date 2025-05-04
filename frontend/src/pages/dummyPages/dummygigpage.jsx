import React from "react";

function DummyGigsPage() {
  const gigs = [
    {
      id: 1,
      title: "Logo Design",
      category: "Graphics & Design",
      price: "$50",
      deliveryTime: "3 days",
    },
    {
      id: 2,
      title: "WordPress Website",
      category: "Web Development",
      price: "$200",
      deliveryTime: "7 days",
    },
    {
      id: 3,
      title: "SEO Audit Report",
      category: "Digital Marketing",
      price: "$75",
      deliveryTime: "2 days",
    },
  ];

  return (
    <div className="min-h-[80vh] my-10 mt-0 px-32">
      <h3 className="m-5 text-2xl font-semibold">All your Gigs</h3>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Delivery Time
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {gigs.map(({ title, category, price, deliveryTime, id }) => (
              <tr
                key={id}
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {title}
                </th>
                <td className="px-6 py-4">{category}</td>
                <td className="px-6 py-4">{price}</td>
                <td className="px-6 py-4">{deliveryTime}</td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => alert(`Edit gig ${id}`)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DummyGigsPage;
