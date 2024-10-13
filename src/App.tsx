import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import WorkflowTransition from './components/WorkflowTransition';
import Loader from './components/Loader';
import { fetchWorkflowTransitions, performTransition } from './api/workflowApi';

interface Transition {
  SprFlujoAccionID: number;
  Accion: string;
  EstadoInicial: string;
  EstadoFinal: string;
}

function App() {
  const [transitions, setTransitions] = useState<Transition[]>([]);
  const [currentState, setCurrentState] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    const loadTransitions = async () => {
      try {
        const data = await fetchWorkflowTransitions();
        setTransitions(data);
        if (data.length > 0) {
          setCurrentState(data[0].EstadoInicial);
        }
      } catch (err) {
        setError('Failed to load transitions');
      } finally {
        setLoading(false);
        setInitializing(false);
      }
    };

    loadTransitions();
  }, []);

  const handleTransition = async (transition: Transition, direction: 'forward' | 'backward') => {
    try {
      setLoading(true);
      const flujo = direction === 'forward' ? 1 : -1;
      await performTransition(1, transition.Accion, flujo, 1, 1);
      setCurrentState(direction === 'forward' ? transition.EstadoFinal : transition.EstadoInicial);
    } catch (err) {
      setError('Failed to perform transition');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (state: string) => {
    setCurrentState(state);
  };

  if (initializing) {
    return <Loader isLoading={true} />;
  }

  return (
    <>
      <Loader isLoading={loading} />
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Workflow Transitions</h1>
          {error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex items-center justify-center mb-6">
                <CheckCircle2 className="text-green-500 mr-2" />
                <span className="text-lg font-semibold">Current State: {currentState}</span>
              </div>
              <div className="space-y-4">
                {transitions.map((transition) => (
                  <div key={transition.SprFlujoAccionID} className="flex items-center justify-between">
                    <WorkflowTransition
                      transition={transition}
                      currentState={currentState}
                      onTransition={handleTransition}
                    />

                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;