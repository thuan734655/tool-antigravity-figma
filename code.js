// Show the plugin UI (which runs ui.html and handles WebSocket)
figma.showUI(__html__, { width: 250, height: 110, themeColors: true });

// Listen for messages forwarded from the UI thread (WebSocket server)
figma.ui.onmessage = async (msg) => {
  if (msg.action === 'eval') {
    try {
      console.log(`[Figma AI Bridge] Evaluating code: \n${msg.code}`);
      
      // Execute the code in an async IIFE context so the AI can use 'await'
      const runCode = async () => {
        // We use eval in this scope to allow code execution
        // The code can access the global 'figma' object directly
        return await eval(`(async () => {
          ${msg.code}
        })()`);
      };

      const result = await runCode();
      
      // Send success response back to the UI thread (which forwards to WebSocket)
      figma.ui.postMessage({
        id: msg.id,
        success: true,
        result: result !== undefined ? JSON.parse(JSON.stringify(result)) : null
      });
    } catch (err) {
      console.error('[Figma AI Bridge] Eval error:', err);
      
      // Send error response back
      figma.ui.postMessage({
        id: msg.id,
        success: false,
        error: err.toString()
      });
    }
  }
};
