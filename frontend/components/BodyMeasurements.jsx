'use client'
import React,{useState} from 'react'

function BodyMeasurements() {
    const [measurements, setMeasurements] = useState({
        weight: "",
        height: "",
        chest: "",
        waist: "",
        hips: "",
        biceps: "",
        thighs: "",
        bodyFatPercentage: "",
        bmi: "",
      });
  return (
    <div className="space-y-6 text-indigo-900">
            <h2 className="text-xl font-semibold">Body Measurements</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(measurements).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type="number"
                    value={measurements[key]}
                    onChange={(e) =>
                      setMeasurements((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className="w-full p-2 border rounded"
                    placeholder={`Enter ${key}`}
                  />
                </div>
              ))}
            </div>
          </div>
  )
}

export default BodyMeasurements