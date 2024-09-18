import React, { useState } from "react";

const CreateEventForm = () => {
  const [event, setEvent] = useState({
    title: "",
    location: "",
    description: "",
    summary: "",
    startDate: new Date(),
    endDate: new Date(),
    image: "",
    skills: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleSkillsChange = (e) => {
    const { value } = e.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      skills: value.split(",").map(skill => skill.trim()),
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvent((prevEvent) => ({
          ...prevEvent,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Event created:", event);
    console.log(Meteor.call("CreateEvent", event))
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Create Event</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          value={event.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Location</label>
        <input
          type="text"
          name="location"
          value={event.location}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={event.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Summary</label>
        <textarea
          name="summary"
          value={event.summary}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Start Date</label>
        <input
          type="datetime-local"
          name="startDate"
          value={event.startDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">End Date</label>
        <input
          type="datetime-local"
          name="endDate"
          value={event.endDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
        <input
          type="text"
          name="skills"
          value={event.skills.join(", ")}
          onChange={handleSkillsChange}
          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-500">
        Create Event
      </button>
    </form>
  );
};

export default CreateEventForm;
