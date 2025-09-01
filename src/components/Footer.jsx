import React, { useState } from 'react';

const Footer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex space-x-4">
          {/* Add an "About" button */}
          <button onClick={openModal} className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">
            About
          </button>
        </div>
        <div className="flex space-x-4">
          {/* You casn add other links or social icons here if needed */}
        </div>
      </div>  
      <div className="text-center mt-4">
        <p>&copy; {new Date().getFullYear()} Declan Doolin. All rights reserved.</p>
      </div>

      {/* Modal for "About" section */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 text-gray-900">
            <h2 className="text-lg font-semibold mb-4">About SnapCompile</h2>
            <p>SnapCompile was created to provide a seamless, accessible platform for code testing and development. It is designed to provide mutliple language options, making it easier for users to improve their coding skills without the need for complex setups. </p>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;

