'use client';

import { useEffect } from "react";
import { toast } from "sonner";

export default function ToastTrigger({ message }: { message?: string }) {
  useEffect(() => {
    if (message) {
      toast(message);
    }
  }, [message]);

  return null;
}