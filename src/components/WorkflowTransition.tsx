import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface Transition {
  SprFlujoAccionID: number;
  Accion: string;
  EstadoInicial: string;
  EstadoFinal: string;
}

interface WorkflowTransitionProps {
  transition: Transition;
  currentState: string;
  onTransition: (transition: Transition, direction: 'forward' | 'backward') => void;
}

const WorkflowTransition: React.FC<WorkflowTransitionProps> = ({ transition, currentState, onTransition }) => {
  const canMoveForward = currentState === transition.EstadoInicial;
  const canMoveBackward = currentState === transition.EstadoFinal;

  return (
    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md flex-grow">
      <button
        onClick={() => onTransition(transition, 'backward')}
        disabled={!canMoveBackward}
        className={`flex items-center ${
          canMoveBackward ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400'
        }`}
      >
        <ArrowLeft className="mr-2" />
        {transition.EstadoInicial}
      </button>
      <span className="text-sm font-medium text-gray-500">{transition.Accion}</span>
      <button
        onClick={() => onTransition(transition, 'forward')}
        disabled={!canMoveForward}
        className={`flex items-center ${
          canMoveForward ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400'
        }`}
      >
        {transition.EstadoFinal}
        <ArrowRight className="ml-2" />
      </button>

</div>
  );
};

export default WorkflowTransition;