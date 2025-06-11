import React from "react";

function ContextMenu({ data }) {
  return (
    <div
      className={`z-50 w-48 fixed right-5 top-20 border rounded-xl shadow-xl
      bg-white dark:bg-gray-900 border-gray-300 dark:border-teal-500`}
    >
      <ul className="py-2 text-sm text-gray-900 dark:text-[#1DBF73]">
        {data.map(({ name, callback }, index) => (
          <li
            key={index}
            onClick={callback}
            className="px-4 py-2 transition-all duration-200 ease-in-out 
            hover:bg-teal-100 hover:text-teal-900 
            dark:hover:bg-teal-700 dark:hover:text-white cursor-pointer"
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContextMenu;
