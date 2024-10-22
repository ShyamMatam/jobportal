import { ImSpinner2 } from 'react-icons/im';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <div className="text-center">
        <ImSpinner2 className="animate-spin text-blue-500 text-6xl mb-4 mx-auto" />
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}
