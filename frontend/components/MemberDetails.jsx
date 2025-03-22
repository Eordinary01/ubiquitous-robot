'use client'
import React,{useEffect, useState} from "react";
import {
    ChevronLeft,
    ChevronRight,
    Save,
    Plus,
    Minus,
    AlertCircle,
    Loader,
  } from "lucide-react";
function MemberDetails({updateData}) {
  const [basicInfo, setBasicInfo] = useState({
    healthInfo: {
      medicalConditions: [""],
      allergies: [""],
      bloodGroup: "",
    },
  });

  // useEffect(()=>{
  //   updateData(basicInfo)
  // },[basicInfo,updateData])

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setBasicInfo((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setBasicInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addArrayField = (type, index) => {
    setBasicInfo((prev) => ({
      ...prev,
      healthInfo: {
        ...prev.healthInfo,
        [type]: [...prev.healthInfo[type], ""],
      },
    }));
  };

  const removeArrayField = (type, index) => {
    setBasicInfo((prev) => ({
      ...prev,
      healthInfo: {
        ...prev.healthInfo,
        [type]: prev.healthInfo[type].filter((_, i) => i !== index),
      },
    }));
  };

  const handleArrayChange = (type, index, value) => {
    setBasicInfo((prev) => ({
      ...prev,
      healthInfo: {
        ...prev.healthInfo,
        [type]: prev.healthInfo[type].map((item, i) =>
          i === index ? value : item
        ),
      },
    }));
  };
  return (
    <div className="space-y-6 text-indigo-800">
      <h2 className="text-xl font-semibold">Health Information</h2>

      <div>
        <label className="block text-sm font-medium mb-1">
          Blood Group
        </label>
        <input
          type="text"
          name="healthInfo.bloodGroup"
          value={basicInfo.healthInfo.bloodGroup}
          onChange={handleBasicInfoChange}
          className="w-full p-2 border rounded"
          placeholder="Enter blood group"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Medical Conditions
        </label>
        {basicInfo.healthInfo.medicalConditions.map(
          (condition, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={condition}
                onChange={(e) =>
                  handleArrayChange(
                    "medicalConditions",
                    index,
                    e.target.value
                  )
                }
                className="flex-1 p-2 border rounded"
                placeholder="Enter medical condition"
              />
              <button
                type="button"
                onClick={() =>
                  removeArrayField("medicalConditions", index)
                }
                className="p-2 text-red-500 hover:bg-red-50 rounded"
              >
                <Minus size={20} />
              </button>
            </div>
          )
        )}
        <button
          type="button"
          onClick={() => addArrayField("medicalConditions")}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
        >
          <Plus size={20} /> Add Medical Condition
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Allergies
        </label>
        {basicInfo.healthInfo.allergies.map((allergy, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={allergy}
              onChange={(e) =>
                handleArrayChange("allergies", index, e.target.value)
              }
              className="flex-1 p-2 border rounded"
              placeholder="Enter allergy"
            />
            <button
              type="button"
              onClick={() => removeArrayField("allergies", index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded"
            >
              <Minus size={20} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayField("allergies")}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
        >
          <Plus size={20} /> Add Allergy
        </button>
      </div>
    </div>
  );
}

export default MemberDetails;
