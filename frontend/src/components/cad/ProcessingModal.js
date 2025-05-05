import React from 'react';

const ProcessingModal = ({ isOpen, progress, fileName }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-5">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Đang xử lý...</h2>
          <p className="text-sm text-neutral-medium mt-1">
            Chúng tôi đang xử lý tệp CAD của bạn. Vui lòng đợi trong giây lát.
          </p>
        </div>
        
        <div className="mb-5">
          <div className="flex items-center mb-2">
            <i className="ri-file-chart-line text-xl text-primary mr-2"></i>
            <span className="truncate">{fileName}</span>
          </div>
          
          <div className="w-full bg-neutral-bg rounded-full h-2 mb-1">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-neutral-medium">
            <span>Đang xử lý...</span>
            <span>{progress}%</span>
          </div>
        </div>
        
        <div className="text-center text-sm text-neutral-medium">
          {progress < 100 ? (
            <p>Đang phân tích cấu trúc và trích xuất các đối tượng...</p>
          ) : (
            <p>Hoàn tất! Đang tải dữ liệu...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessingModal;