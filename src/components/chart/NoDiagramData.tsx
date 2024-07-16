import React from "react";

/**
 * NoDiagramData component that displays a message when no data is selected for the diagrams.
 * @returns {JSX.Element} - The rendered NoDiagramData component.
 */
const NoDiagramData = (): JSX.Element => {
  return (
    <div className="p-6 text-danube-900 text-sm text-center bg-danube-50 w-full">
      Please use the dropdown menus to select data for the diagrams. No data currently selected.
    </div>
  );
};

export default NoDiagramData;
