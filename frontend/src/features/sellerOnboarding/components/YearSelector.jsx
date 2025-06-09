import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const YearSelect = ({
  selectedYear,
  handleCurrentEducationChange,
  YearOptions,
}) => {
  return (
    <div className="w-full">
      <Listbox
        value={selectedYear}
        onChange={handleCurrentEducationChange}
      >
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
            <span className="block truncate">
              {selectedYear || "Select Year"}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white border border-gray-300 py-1 text-sm shadow-lg focus:outline-none">
            <Listbox.Option value="">
              {({ selected, active }) => (
                <div
                  className={`relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? "bg-blue-50 text-blue-900" : "text-gray-900"
                  }`}
                >
                  Select Year
                  {selected && (
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                      <CheckIcon className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                </div>
              )}
            </Listbox.Option>

            {YearOptions.map((year) => (
              <Listbox.Option key={year} value={year}>
                {({ selected, active }) => (
                  <div
                    className={`relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? "bg-blue-50 text-blue-900" : "text-gray-900"
                    }`}
                  >
                    {year}
                    {selected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <CheckIcon className="h-4 w-4" aria-hidden="true" />
                      </span>
                    )}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};

export default YearSelect;
