import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ size }: { size?: number }) => {
  return <Loader2 size={size || 32} className="animate-spin" />;
};

export default LoadingSpinner;
