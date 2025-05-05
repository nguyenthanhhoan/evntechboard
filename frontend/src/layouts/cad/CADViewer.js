import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';

// Components
import CADCanvas from '../components/cad/CADCanvas';
import PropertiesPanel from '../components/cad/PropertiesPanel';
import UploadModal from '../components/cad/UploadModal';
import ProcessingModal from '../components/cad/ProcessingModal';

const API_URL = 'http://localhost:8000/api';

const CADViewer = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isProcessingModalOpen, setIsProcessingModalOpen] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);
  
  // Fetch current CAD file
  const { data: cadFile, isLoading: isFileLoading } = useQuery({
    queryKey: ['currentCadFile'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}/cad/current/`);
        return response.data;
      } catch (error) {
        console.error('Error fetching CAD file:', error);
        return null;
      }
    }
  });
  
  // Upload file mutation
  const uploadFileMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      setIsProcessingModalOpen(true);
      setProcessingProgress(0);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      try {
        const response = await axios.post(`${API_URL}/cad/upload/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        clearInterval(progressInterval);
        setProcessingProgress(100);
        
        return response.data;
      } catch (error) {
        clearInterval(progressInterval);
        throw error;
      }
    },
    onSuccess: () => {
      setTimeout(() => {
        setIsProcessingModalOpen(false);
      }, 500);
    },
    onError: (error) => {
      console.error('Upload error:', error);
      setIsProcessingModalOpen(false);
      // Show error notification here
    }
  });
  
  const handleFileUpload = (file) => {
    setIsUploadModalOpen(false);
    uploadFileMutation.mutate(file);
  };
  
  const handleEntitySelect = (entity) => {
    setSelectedEntity(entity);
    if (!showPropertiesPanel) {
      setShowPropertiesPanel(true);
    }
  };
  
  const togglePropertiesPanel = () => {
    setShowPropertiesPanel(prev => !prev);
  };
  
  return (
    <div className="cad-viewer-page flex flex-col h-full">
      <div className="bg-white p-4 border-b border-neutral-light">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Công cụ xem CAD</h1>
            <p className="text-sm text-neutral-medium mt-1">
              {cadFile ? cadFile.name : 'Chưa có tệp CAD nào được tải lên'}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={togglePropertiesPanel}
              className="btn py-2 px-3 border border-neutral-light rounded-lg hover:bg-neutral-bg"
              aria-label="Toggle properties panel"
            >
              <i className={`ri-layout-right-2-line text-lg ${showPropertiesPanel ? 'text-primary' : ''}`}></i>
            </button>
            
            <button 
              onClick={() => setIsUploadModalOpen(true)}
              className="btn btn-primary"
            >
              <i className="ri-upload-2-line mr-2"></i>
              Tải lên tệp CAD
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {isFileLoading ? (
          <div className="flex-1 flex items-center justify-center bg-neutral-bg">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-neutral-medium">Đang tải...</p>
            </div>
          </div>
        ) : !cadFile ? (
          <div className="flex-1 flex items-center justify-center bg-neutral-bg">
            <div className="text-center p-8">
              <div className="inline-block p-4 bg-white rounded-full mb-4">
                <i className="ri-file-chart-line text-4xl text-primary"></i>
              </div>
              <h2 className="text-xl font-medium mb-2">Không có tệp CAD nào</h2>
              <p className="text-neutral-medium mb-4">
                Tải lên tệp DXF hoặc DWG để bắt đầu xem và chỉnh sửa.
              </p>
              <button 
                onClick={() => setIsUploadModalOpen(true)}
                className="btn btn-primary"
              >
                <i className="ri-upload-2-line mr-2"></i>
                Tải lên tệp CAD
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={`cad-canvas-container flex-1 ${!showPropertiesPanel ? 'w-full' : ''}`}>
              <CADCanvas 
                file={cadFile} 
                onEntitySelect={handleEntitySelect}
              />
            </div>
            
            {showPropertiesPanel && (
              <PropertiesPanel 
                selectedEntity={selectedEntity}
                onClose={() => setShowPropertiesPanel(false)}
              />
            )}
          </>
        )}
      </div>
      
      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />
      
      <ProcessingModal 
        isOpen={isProcessingModalOpen}
        progress={processingProgress}
        fileName={uploadFileMutation.variables?.name || ""}
      />
    </div>
  );
};

export default CADViewer;