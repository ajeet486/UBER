import React from "react";

const LocationSearchPanel = (props) => {
  // Use suggestions from props, fallback to empty array
  const locations =
    props.suggestions && props.suggestions.length > 0 ? props.suggestions : [];

  return (
    <div>
      {locations.map(function (elem, idx) {
        return (
          <div
            key={idx}
            onClick={() => {
              props.onSuggestionClick(elem);
              // props.setVehiclePanel(true);
            }}
            className="flex gap-4 items-center border-2 border-gray-100 active:border-black rounded-xl p-3  my-2 justify-start"
          >
            <h2 className="bg-[#eee] h-8 w-12 flex items-center  justify-center rounded-full">
              <i className="ri-map-pin-line "></i>
            </h2>
            <h4 className="font-medium"> {elem} </h4>
          </div>
        );
      })}
    </div>
  );
};

export default LocationSearchPanel;
