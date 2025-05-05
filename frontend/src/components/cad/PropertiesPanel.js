import React, { useState } from 'react';

const PropertiesPanel = ({ selectedEntity, onClose }) => {
  const [activeTab, setActiveTab] = useState('properties');
  
  if (!selectedEntity) {
    return (
      <div className="properties-panel bg-white border-l border-neutral-light w-64 overflow-y-auto p-4">
        <div className="text-center text-neutral-medium py-8">
          <i className="ri-cursor-line text-3xl mb-2"></i>
          <p className="text-sm">Chọn một đối tượng để xem chi tiết</p>
        </div>
      </div>
    );
  }
  
  // Helper to format property name for display
  const formatPropertyName = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };
  
  // Helper to determine if a property should be shown
  const shouldShowProperty = (key, value) => {
    return (
      key !== 'id' && 
      key !== 'type' && 
      key !== 'layer' && 
      typeof value !== 'object' &&
      typeof value !== 'function'
    );
  };
  
  return (
    <div className="properties-panel bg-white border-l border-neutral-light w-64 overflow-y-auto">
      <div className="p-3 border-b border-neutral-light flex items-center justify-between">
        <h3 className="font-medium">Chi tiết đối tượng</h3>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-neutral-medium hover:text-neutral-dark p-1"
          >
            <i className="ri-close-line"></i>
          </button>
        )}
      </div>
      
      <div className="tabs border-b border-neutral-light flex">
        <button
          className={`px-4 py-2 text-sm ${
            activeTab === 'properties' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-neutral-medium'
          }`}
          onClick={() => setActiveTab('properties')}
        >
          Thuộc tính
        </button>
        <button
          className={`px-4 py-2 text-sm ${
            activeTab === 'style' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-neutral-medium'
          }`}
          onClick={() => setActiveTab('style')}
        >
          Kiểu hiển thị
        </button>
      </div>
      
      <div className="p-3">
        <div className="mb-4">
          <div className="flex items-center p-2 bg-neutral-bg rounded-lg mb-3">
            <div className="mr-3 w-8 h-8 bg-primary text-white rounded flex items-center justify-center">
              <i className={`ri-shape-line text-lg`}></i>
            </div>
            <div>
              <div className="text-sm font-medium">{selectedEntity.type}</div>
              <div className="text-xs text-neutral-medium">ID: {selectedEntity.id.substring(0, 8)}</div>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="text-xs text-neutral-medium block mb-1">Loại</label>
            <div className="text-sm">{selectedEntity.type}</div>
          </div>
          
          <div className="mb-3">
            <label className="text-xs text-neutral-medium block mb-1">Lớp</label>
            <div className="text-sm">{selectedEntity.layer}</div>
          </div>
        </div>
        
        {activeTab === 'properties' && (
          <div>
            <h4 className="text-xs uppercase text-neutral-medium font-medium mb-2">Thuộc tính</h4>
            
            {Object.entries(selectedEntity.properties).map(([key, value]) => (
              shouldShowProperty(key, value) && (
                <div key={key} className="mb-3">
                  <label className="text-xs text-neutral-medium block mb-1">
                    {formatPropertyName(key)}
                  </label>
                  <div className="text-sm">{value.toString()}</div>
                </div>
              )
            ))}
          </div>
        )}
        
        {activeTab === 'style' && (
          <div>
            <h4 className="text-xs uppercase text-neutral-medium font-medium mb-2">Hiển thị</h4>
            
            <div className="mb-3">
              <label className="text-xs text-neutral-medium block mb-1">Màu</label>
              <div className="flex items-center">
                <div 
                  className="w-5 h-5 rounded mr-2" 
                  style={{ backgroundColor: selectedEntity.properties.color || '#333333' }}
                ></div>
                <span className="text-sm">{selectedEntity.properties.color || '#333333'}</span>
              </div>
            </div>
            
            <div className="mb-3">
              <label className="text-xs text-neutral-medium block mb-1">Hiển thị</label>
              <select className="w-full p-1 border border-neutral-light rounded text-sm">
                <option value="visible">Hiển thị</option>
                <option value="hidden">Ẩn</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;