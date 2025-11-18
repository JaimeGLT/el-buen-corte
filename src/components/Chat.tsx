import { useEffect } from 'react';

declare global {
  interface Window {
    voiceflow: any;
  }
}

const VoiceflowChat = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";
    script.type = "text/javascript";
    script.async = true;

    script.onload = () => { 
      if (window.voiceflow) {
        window.voiceflow.chat.load({
          verify: { projectID: '679e30c40cacc3ebde02991c' },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'production',
          voice: {
            url: "https://runtime-api.voiceflow.com"
          }
        });
      }
    };

    document.body.appendChild(script);

    // Cleanup al desmontar el componente
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null; // No necesitamos renderizar nada
};

export default VoiceflowChat;
