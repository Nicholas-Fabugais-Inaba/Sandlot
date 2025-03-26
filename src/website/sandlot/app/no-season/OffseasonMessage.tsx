import React from "react";

const OffseasonMessage: React.FC = () => {
  return (
    <div className="text-center mt-10">
      <p className="text-lg font-bold text-white-600">
        Cannot view page as league is in offseason.
      </p>
    </div>
  );
};

export default OffseasonMessage;