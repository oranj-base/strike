import React from 'react';

const Header: React.FC = () => {
  const handleLearnMore = () => {
    chrome.tabs.create({
      url: 'https://docs.strike.oranj.co',
    });
  };

  return (
    <div className="pb-3 text-center">
      <h1 className="text-highlight font-bold mb-2">Enable Strike</h1>
      <p className="text-gray-600 mb-2">Turn on if you want to enable STRIKE</p>
      <div className="flex items-center justify-center gap-1">
        <span className="">What is strike</span>
        <button
          className="text-primary font-semibold hover:underline focus:outline-none"
          onClick={handleLearnMore}
        >
          Learn More
        </button>
      </div>
    </div>
  );
};

export default Header;
