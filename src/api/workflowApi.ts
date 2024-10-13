import transitions from '../data/transitions.json';

export const fetchWorkflowTransitions = async () => {
  // Simulating an API call with a delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return transitions;
};

export const performTransition = async (procesoId: number, accion: string, flujo: number, objId: number, userId: number) => {
  // Simulating an API call with a delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: 'Transition performed successfully' };
};