import React, { useState } from 'react';

const UploadModal = ({ isOpen, onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      setSelectedFile(null);
      return;
    }
    
    // Validate file type (DXF or DWG)
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (fileExtension !== 'dxf' && fileExtension !== 'dwg') {
      setError('Chỉ chấp nhận tệp tin DXF hoặc DWG.');
      setSelectedFile(null);
      return;
    }
    
    setError('');
    setSelectedFile(file);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Vui lòng chọn một tệp tin.');
      return;
    }
    
    onUpload(selectedFile);
    setSelectedFile(null);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tải lên tệp CAD</h2>
          <button 
            onClick={onClose}
            className="text-neutral-medium hover:text-neutral-dark"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium">Tệp tin CAD</label>
            <div className="border-2 border-dashed border-neutral-light rounded-lg p-4 text-center">
              {selectedFile ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <i className="ri-file-chart-line text-xl text-primary mr-2"></i>
                    <span className="truncate">{selectedFile.name}</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-neutral-medium hover:text-danger"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              ) : (
                <div>
                  <i className="ri-upload-cloud-2-line text-3xl text-neutral-medium mb-2"></i>
                  <p className="text-sm text-neutral-medium mb-2">
                    Kéo thả hoặc nhấp vào đây để tải lên
                  </p>
                  <p className="text-xs text-neutral-medium">
                    Chỉ chấp nhận tệp tin DXF, DWG
                  </p>
                </div>
              )}
              
              <input
                type="file"
                accept=".dxf,.dwg"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            
            {error && <p className="mt-2 text-xs text-danger">{error}</p>}
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-light rounded-lg text-sm hover:bg-neutral-bg"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!selectedFile}
              className={`px-4 py-2 rounded-lg text-sm text-white ${
                selectedFile ? 'bg-primary hover:bg-primary-dark' : 'bg-neutral-light cursor-not-allowed'
              }`}
            >
              Tải lên
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;