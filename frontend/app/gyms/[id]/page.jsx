'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Clock, MapPin, Phone, Mail, Dumbbell, Star, CreditCard, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Import shadcn components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GymDetailsPage() {
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const { token } = useAuth();

  useEffect(() => {
    const fetchGymDetails = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gyms/${params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch gym details');
        }

        const data = await response.json();
        setGym(data.data.gym);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (params.id) {
      fetchGymDetails();
    }
  }, [params.id]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600 flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-12 w-12 text-white animate-spin" />
      <div className="text-white text-2xl font-medium">Loading gym details...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-r from-red-600 to-pink-600 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-none text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" onClick={() => window.history.back()}>Go Back</Button>
        </CardFooter>
      </Card>
    </div>
  );

  if (!gym) return (
    <div className="min-h-screen bg-gradient-to-r from-gray-600 to-slate-700 flex items-center justify-center">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-none text-white">
        <CardHeader>
          <CardTitle className="text-2xl">No Gym Found</CardTitle>
          <CardDescription className="text-gray-200">The requested gym does not exist or has been removed.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="secondary" onClick={() => window.history.back()}>Go Back</Button>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Avatar className="h-24 w-24 bg-white/20 backdrop-blur-md border-4 border-white/30 shadow-lg">
              <AvatarFallback className="text-3xl font-bold">{gym.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
                {gym.name}
              </h1>
              <div className="flex items-center space-x-2 text-gray-200">
                <MapPin className="w-5 h-5" />
                <p className="text-lg">
                  {gym.address.street}, {gym.address.city}, {gym.address.state} {gym.address.zipCode}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="membership">Membership</TabsTrigger>
          </TabsList>

          {/* Gym Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-indigo-700">
                  <Dumbbell className="mr-3 h-6 w-6" />
                  Gym Information
                </CardTitle>
                <CardDescription>
                  Contact information and operating hours for {gym.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-full">
                          <Phone className="h-5 w-5 text-indigo-600" />
                        </div>
                        <span className="text-gray-700">{gym.contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-full">
                          <Mail className="h-5 w-5 text-indigo-600" />
                        </div>
                        <span className="text-gray-700">{gym.contact.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Operating Hours</h3>
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 p-2 rounded-full">
                        <Clock className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-gray-700 font-medium">
                          {gym.operatingHours.openTime} - {gym.operatingHours.closeTime}
                        </div>
                        <div className="text-sm text-gray-500">
                          Open: {gym.operatingHours.daysOpen.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Location</h3>
                  <div className="bg-gray-200 rounded-lg h-48 flex items-center justify-center">
                    <p className="text-gray-500">Map placeholder - Integration required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Amenities Tab */}
          <TabsContent value="amenities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-indigo-700">
                  <Star className="mr-3 h-6 w-6" />
                  Available Amenities
                </CardTitle>
                <CardDescription>
                  Features and facilities available at {gym.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {gym.amenities.map((amenity) => (
                    <div 
                      key={amenity}
                      className="bg-white border border-indigo-100 rounded-lg p-4 text-center hover:shadow-md transition-all duration-300"
                    >
                      <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        <Dumbbell className="h-6 w-6 text-indigo-600" />
                      </div>
                      <h3 className="font-medium text-gray-800">{amenity}</h3>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Membership Tab */}
          <TabsContent value="membership" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-indigo-700">
                  <CreditCard className="mr-3 h-6 w-6" />
                  Membership Plans
                </CardTitle>
                <CardDescription>
                  Choose a plan that works for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {gym.memberShipPlans.map((plan) => (
                    <Card 
                      key={plan.name}
                      className="border-2 border-indigo-100 hover:border-indigo-300 transition-all duration-300"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl text-indigo-800">{plan.name}</CardTitle>
                        <CardDescription>{plan.duration} Plan</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-extrabold text-indigo-600">
                          ${plan.price}
                          <span className="text-sm font-normal text-gray-500">/{plan.duration.toLowerCase()}</span>
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                          Select Plan
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}