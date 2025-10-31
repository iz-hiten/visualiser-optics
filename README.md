# Optical Setup Designer

A modern, research-grade web application for designing and visualizing optical systems, featuring an AI-powered assistant to generate complex layouts from simple text prompts.

## Key Features

- **Intuitive Drag-and-Drop Interface:** Easily build complex optical setups by dragging components from the palette onto the canvas.
- **AI-Powered Setup Generation:** Describe an optical system (e.g., "a Michelson interferometer") and let the AI assistant generate the complete layout for you.
- **Infinite Pan & Zoom Canvas:** Effortlessly navigate large and intricate designs with intuitive pan (middle-mouse drag) and zoom (scroll wheel) controls.
- **Real-time Ray Tracing:** Instantly visualize how light propagates through your system as you build and modify it. The physics engine simulates reflection, refraction, and beam splitting.
- **Detailed Component Customization:** Select any component to fine-tune its properties, such as rotation, size, reflectivity, and focal length, in the dedicated properties panel.
- **Professional Schematic Visuals:** Components are rendered using clean, formal schematics inspired by academic publications, making your diagrams suitable for research papers and presentations.
- **JSON Export:** Save your entire optical setup, including all component properties and global settings, to a structured JSON file with a single click.

## How to Use

1.  **Add Components:** Drag components from the **Components** panel on the left onto the main grid.
2.  **Move Components:** Click and drag any component on the grid to reposition it.
3.  **Rotate Components:** Select a component and use the **Rotation** slider in the Properties Panel, or hold `Shift` and use the **mouse wheel** for fine adjustments.
4.  **Use the AI Assistant:** Type a description of your desired setup into the **AI Assistant** panel and click "Generate Setup". The AI will create the layout, and the view will automatically center on it.
5.  **Navigate the Canvas:**
    -   **Pan:** Hold down the **middle mouse button** (scroll wheel) and drag.
    -   **Zoom:** Use the **mouse scroll wheel**.
6.  **Export Your Design:** Click the **Download JSON** button in the Global Controls panel to save your work.

## Technologies Used

-   **Frontend:** React, TypeScript, Tailwind CSS
-   **AI:** Google Gemini API

---

