import React from 'react';
import { Button } from "@/components/ui/button";


const PrototypeNotice: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow-100 border-t border-yellow-400 p-4 text-yellow-700 text-sm text-center">
      <p>This is a prototype created for my kids and will be improved in the future. It is not production-ready, but is available for all to use.</p>
      <Button onClick={onClose} className="mt-2 inline-block" variant="outline">
        Acknowledge
      </Button>
    </div>
  );
};

export default PrototypeNotice;
