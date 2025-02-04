'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Building2, Mail, Lock, User, Phone, MapPin, FileText, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function Register() {
  const { register, error } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member',
    gymDetails: {
      name: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      },
      contact: {
        phone: '',
        email: ''
      },
      amenities: [],
      operatingHours: {
        openTime: '',
        closeTime: '',
        daysOpen: []
      },
      membershipPlans: [],
      isActive: true
    }
  });

  const AMENITIES_OPTIONS = [
    "Cardio Equipment",
    "Weight Training",
    "Group Classes",
    "Swimming Pool",
    "Sauna",
    "Locker Rooms",
    "Personal Training"
  ];

  const DAYS_OF_WEEK = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  const MEMBERSHIP_DURATIONS = ["Monthly", "Quarterly", "Annual"];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const [parent, field] = name.split('.');
      if (parent === 'amenities') {
        setFormData(prev => ({
          ...prev,
          gymDetails: {
            ...prev.gymDetails,
            amenities: checked 
              ? [...prev.gymDetails.amenities, value]
              : prev.gymDetails.amenities.filter(item => item !== value)
          }
        }));
        return;
      }
      if (parent === 'daysOpen') {
        setFormData(prev => ({
          ...prev,
          gymDetails: {
            ...prev.gymDetails,
            operatingHours: {
              ...prev.gymDetails.operatingHours,
              daysOpen: checked
                ? [...prev.gymDetails.operatingHours.daysOpen, value]
                : prev.gymDetails.operatingHours.daysOpen.filter(day => day !== value)
            }
          }
        }));
        return;
      }
    }
    
    // Handle nested object updates
    const keys = name.split('.');
    if (keys.length > 1) {
      setFormData(prev => {
        let newData = { ...prev };
        let current = newData;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]] = { ...current[keys[i]] };
        }
        
        current[keys[keys.length - 1]] = value;
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addMembershipPlan = () => {
    setFormData(prev => ({
      ...prev,
      gymDetails: {
        ...prev.gymDetails,
        membershipPlans: [
          ...prev.gymDetails.membershipPlans,
          { name: '', price: '', duration: 'Monthly' }
        ]
      }
    }));
  };

  const updateMembershipPlan = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      gymDetails: {
        ...prev.gymDetails,
        membershipPlans: prev.gymDetails.membershipPlans.map((plan, i) =>
          i === index ? { ...plan, [field]: value } : plan
        )
      }
    }));
  };

  const removeMembershipPlan = (index) => {
    setFormData(prev => ({
      ...prev,
      gymDetails: {
        ...prev.gymDetails,
        membershipPlans: prev.gymDetails.membershipPlans.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.role === 'gymOwner' && step === 1) {
        setStep(2);
        return;
      }
      
      await register(formData);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-xl border border-indigo-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-900 mb-2">
              {step === 1 ? 'Create Account' : 'Gym Details'}
            </h1>
            <p className="text-indigo-500">
              {step === 1 ? 'Join our fitness community today' : 'Tell us about your gym'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 ? (
              <div className="space-y-4">
                <div className="relative">
                  <label htmlFor="name" className="text-sm font-medium text-indigo-900 mb-1 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-indigo-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 w-full rounded-lg border border-indigo-200 bg-white py-3 px-4 text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="email" className="text-sm font-medium text-indigo-900 mb-1 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-indigo-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 w-full rounded-lg border border-indigo-200 bg-white py-3 px-4 text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="password" className="text-sm font-medium text-indigo-900 mb-1 block">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-indigo-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 w-full rounded-lg border border-indigo-200 bg-white py-3 px-4 text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="text-sm font-medium text-indigo-900 mb-1 block">
                    Account Type
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-indigo-200 bg-white py-3 px-4 text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="member">Gym Member</option>
                    <option value="gymOwner">Gym Owner</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Basic Info Section */}
                <div className="relative">
                  <label htmlFor="gymName" className="text-sm font-medium text-indigo-900 mb-1 block">
                    Gym Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-indigo-400" />
                    </div>
                    <input
                      type="text"
                      name="gymDetails.name"
                      value={formData.gymDetails.name}
                      onChange={handleInputChange}
                      className="pl-10 w-full rounded-lg border border-indigo-200 bg-white py-3 px-4 text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="FitZone Gym"
                      required
                    />
                  </div>
                </div>

                {/* Address Section */}
                <div className="space-y-4">
                  <div className="relative">
                    <label htmlFor="street" className="text-sm font-medium text-indigo-900 mb-1 block">
                      Street Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-indigo-400" />
                      </div>
                      <input
                        type="text"
                        name="gymDetails.address.street"
                        value={formData.gymDetails.address.street}
                        onChange={handleInputChange}
                        className="pl-10 w-full rounded-lg border border-indigo-200 bg-white py-3 px-4 text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="gymDetails.address.city"
                      value={formData.gymDetails.address.city}
                      onChange={handleInputChange}
                      className="rounded-lg border border-indigo-200 bg-white py-3 px-4 text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="City"
                      required
                    />
                    <input
                      type="text"
                      name="gymDetails.address.state"
                      value={formData.gymDetails.address.state}
                      onChange={handleInputChange}
                      className="rounded-lg border border-indigo-200 bg-white py-3 px-4 text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="State"
                      required
                    />
                  </div>

                  <input
                    type="text"
                    name="gymDetails.address.zipCode"
                    value={formData.gymDetails.address.zipCode}
                    onChange={handleInputChange}
                    className="rounded-lg border border-indigo-200 bg-white py-3 px-4 text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Zip Code"
                    required
                  />
                </div>

                {/* Contact Section */}
                <div className="space-y-4">
                  <div className="relative">
                    <label htmlFor="phone" className="text-sm font-medium text-indigo-900 mb-1 block">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-indigo-400" />
                      </div>
                      <input
                        type="tel"
                        name="gymDetails.contact.phone"
                        value={formData.gymDetails.contact.phone}
                        onChange={handleInputChange}
                        className="pl-10 w-full rounded-lg border border-indigo-200 bg-white py-3 px-4 text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="+1 (555) 000-0000"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="gymEmail" className="text-sm font-medium text-indigo-900 mb-1 block">
                      Gym Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-indigo-400" />
                      </div>
                      <input
                        type="email"
                        name="gymDetails.contact.email"
                        value={formData.gymDetails.contact.email}
                        onChange={handleInputChange}
                        className="pl-10 w-full rounded-lg border border-indigo-200 bg-white py-3 px-4 text-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="gym@example.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Operating Hours Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-indigo-900">Operating Hours</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-indigo-900 mb-1 block">
                        Opening Time
                      </label>
                      <input
                        type="time"
                        name="gymDetails.operatingHours.openTime"
                        value={formData.gymDetails.operatingHours.openTime}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-indigo-200 bg-white py-3 px-4"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-indigo-900 mb-1 block">
                        Closing Time
                      </label>
                      <input
                        type="time"
                        name="gymDetails.operatingHours.closeTime"
                        value={formData.gymDetails.operatingHours.closeTime}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-indigo-200 bg-white py-3 px-4"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-indigo-900 mb-1 block">
                      Days Open
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {DAYS_OF_WEEK.map(day => (
                        <label key={day} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name="daysOpen.days"
                            value={day}
                            checked={formData.gymDetails.operatingHours.daysOpen.includes(day)}
                            onChange={handleInputChange}
                            className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm text-gray-700">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Amenities Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-indigo-900">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {AMENITIES_OPTIONS.map(amenity => (
                      <label key={amenity} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="amenities.list"
                          value={amenity}
                          checked={formData.gymDetails.amenities.includes(amenity)}
                          onChange={handleInputChange}
                          className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Membership Plans Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-indigo-900">Membership Plans</h3>
                    <button
                      type="button"
                      onClick={addMembershipPlan}
                      className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Add Plan
                    </button>
                  </div>

                  {formData.gymDetails.membershipPlans.map((plan, index) => (
                    <div key={index} className="p-4 border border-indigo-200 rounded-lg space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-indigo-900">Plan {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeMembershipPlan(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-indigo-900 mb-1 block">
                            Plan Name
                          </label>
                          <input
                            type="text"
                            value={plan.name}
                            onChange={(e) => updateMembershipPlan(index, 'name', e.target.value)}
                            className="w-full rounded-lg border border-indigo-200 bg-white py-3 px-4"
                            placeholder="Basic Plan"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-indigo-900 mb-1 block">
                            Price
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <DollarSign className="h-5 w-5 text-indigo-400" />
                            </div>
                            <input
                              type="number"
                              value={plan.price}
                              onChange={(e) => updateMembershipPlan(index, 'price', e.target.value)}
                              className="pl-10 w-full rounded-lg border border-indigo-200 bg-white py-3 px-4"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-indigo-900 mb-1 block">
                            Duration
                          </label>
                          <select
                            value={plan.duration}
                            onChange={(e) => updateMembershipPlan(index, 'duration', e.target.value)}
                            className="w-full rounded-lg border border-indigo-200 bg-white py-3 px-4"
                            required
                          >
                            {MEMBERSHIP_DURATIONS.map(duration => (
                              <option key={duration} value={duration}>
                                {duration}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform transition-all duration-150 hover:scale-[1.02]"
            >
              {step === 1 ? (formData.role === 'gymOwner' ? 'Next' : 'Create Account') : 'Create Account'}
            </button>

            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full mt-4 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Back
              </button>
            )}
          </form>

          <p className="mt-8 text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
                  