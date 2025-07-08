import { STRIKE_ACTION_REGEX } from '@/config';
import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  telegram: string;
  twitter: string;
  projectName: string;
  description: string;
  canisterId: string;
  strikeCardLink: string;
}

interface CanisterRegistryFormProps {
  onSubmit: (data: FormData) => void;
}

const CanisterRegistryForm = ({ onSubmit }: CanisterRegistryFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    telegram: '',
    twitter: '',
    projectName: '',
    description: '',
    canisterId: '',
    strikeCardLink: '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setError(null);
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleClearAll = () => {
    setFormData({
      name: '',
      email: '',
      telegram: '',
      twitter: '',
      projectName: '',
      description: '',
      canisterId: '',
      strikeCardLink: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      new URL(formData.strikeCardLink) &&
      STRIKE_ACTION_REGEX.test(formData.strikeCardLink)
    ) {
      formData.strikeCardLink =
        window.location.origin +
        '/action?url=icp-action:' +
        formData.strikeCardLink;
    } else {
      setError(
        'Please provide a valid Strike Action URL that ends with "actions.json".',
      );
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="mb-1 text-sm font-medium text-gray-500"
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            required
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="email"
            className="mb-1 text-sm font-medium text-gray-500"
          >
            Email <span className="text-red-500">*</span>
          </label>
          <input
            required
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="telegram"
            className="mb-1 text-sm font-medium text-gray-500"
          >
            Telegram
          </label>
          <input
            id="telegram"
            name="telegram"
            type="text"
            value={formData.telegram}
            onChange={handleChange}
            placeholder="@username"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="twitter"
            className="mb-1 text-sm font-medium text-gray-500"
          >
            Twitter
          </label>
          <input
            id="twitter"
            name="twitter"
            type="text"
            value={formData.twitter}
            onChange={handleChange}
            placeholder="@username"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="projectName"
            className="mb-1 text-sm font-medium text-gray-500"
          >
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            required
            id="projectName"
            name="projectName"
            type="text"
            value={formData.projectName}
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="description"
            className="mb-1 text-sm font-medium text-gray-500"
          >
            Briefly explain your canister{' '}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="canisterId"
            className="mb-1 text-sm font-medium text-gray-500"
          >
            Canister ID <span className="text-red-500">*</span>
          </label>
          <input
            required
            id="canisterId"
            name="canisterId"
            type="text"
            value={formData.canisterId}
            onChange={handleChange}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="strikeCardLink"
            className="mb-1 text-sm font-medium text-gray-500"
          >
            Strike Action Link <span className="text-red-500">*</span>
          </label>
          <input
            required
            id="strikeCardLink"
            name="strikeCardLink"
            type="text"
            value={formData.strikeCardLink}
            onChange={handleChange}
            placeholder="https://strike.oranj.co/actions.json"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={handleClearAll}
            className="px-4 py-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Clear All
          </button>

          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default CanisterRegistryForm;
