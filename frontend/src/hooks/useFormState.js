import { useCallback, useState } from 'react';

export const useFormState = (initialState) => {
  const [formData, setFormData] = useState(initialState);

  const updateField = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }, []);

  const resetForm = useCallback(
    (nextState = initialState) => {
      setFormData(nextState);
    },
    [initialState]
  );

  return {
    formData,
    setFormData,
    updateField,
    resetForm,
  };
};
