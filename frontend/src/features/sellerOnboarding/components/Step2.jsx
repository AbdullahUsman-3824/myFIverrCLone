import React, { useState } from "react";
import YearSelector from "./YearSelector";

const Step2 = ({ formData, setFormData }) => {
  const [currentEducation, setCurrentEducation] = useState({
    institution_name: "",
    degree_title: "",
    start_year: "",
    end_year: "",
  });
  const [error, setError] = useState(null);

  const handleCurrentEducationChange = (eOrField, maybeValue) => {
    if (typeof eOrField === "string") {
      const field = eOrField;
      const value = maybeValue;
      setCurrentEducation((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else if (eOrField && eOrField.target) {
      const { name, value } = eOrField.target;
      setCurrentEducation((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddEducation = () => {
    // Check if all required fields are filled
    if (!currentEducation.institution_name.trim()) {
      setError("Please enter institution name");
      return;
    }

    // Add current education to formData
    const updatedEducations = [
      ...(formData.educations || []),
      currentEducation,
    ];
    setFormData((prev) => ({
      ...prev,
      educations: updatedEducations,
    }));

    // Reset current education form
    setCurrentEducation({
      institution_name: "",
      degree_title: "",
      start_year: "",
      end_year: "",
    });
  };

  const handleRemoveEducation = (index) => {
    const filteredEducations = formData.educations.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      educations: filteredEducations,
    }));
  };

  const educations = formData.educations || [];
  const currentYear = new Date().getFullYear();
  const startYearOptions = Array.from(
    { length: 50 },
    (_, i) => currentYear - i
  );
  const endYearOptions = Array.from(
    { length: 60 },
    (_, i) => currentYear - 50 + i
  );

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Your Education</h3>

      {/* Education Input Form */}
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <h4 className="text-md font-medium text-gray-800 mb-4">
          Add Education
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="institution_name"
              className="block text-sm font-medium text-gray-700"
            >
              Institution Name *
            </label>
            <input
              type="text"
              name="institution_name"
              id="institution_name"
              value={currentEducation.institution_name}
              onChange={handleCurrentEducationChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Harvard University"
            />
          </div>

          <div>
            <label
              htmlFor="degree_title"
              className="block text-sm font-medium text-gray-700"
            >
              Degree Title
            </label>
            <input
              type="text"
              name="degree_title"
              id="degree_title"
              value={currentEducation.degree_title}
              onChange={handleCurrentEducationChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Bachelor of Computer Science"
            />
          </div>
          <div>
            <label
              htmlFor="start_year"
              className="block text-sm font-medium text-gray-700"
            >
              Start Year
            </label>
            <YearSelector
              selectedYear={currentEducation.start_year}
              handleCurrentEducationChange={(value) =>
                handleCurrentEducationChange("start_year", value)
              }
              YearOptions={startYearOptions}
            />
          </div>

          <div>
            <label
              htmlFor="end_year"
              className="block text-sm font-medium text-gray-700"
            >
              End Year
            </label>
            <YearSelector
              selectedYear={currentEducation.end_year}
              handleCurrentEducationChange={(value) =>
                handleCurrentEducationChange("end_year", value)
              }
              YearOptions={endYearOptions}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddEducation}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          + Add Education
        </button>
        {error && (
          <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded mt-3">
            {error}
          </div>
        )}
      </div>

      {/* Education Table */}
      {educations.length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium text-gray-800 mb-4">
            Added Education
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Institution
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Degree
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {educations.map((education, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {education.institution_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {education.degree_title || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {education.start_year && education.end_year
                        ? `${education.start_year} - ${education.end_year}`
                        : education.start_year || education.end_year || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(index)}
                        className="text-red-600 hover:text-red-900 focus:outline-none"
                        aria-label="Remove education"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {educations.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          No education added yet. Add your first education above.
        </div>
      )}
    </div>
  );
};

export default Step2;
