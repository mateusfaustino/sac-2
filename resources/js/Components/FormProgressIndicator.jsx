import React from 'react';

const FormProgressIndicator = ({ steps, currentStep, onStepClick }) => {
    return (
        <div className="mb-8">
            <div className="flex justify-between relative">
                {/* Progress line */}
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10">
                    <div 
                        className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    ></div>
                </div>
                
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;
                    const isFuture = stepNumber > currentStep;
                    
                    return (
                        <div 
                            key={index}
                            className={`flex flex-col items-center cursor-pointer ${onStepClick ? '' : 'cursor-default'}`}
                            onClick={() => onStepClick && onStepClick(stepNumber)}
                        >
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                                ${isCompleted ? 'bg-green-500 text-white' : ''}
                                ${isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-200' : ''}
                                ${isFuture ? 'bg-white border-2 border-gray-300 text-gray-500' : ''}
                            `}>
                                {isCompleted ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                ) : (
                                    stepNumber
                                )}
                            </div>
                            <div className={`
                                mt-2 text-sm font-medium text-center
                                ${isCompleted ? 'text-green-600' : ''}
                                ${isCurrent ? 'text-blue-600' : ''}
                                ${isFuture ? 'text-gray-500' : ''}
                            `}>
                                {step.title}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FormProgressIndicator;