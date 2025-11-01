# Optical Setup Designer

A research-grade web application for designing and visualizing 2D optical systems in real-time.

## Description

This interactive tool allows users to build complex optical setups by placing components on a grid. It features a real-time ray tracing engine that visualizes how light propagates through the system, providing immediate feedback on the design. An integrated AI Assistant, powered by the Gemini API, can generate entire setups from simple text descriptions.

## Key Features

*   **Visual Editor**: Drag-and-drop interface for placing, moving, and rotating components.
*   **Real-time Ray Tracing**: Instantly visualize the path of light rays as you modify the setup.
*   **Component Library**: Includes essential optical elements:
    *   Lasers
    *   Mirrors
    *   Convex & Concave Lenses
    *   Beam Splitters
    *   Detectors
*   **Dynamic Properties**: Select any component to edit its specific properties (e.g., wavelength, focal length, reflectivity).
*   **AI-Powered Generation**: Use the AI Assistant to generate complex optical layouts from natural language prompts.
*   **Interactive View Controls**: Pan and zoom the canvas for precise adjustments.
*   **JSON Export**: Save your complete optical setup, including all component properties and global settings, to a JSON file.

## Tech Stack

*   **Frontend**: React, TypeScript
*   **Styling**: Tailwind CSS
*   **AI**: Google Gemini API (`@google/genai`)

## How to Use

1.  **Add Components**: Drag components from the "Components" palette on the left and drop them onto the grid.
2.  **Move Components**: Click and drag a component on the grid to change its position.
3.  **Rotate Components**: Select a component, then hold `Shift` and use your mouse wheel to rotate it. You can also use the rotation slider in the Properties Panel.
4.  **Edit Properties**: Click on a component to select it. Its properties will appear in the panel on the right, where you can make adjustments.
5.  **Navigate the Grid**:
    *   **Pan**: Click and drag the middle mouse button.
    *   **Zoom**: Use the mouse wheel.
6.  **Use the AI Assistant**: Type a description of the setup you want (e.g., "a simple spectrometer") into the AI Assistant box and click "Generate Setup".
7.  **Export**: Click the "Download JSON" button to save your work.

## Project Structure

```
/
├── components/         # React components for UI elements (Grid, Palette, etc.)
├── hooks/              # Custom React hooks (e.g., useOpticalSetup for state management)
├── services/           # Core logic (e.g., rayTracer.ts)
├── utils/              # Helper functions (color conversion, vector math)
├── App.tsx             # Main application component
├── index.tsx           # Entry point for React
├── types.ts            # TypeScript type definitions for the application
└── index.html          # Main HTML file
```
