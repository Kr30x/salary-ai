"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Page = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [prediction, setPrediction] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically call your AI model API
    // For this example, we'll just set a random salary
    setPrediction(Math.floor(Math.random() * 100000) + 30000);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

          {/* Main content */}
          <div className="m-8 relative space-y-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-2">Salary Predictor AI</h1>
              <p className="text-gray-300">Enter your job description to predict your salary</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter job description..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <Button 
                type="submit" 
                className="w-full group relative px-4 py-2 text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 transition-transform group-hover:translate-x-1">
                  <ArrowRight className="h-5 w-5" />
                </span>
                Predict Salary
              </Button>
            </form>

            {prediction && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg text-white text-center">
                <p className="text-lg">Predicted Salary:</p>
                <p className="text-3xl font-bold">${prediction.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;