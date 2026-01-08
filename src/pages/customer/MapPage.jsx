import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Navigation } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardContent } from '../../components/common/Card';

const MapPage = () => {
  const navigate = useNavigate();
  const { vendors } = useAppData();

  return (
    <div className="min-h-screen bg-gray-50 max-w-mobile mx-auto md:max-w-tablet lg:max-w-desktop">
      <div className="bg-white p-4 sticky top-0 z-20 shadow-sm flex items-center justify-between">
        <button onClick={() => navigate('/customer')} className="flex items-center text-sm text-gray-700">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        <div className="font-bold text-gray-900">Map</div>
        <div className="w-10" />
      </div>

      <div className="p-4 space-y-4">
        {/* Map with vendor pins */}
        <div className="relative bg-gray-100 rounded-xl overflow-hidden h-[calc(100vh-12rem)]">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=77.5896,12.9666,77.5996,12.9766&layer=mapnik&marker=12.9716,77.5946"
            className="absolute inset-0 w-full h-full border-0"
            title="Map view"
            loading="lazy"
          />
          <div className="absolute top-2 left-2 bg-white rounded-lg shadow-md px-2 py-1.5 flex items-center gap-1 text-xs text-gray-700">
            <MapPin size={12} />
            <span className="font-medium">MG Road, Bengaluru</span>
          </div>
          <div className="absolute bottom-2 right-2 bg-white rounded-lg shadow-md p-1.5">
            <Navigation size={16} className="text-indigo-600" />
          </div>
          
          {/* Vendor Pins Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {vendors.slice(0, 5).map((vendor, index) => (
              <div
                key={vendor.id}
                className="absolute bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shadow-lg"
                style={{
                  top: `${20 + (index * 15)}%`,
                  left: `${15 + (index * 20)}%`,
                }}
              >
                {vendor.name.charAt(0)}
              </div>
            ))}
          </div>
        </div>

        {/* Vendor List */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-bold text-gray-800 mb-3">Nearby Vendors</h3>
            <div className="space-y-2">
              {vendors.slice(0, 5).map((vendor) => (
                <div
                  key={vendor.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate(`/customer/vendor/${vendor.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden">
                      <img
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{vendor.name}</p>
                      <p className="text-sm text-gray-600">{vendor.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-indigo-600">{vendor.distance}</p>
                    <p className="text-xs text-gray-500">{vendor.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MapPage;
