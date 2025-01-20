import React from 'react';

const Help: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Help & Documentation</h1>
      
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Getting Started</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Learn how to create your first QR code in just a few simple steps.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">QR Code Types</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Explore different types of QR codes and their specific use cases.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Customization Options</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Discover how to customize your QR codes with colors, logos, and styles.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">FAQ</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Find answers to commonly asked questions about QR code generation and usage.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Help;
