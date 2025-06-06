import React, { useState } from "react";

const Step3 = ({ formData, setFormData }) => {
  const [currentSkill, setCurrentSkill] = useState({ name: "", level: "" });
  const [currentLanguage, setCurrentLanguage] = useState({
    name: "",
    level: "",
  });
  const [error, setError] = useState(null);

  // Handle skill input changes
  const handleCurrentSkillChange = (e) => {
    const { name, value } = e.target;
    setCurrentSkill((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle language input changes
  const handleCurrentLanguageChange = (e) => {
    const { name, value } = e.target;
    setCurrentLanguage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add skill to form data
  const handleAddSkill = () => {
    if (!currentSkill.name.trim()) {
      setError("Please enter skill name");
      return;
    }
    if (!currentSkill.level.trim()) {
      setError("Please select skill level");
      return;
    }
    const updatedSkills = [...(formData.skills || []), currentSkill];
    setFormData((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
    setCurrentSkill({ name: "", level: "" });
    setError(null);
  };

  // Add language to form data
  const handleAddLanguage = () => {
    if (!currentLanguage.name.trim()) {
      setError("Please enter language name");
      return;
    }
    if (!currentLanguage.level.trim()) {
      setError("Please select language level");
      return;
    }
    const updatedLanguages = [...(formData.languages || []), currentLanguage];
    setFormData((prev) => ({
      ...prev,
      languages: updatedLanguages,
    }));
    setCurrentLanguage({ name: "", level: "" });
    setError(null);
  };

  // Remove skill by index
  const handleRemoveSkill = (index) => {
    const filteredSkills = (formData.skills || []).filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      skills: filteredSkills,
    }));
  };

  // Remove language by index
  const handleRemoveLanguage = (index) => {
    const filteredLanguages = (formData.languages || []).filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      languages: filteredLanguages,
    }));
  };

  const skills = formData.skills || [];
  const languages = formData.languages || [];

  return (
    <div className="space-y-8">
      {/* Skills Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Skills</h3>

        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 mb-6">
          <h4 className="text-md font-medium text-gray-800 mb-4">Add Skill</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="skill_name"
                className="block text-sm font-medium text-gray-700"
              >
                Skill Name *
              </label>
              <input
                type="text"
                name="name"
                id="skill_name"
                placeholder="e.g., Frontend Development"
                value={currentSkill.name}
                onChange={handleCurrentSkillChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="skill_level"
                className="block text-sm font-medium text-gray-700"
              >
                Skill Level *
              </label>
              <select
                name="level"
                id="skill_level"
                value={currentSkill.level}
                onChange={handleCurrentSkillChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddSkill}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            + Add Skill
          </button>
          {error && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded mt-3">
              {error}
            </div>
          )}
        </div>

        {skills.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skill Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skill Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {skills.map((skill, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {skill.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {skill.level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        className="text-red-600 hover:text-red-900 focus:outline-none"
                        aria-label="Remove skill"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No skills added yet. Add your first skill above.
          </div>
        )}
      </div>

      {/* Languages Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Your Languages
        </h3>

        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 mb-6">
          <h4 className="text-md font-medium text-gray-800 mb-4">
            Add Language
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="language_name"
                className="block text-sm font-medium text-gray-700"
              >
                Language Name *
              </label>
              <input
                type="text"
                name="name"
                id="language_name"
                value={currentLanguage.name}
                placeholder="e.g., English"
                onChange={handleCurrentLanguageChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="language_level"
                className="block text-sm font-medium text-gray-700"
              >
                Language Level *
              </label>
              <select
                name="level"
                id="language_level"
                value={currentLanguage.level}
                onChange={handleCurrentLanguageChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Level</option>
                <option value="basic">Basic</option>
                <option value="conversational">Conversational</option>
                <option value="fluent">Fluent</option>
                <option value="native">Native</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddLanguage}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            + Add Language
          </button>
          {error && (
            <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded mt-3">
              {error}
            </div>
          )}
        </div>

        {languages.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Language Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Language Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {languages.map((language, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {language.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {language.level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => handleRemoveLanguage(index)}
                        className="text-red-600 hover:text-red-900 focus:outline-none"
                        aria-label="Remove language"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            No languages added yet. Add your first language above.
          </div>
        )}
      </div>
    </div>
  );
};

export default Step3;
