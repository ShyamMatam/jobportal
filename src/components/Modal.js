export default function Modal({ children, onClose }) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg w-3/4 h-3/4">
          <button onClick={onClose} className="float-right text-xl">&times;</button>
          {children}
        </div>
      </div>
    );
  }

  