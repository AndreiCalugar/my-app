"use client";

import React, { createContext, useState } from "react";

interface FormData {
  destinations: string;
  travelTime: string;
  budget: string;
  tripType: string;
  activities: string;
}

interface FormDataContextProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

export const FormDataContext = createContext<FormDataContextProps | null>(null);

export const FormDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [formData, setFormData] = useState<FormData>({
    destinations: "",
    travelTime: "",
    budget: "",
    tripType: "",
    activities: "",
  });

  return (
    <FormDataContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};
