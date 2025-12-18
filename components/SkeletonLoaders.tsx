import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col h-full animate-pulse">
      <div className="aspect-video bg-gray-200 w-full"></div>
      <div className="p-3 md:p-5 flex flex-col flex-grow">
        <div className="flex items-center mb-3 space-x-2">
           <div className="h-3 bg-gray-200 rounded w-1/4"></div>
           <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="h-4 md:h-6 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 md:h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
        
        <div className="hidden md:block space-y-2 mb-4 flex-grow">
           <div className="h-3 bg-gray-200 rounded w-full"></div>
           <div className="h-3 bg-gray-200 rounded w-full"></div>
           <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
           <div className="h-3 bg-gray-200 rounded w-16"></div>
           <div className="h-3 bg-gray-200 rounded w-10"></div>
        </div>
      </div>
    </div>
  );
};

export const SkeletonHero: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto mt-4 md:mt-6 px-4 sm:px-6 lg:px-8 mb-8 animate-pulse">
        <div className="rounded-xl md:rounded-2xl bg-gray-200 h-[200px] sm:h-[350px] md:h-[450px] w-full relative">
            <div className="absolute bottom-0 left-0 p-4 md:p-12 w-full max-w-4xl space-y-3">
                <div className="h-4 bg-gray-300 rounded w-20"></div>
                <div className="h-8 md:h-12 bg-gray-300 rounded w-3/4"></div>
                <div className="hidden md:block h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
        </div>
    </div>
  );
};

export const SkeletonPostDetail: React.FC = () => {
    return (
        <div className="bg-white min-h-screen font-sans animate-pulse">
             {/* Header Image */}
             <div className="w-full h-[300px] md:h-[500px] bg-gray-200 relative">
                <div className="absolute bottom-0 left-0 w-full p-4 md:p-12 lg:p-20 max-w-7xl mx-auto">
                    <div className="h-4 bg-gray-300 rounded w-24 mb-4"></div>
                    <div className="h-8 md:h-12 bg-gray-300 rounded w-full mb-2"></div>
                    <div className="h-8 md:h-12 bg-gray-300 rounded w-3/4 mb-6"></div>
                    <div className="flex space-x-4">
                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                    </div>
                </div>
             </div>

             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                         {/* Content lines */}
                         <div className="space-y-4 mb-10">
                             <div className="h-4 bg-gray-200 rounded w-full"></div>
                             <div className="h-4 bg-gray-200 rounded w-full"></div>
                             <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                             <div className="h-4 bg-gray-200 rounded w-full"></div>
                         </div>
                         <div className="h-64 bg-gray-200 rounded-xl mb-10"></div>
                         <div className="space-y-4">
                             <div className="h-4 bg-gray-200 rounded w-full"></div>
                             <div className="h-4 bg-gray-200 rounded w-11/12"></div>
                             <div className="h-4 bg-gray-200 rounded w-full"></div>
                         </div>
                    </div>
                    
                    {/* Sidebar Skeleton */}
                     <aside className="lg:col-span-4 space-y-8 hidden lg:block">
                        <div className="h-64 bg-gray-100 rounded-xl"></div>
                        <div className="h-96 bg-gray-100 rounded-xl"></div>
                     </aside>
                </div>
             </div>
        </div>
    )
}