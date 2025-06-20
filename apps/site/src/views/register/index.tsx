'use client';

import CanisterRegistryForm from './CanisterRegistryForm';

export function CanisterRegistry() {
  const handleSubmit = (formData: any) => {
    console.log('Form submitted:', formData);
    // TODO: Add API call to submit the form
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Actions Registry</h1>

      <p className="text-lg mb-6">
        Register your Action to unfurl your Blink on Twitter.
      </p>

      <div className="bg-white  p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">General Guidelines</h2>
        <p className="mb-4">
          Due to a high volume of inbound submissions, it may take a few days
          for approval. Thank you for your patience.
        </p>
        {/* <hr className="my-4 border-gray-300 dark:border-gray-600" /> */}
        {/* <p className="mb-4">
          If your submission is rejected and you wish to appeal, please open a
          ticket in our Discord:{' '}
          <a
            href="https://discord.gg/saydialect"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            https://discord.gg/saydialect
          </a>{' '}
          and provide detailed information regarding your submission.
        </p> */}
        <hr className="my-4 border-gray-300 dark:border-gray-600" />
        <p>
          Please make sure you provide a sample URL you would want to tweet to
          ensure accurate mapping between blink/action.
        </p>
      </div>

      <CanisterRegistryForm onSubmit={handleSubmit} />
    </div>
  );
}
