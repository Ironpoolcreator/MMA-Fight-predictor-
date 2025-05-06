import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { Fighter, FighterComparison as FighterComparisonType } from '../types';
import FighterComparisonComponent from '../components/FighterComparison';
import { getQueryFn, queryClient } from '../lib/queryClient';

export default function FighterComparisonPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedComparisonId, setSelectedComparisonId] = useState<number | null>(null);
  const [fighter1, setFighter1] = useState<Fighter | null>(null);
  const [fighter2, setFighter2] = useState<Fighter | null>(null);

  // Fetch user's saved comparisons
  const {
    data: userComparisons,
    isLoading: isLoadingComparisons,
  } = useQuery<FighterComparisonType[], Error>({
    queryKey: ['/api/fighter-comparisons/user'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!user, // Only run if user is logged in
  });

  // Fetch selected comparison details
  const {
    data: selectedComparison,
    isLoading: isLoadingSelectedComparison,
  } = useQuery<FighterComparisonType, Error>({
    queryKey: ['/api/fighter-comparisons', selectedComparisonId],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    enabled: !!selectedComparisonId, // Only run if a comparison is selected
  });

  // Fetch fighter details when a comparison is selected
  useEffect(() => {
    if (selectedComparison) {
      const fetchFighters = async () => {
        try {
          // Fetch fighter 1
          const fighter1Response = await fetch(`/api/fighters/${selectedComparison.fighter1Id}`);
          if (!fighter1Response.ok) throw new Error('Failed to fetch fighter 1');
          const fighter1Data = await fighter1Response.json();
          setFighter1(fighter1Data);

          // Fetch fighter 2
          const fighter2Response = await fetch(`/api/fighters/${selectedComparison.fighter2Id}`);
          if (!fighter2Response.ok) throw new Error('Failed to fetch fighter 2');
          const fighter2Data = await fighter2Response.json();
          setFighter2(fighter2Data);
        } catch (error) {
          console.error('Error fetching fighters:', error);
          toast({
            title: 'Error',
            description: 'Failed to load fighters for this comparison',
            variant: 'destructive',
          });
        }
      };

      fetchFighters();
    } else {
      setFighter1(null);
      setFighter2(null);
    }
  }, [selectedComparison, toast]);

  const handleSelectComparison = (id: number) => {
    setSelectedComparisonId(id);
  };

  const handleCreateNewComparison = () => {
    setSelectedComparisonId(null);
    setFighter1(null);
    setFighter2(null);
  };

  return (
    <div className="px-4 sm:container py-8">
      <div className="bg-black text-white px-6 py-4 mb-8">
        <h1 className="text-3xl font-extrabold uppercase tracking-wider mb-1">FIGHTER COMPARISON TOOL</h1>
        <p className="text-sm text-gray-300">Compare MMA fighters side-by-side and save your analyses</p>
      </div>
      
      {user && (
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <div>
              <h2 className="text-2xl font-bold uppercase">MY SAVED COMPARISONS</h2>
              <div className="h-1 w-20 bg-black mt-1"></div>
            </div>
            <button 
              className="px-5 py-3 bg-black text-white font-bold uppercase tracking-wide hover:bg-gray-800 transition"
              onClick={handleCreateNewComparison}
            >
              Create New Comparison
            </button>
          </div>
          
          {isLoadingComparisons ? (
            <div className="h-20 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : userComparisons && userComparisons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userComparisons.map(comparison => (
                <div 
                  key={comparison.id}
                  className={`border-2 cursor-pointer transition-colors ${
                    selectedComparisonId === comparison.id 
                      ? 'border-black bg-gray-100' 
                      : 'border-gray-300 hover:border-black'
                  }`}
                  onClick={() => handleSelectComparison(comparison.id)}
                >
                  <div className="bg-gray-100 p-3 border-b-2 border-gray-300">
                    <h3 className="font-bold uppercase">{comparison.title}</h3>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-gray-600">
                      Created: {new Date(comparison.createdAt).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    {comparison.notes && (
                      <p className="text-sm mt-2 line-clamp-2">{comparison.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 p-8 text-center border-2 border-gray-300">
              <p className="text-lg font-bold mb-2">NO SAVED COMPARISONS</p>
              <p className="text-gray-600">Create your first comparison to save it here</p>
            </div>
          )}
          
          <div className="border-t-2 border-black my-8"></div>
        </div>
      )}
      
      {selectedComparisonId && isLoadingSelectedComparison ? (
        <div className="h-40 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      ) : selectedComparisonId && selectedComparison && fighter1 && fighter2 ? (
        <div>
          <div className="bg-gray-100 border-l-4 border-black p-4 mb-6">
            <h2 className="text-2xl font-bold uppercase mb-1">{selectedComparison.title}</h2>
            <p className="text-sm text-gray-600">
              Created: {new Date(selectedComparison.createdAt).toLocaleDateString(undefined, { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          
          {selectedComparison.notes && (
            <div className="mb-8 p-5 bg-gray-100 border-l-4 border-gray-400">
              <h3 className="font-bold uppercase mb-2 text-sm">Analysis Notes</h3>
              <p className="text-sm">{selectedComparison.notes}</p>
            </div>
          )}
          
          <FighterComparisonComponent
            initialFighter1={fighter1}
            initialFighter2={fighter2}
            readOnly={true}
          />
        </div>
      ) : (
        <FighterComparisonComponent />
      )}
    </div>
  );
}