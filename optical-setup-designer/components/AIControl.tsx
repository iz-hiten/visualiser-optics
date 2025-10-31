import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { OpticalComponentData, ComponentType } from '../types';

interface AIControlProps {
    onGenerated: (components: Omit<OpticalComponentData, 'id'>[]) => void;
}

const systemInstruction = `You are an expert optical engineer. Your task is to generate a JSON array of optical components based on a user's request.
- The user is working on a 2D grid. The origin (0,0) is at the top-left.
- Create functional, physically sensible layouts.
- Space components reasonably apart to create a clear and understandable diagram. A good minimum spacing is 5-10 units.
- For a LASER, its rotation determines the direction of the beam. 0 degrees points right, 90 points down. NEVER set a laser's rotation to exactly 0, use 360 or 1 instead.
- For a MIRROR, its rotation is the angle of its surface normal. A mirror at 45 degrees will deflect a horizontal beam (0 deg) downwards (90 deg).
- The 'size' property is a multiplier. 'large' could be size 2, 'small' could be 0.75. Default is 1.
- You must return only a valid JSON array of component objects, with no other text or explanation.`;

const componentSchema = {
  type: Type.OBJECT,
  properties: {
    type: {
      type: Type.STRING,
      description: 'Must be one of: LASER, MIRROR, CONVEX_LENS, CONCAVE_LENS, BEAM_SPLITTER, DETECTOR.'
    },
    position: {
      type: Type.OBJECT,
      properties: {
        x: { type: Type.NUMBER, description: 'X coordinate. Can be positive or negative.' },
        y: { type: Type.NUMBER, description: 'Y coordinate. Can be positive or negative.' }
      },
      required: ['x', 'y']
    },
    rotation: {
      type: Type.NUMBER,
      description: 'Rotation angle in degrees (0-360). For LASER, this must not be 0.'
    },
    size: { type: Type.NUMBER, description: 'Size multiplier (e.g., 0.5 for small, 1 for normal, 2 for large).' },
    focalLength: { type: Type.NUMBER, description: 'Required for CONVEX_LENS and CONCAVE_LENS.' },
  },
  required: ['type', 'position', 'rotation']
};

const AIControl: React.FC<AIControlProps> = ({ onGenerated }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Request: "${prompt}"`,
                config: {
                    systemInstruction: systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: componentSchema
                    },
                },
            });
            
            const jsonString = response.text;
            let generatedComponents = JSON.parse(jsonString) as Omit<OpticalComponentData, 'id'>[];

            if (!Array.isArray(generatedComponents)) {
                throw new Error("AI did not return a valid component array.");
            }
            
            // Post-processing to ensure no laser is at 0 rotation
            generatedComponents = generatedComponents.map(c => {
                if (c.type === ComponentType.LASER && c.rotation === 0) {
                    return {...c, rotation: 360};
                }
                return c;
            });

            onGenerated(generatedComponents);

        } catch (e) {
            console.error("Error generating setup:", e);
            setError(e instanceof Error ? e.message : "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col p-4 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-center border-b border-gray-200 pb-2 text-gray-900">AI Assistant</h2>
            <p className="text-sm text-gray-500 mb-3">Describe the optical setup you want to create.</p>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A Michelson interferometer with large mirrors"
                className="w-full bg-gray-50 text-gray-900 rounded-md p-2 text-sm focus:ring-2 focus:ring-accent focus:outline-none mb-3 border border-gray-300"
                rows={3}
            />
            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full bg-accent hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Generating...' : 'Generate Setup'}
            </button>
            {error && <p className="text-xs text-red-500 mt-2">Error: {error}</p>}
        </div>
    );
};

export default AIControl;