import React from 'react';
import { ArrowRight, Star, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = ({ onShopNowClick }) => {
  const features = [
    {
      icon: <Star className="h-5 w-5" />,
      text: "Premium Quality"
    },
    {
      icon: <Truck className="h-5 w-5" />,
      text: "Fast Delivery"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      text: "Cash on Delivery"
    }
  ];

  return (
    <section id="home" className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Modern Fashion for
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Today's Teens
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-lg">
                Discover the latest trends in teen fashion. From casual wear to statement pieces, 
                find your perfect style with our curated collection of modern clothing.
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-700">
                  <div className="text-blue-600">
                    {feature.icon}
                  </div>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={onShopNowClick}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.querySelector('#reviews').scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 px-8 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                View Reviews
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">4.9</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              {/* Placeholder for hero image */}
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-2xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">TT</span>
                  </div>
                  <p className="text-gray-600 font-medium">Fashion Collection</p>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
