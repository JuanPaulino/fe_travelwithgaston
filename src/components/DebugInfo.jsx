const DebugInfo = ({ pageData, slug }) => {
  if (import.meta.env.DEV) {
    return (
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Debug Info:</h3>
        <div className="space-y-1 text-sm">
          <p><strong>Slug:</strong> {slug}</p>
          <p><strong>Permalink:</strong> {pageData?.permalink}</p>
          <p><strong>Status:</strong> {pageData?.status}</p>
          <p><strong>Title:</strong> {pageData?.title}</p>
          <p><strong>Blocks Count:</strong> {pageData?.blocks?.length || 0}</p>
        </div>
      </div>
    );
  }
  
  return null;
};

export default DebugInfo; 