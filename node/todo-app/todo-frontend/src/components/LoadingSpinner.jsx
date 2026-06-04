const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-10">
      <div 
        className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-black"
      ></div>
    </div>
  );
};

export default LoadingSpinner;